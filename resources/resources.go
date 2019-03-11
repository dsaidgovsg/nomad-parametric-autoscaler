package resources

import (
	"time"

	"github.com/datagovsg/nomad-parametric-autoscaler/logging"
)

// Resource. each resource needs to control its scaling
// also needs to return information where needed
type Resource interface {
	Scale(count int, vc *VaultClient) error
	GetNomadClientCount() int
	ResourceName() string
	RecreateResourcePlan() ResourcePlan
}

// Resource each resource has a compute component and a nomad component
type EC2NomadResource struct {
	EC2AutoScalingGroup
	NomadClient

	Cooldown            string
	NomadToComputeRatio int
	Name                string
	lastScaledTime      time.Time // if now - time < cooldown, reject scaling
}

type ResourcePlan struct {
	EC2AutoScalingGroupPlan `json:"EC2"`
	NomadClientPlan         `json:"Nomad"`
	Cooldown                string `json:"Cooldown"`
	NomadToComputeRatio     int    `json:"N2CRatio"`
}

func (rp ResourcePlan) ApplyPlan(name string, vc VaultClient) Resource {
	nc := rp.NomadClientPlan.ApplyPlan(vc)
	easg := rp.EC2AutoScalingGroupPlan.ApplyPlan()
	return &EC2NomadResource{
		NomadClient:         *nc,
		EC2AutoScalingGroup: *easg,
		Cooldown:            rp.Cooldown,
		NomadToComputeRatio: rp.NomadToComputeRatio,
		Name:                name,
	}
}

// Scale receives a desired nomad count and scales both nomad + ec2 accordingly
func (res *EC2NomadResource) Scale(desiredNomadCount int, vc *VaultClient) error {

	// check if its a scale up or scale down
	if count, err := res.NomadClient.GetTaskGroupCount(); err == nil {
		if count < desiredNomadCount { // scale up
			return res.scaleUp(desiredNomadCount, vc)
		} else if count > desiredNomadCount {
			return res.scaleDown(desiredNomadCount, vc)
		} else {
			logging.Info("Existing count is already at desired count. No scaling.")
			return nil
		}
	} else {
		return err
	}
}

// scaleUp - scale up - ec2 then nomad
func (res *EC2NomadResource) scaleUp(desiredNomadCount int, vc *VaultClient) error {
	err := res.EC2AutoScalingGroup.Scale(desiredNomadCount * res.NomadToComputeRatio)
	if err != nil {
		return err
	}

	err = res.NomadClient.Scale(desiredNomadCount, vc)
	if err != nil {
		return err
	}

	res.lastScaledTime = time.Now()
	return nil
}

// scaleDown - scale down - nomad then ec2
func (res *EC2NomadResource) scaleDown(desiredNomadCount int, vc *VaultClient) error {
	err := res.NomadClient.Scale(desiredNomadCount, vc)
	if err != nil {
		return err
	}

	err = res.EC2AutoScalingGroup.Scale(desiredNomadCount * res.NomadToComputeRatio)
	if err != nil {
		return err
	}

	res.lastScaledTime = time.Now()
	return nil
}

// GetNomadClientCount gets nomad client count via Resource type
func (res EC2NomadResource) GetNomadClientCount() int {
	count, err := res.NomadClient.GetTaskGroupCount()
	if err != nil {
		return -1
	}
	return count
}

func (res EC2NomadResource) ResourceName() string {
	return res.Name
}

func (res EC2NomadResource) RecreateResourcePlan() ResourcePlan {
	return ResourcePlan{
		NomadClientPlan:         res.NomadClient.RecreatePlan(),
		EC2AutoScalingGroupPlan: res.EC2AutoScalingGroup.RecreatePlan(),
		Cooldown:                res.Cooldown,
		NomadToComputeRatio:     res.NomadToComputeRatio,
	}
}
