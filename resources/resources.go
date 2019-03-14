package resources

import (
	"fmt"
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

	ScaleUpCooldown     time.Duration
	ScaleDownCooldown   time.Duration
	NomadToComputeRatio int
	Name                string
	lastScaledTime      time.Time // if now - time < cooldown, reject scaling
}

type ResourcePlan struct {
	EC2AutoScalingGroupPlan `json:"EC2"`
	NomadClientPlan         `json:"Nomad"`
	ScaleDownCooldown       string `json:"ScaleDownCooldown"`
	ScaleUpCooldown         string `json:"ScaleUpCooldown"`
	NomadToComputeRatio     int    `json:"N2CRatio"`
}

func (rp ResourcePlan) ApplyPlan(name string, vc VaultClient) (Resource, error) {
	nc, err := rp.NomadClientPlan.ApplyPlan(vc)
	if err != nil {
		return nil, err
	}

	easg := rp.EC2AutoScalingGroupPlan.ApplyPlan()

	dcd, err := time.ParseDuration(rp.ScaleDownCooldown)
	if err != nil {
		dcd = 300 * time.Second //  default 5 minute cooldown for scaling down
	}

	ucd, err := time.ParseDuration(rp.ScaleUpCooldown)
	if err != nil {
		ucd = 5 * time.Second //  default 5 seconds cooldown for scaling up
	}

	return &EC2NomadResource{
		NomadClient:         *nc,
		EC2AutoScalingGroup: *easg,
		ScaleDownCooldown:   dcd,
		ScaleUpCooldown:     ucd,
		NomadToComputeRatio: rp.NomadToComputeRatio,
		Name:                name,
	}, nil
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
	now := time.Now()
	if time.Since(res.lastScaledTime) < res.ScaleUpCooldown {
		return fmt.Errorf("Too soon to scale again")
	}

	res.lastScaledTime = now

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
	now := time.Now()
	if time.Since(res.lastScaledTime) < res.ScaleDownCooldown {
		return fmt.Errorf("Too soon to scale again")
	}

	res.lastScaledTime = now
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
		ScaleUpCooldown:         res.ScaleUpCooldown.String(),
		ScaleDownCooldown:       res.ScaleDownCooldown.String(),
		NomadToComputeRatio:     res.NomadToComputeRatio,
	}
}
