package resources

import (
	"fmt"

	"github.com/datagovsg/nomad-parametric-autoscaler/logging"
	nomad "github.com/hashicorp/nomad/api"
)

type NomadClientPlan struct {
	Address   string `json:"Address"`
	JobName   string `json:"JobName"`
	NomadPath string `json:"NomadPath"`
	MaxCount  int    `json:"MaxCount"`
	MinCount  int    `json:"MinCount"`
}

// NomadClient contains details to access our nomad client
type NomadClient struct {
	JobName   string
	NomadPath string
	client    nomadClient
	maxCount  int
	minCount  int
	address   string
}

// wrapper? maybe we dont need this
type nomadClient struct {
	nomad *nomad.Client
}

func (ncp NomadClientPlan) ApplyPlan(vc VaultClient) *NomadClient {
	return NewNomadClient(vc, ncp.Address, ncp.JobName, ncp.MinCount, ncp.MaxCount, ncp.NomadPath)
}

// NewNomadClient is a factory that produces a new NewNomadClient
func NewNomadClient(vc VaultClient, addr string, name string, minCount int, maxCount int, nomadPath string) *NomadClient {
	nc := nomad.DefaultConfig()
	nc.Address = addr

	token, err := vc.GetNomadToken(nomadPath)
	if err != nil {
		fmt.Println(err)
	}
	nc.SecretID = token

	client, err := nomad.NewClient(nc)
	if err != nil {
		fmt.Println("ERROR")
		fmt.Println(err)
	}

	return &NomadClient{
		JobName:  name,
		maxCount: maxCount,
		minCount: minCount,
		client: nomadClient{
			nomad: client,
		},
		address: addr,
	}
}

// GetTaskGroupCount retrieves the jobspec to check task group count
func (nc NomadClient) GetTaskGroupCount() (int, error) {
	job, err := nc.getNomadJob()
	if err != nil {
		return 0, err
	}
	return *job.TaskGroups[0].Count, nil
}

// Scale get json -> find number -> change number, add vault token -> convert to json
func (nc NomadClient) Scale(newCount int, vc *VaultClient) error {
	job, err := nc.getNomadJob()
	if err != nil {
		return err
	}

	tg := job.TaskGroups[0]
	oldCount := *tg.Count
	*tg.Count = newCount
	*job.VaultToken = vc.GetVaultToken()

	logging.Info("Old nomad: %d. Desired nomad: %d", oldCount, newCount)

	_, _, err = nc.client.nomad.Jobs().Register(job, &nomad.WriteOptions{})
	if err != nil {
		logging.Error(err.Error())
		return err
	}

	count, _ := nc.GetTaskGroupCount()
	logging.Info("Old nomad: %d. New nomad: %d", oldCount, count)
	return nil
}

// getNomadJob - private method that fetches the nomad jobspec for this resource
func (nc NomadClient) getNomadJob() (*nomad.Job, error) {
	job, _, err := nc.client.nomad.Jobs().Info(nc.JobName, &nomad.QueryOptions{})
	if err != nil {
		return nil, err
	}
	return job, nil
}

func (nc NomadClient) RecreatePlan() NomadClientPlan {
	return NomadClientPlan{
		Address:   nc.address,
		JobName:   nc.JobName,
		NomadPath: nc.NomadPath,
		MaxCount:  nc.maxCount,
		MinCount:  nc.minCount,
	}
}
