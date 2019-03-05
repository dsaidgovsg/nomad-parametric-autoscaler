package resources

import (
	"fmt"
	"time"
)

// Resource each resource has a compute component and a nomad component
type Resource struct {
	EC2AutoScalingGroup `json:"EC2"`
	NomadClient         `json:"Nomad"`

	Cooldown            string    `json:"Cooldown"`
	NomadToComputeRatio int       `json:"N2CRatio"`
	lastScaledTime      time.Time // if now - time < cooldown, reject scaling
}

// Scale receives a desired nomad count and scales both nomad + ec2 accordingly
func (res *Resource) Scale(desiredNomadCount int, vc *VaultClient) error {

	// check if its a scale up or scale down
	if count, err := res.NomadClient.GetTaskGroupCount(); err == nil {
		if count < desiredNomadCount { // scale up
			return res.scaleUp(desiredNomadCount, vc)
		} else if count < desiredNomadCount {
			return res.scaleDown(desiredNomadCount, vc)
		} else {
			fmt.Println("Existing count is already at desired count. No scaling.")
			return nil
		}
	} else {
		return err
	}
}

// scaleUp - scale up - ec2 then nomad
func (res *Resource) scaleUp(desiredNomadCount int, vc *VaultClient) error {
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
func (res *Resource) scaleDown(desiredNomadCount int, vc *VaultClient) error {
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
func (res Resource) GetNomadClientCount() int {
	count, err := res.NomadClient.GetTaskGroupCount()
	if err != nil {
		return -1
	}
	return count
}
