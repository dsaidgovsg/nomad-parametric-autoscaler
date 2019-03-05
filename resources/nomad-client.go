package resources

import (
	"fmt"

	"github.com/datagovsg/nomad-parametric-autoscaler/logging"
	nomad "github.com/hashicorp/nomad/api"
)

// NomadClient contains details to access our nomad client
type NomadClient struct {
	jobName       string
	client        nomadClient
	maxCount      int
	minCount      int
	clientAddress string
}

// wrapper? maybe we dont need this
type nomadClient struct {
	nomad *nomad.Client
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
		jobName:  name,
		maxCount: maxCount,
		minCount: minCount,
		client: nomadClient{
			nomad: client,
		},
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
	*tg.Count = newCount
	*job.VaultToken = vc.GetVaultToken()

	resp, _, err := nc.client.nomad.Jobs().Register(job, &nomad.WriteOptions{})
	if err != nil {
		return err
	}

	logging.Info("%v", resp)
	return nil
}

// getNomadJob - private method that fetches the nomad jobspec for this resource
func (nc NomadClient) getNomadJob() (*nomad.Job, error) {
	job, _, err := nc.client.nomad.Jobs().Info(nc.jobName, &nomad.QueryOptions{})
	if err != nil {
		return nil, err
	}
	return job, nil
}
