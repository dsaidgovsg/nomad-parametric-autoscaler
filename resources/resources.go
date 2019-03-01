package resources

import (
	"fmt"
	"time"
)

// Resource each resource has a compute component and a nomad component
type Resource struct {
	EC2AutoScalingGroup
	NomadClient

	cooldown            float64   // seconds
	lastScaledTime      time.Time // if now - time < cooldown, reject scaling
	nomadToComputeRatio int
}

// Scale receives a desired nomad count and scales both nomad + ec2 accordingly
func (res *Resource) Scale(desiredNomadCount int) error {

	// check if its a scale up or scale down
	if count, err := res.NomadClient.GetTaskGroupCount(); err == nil {
		if count < desiredNomadCount { // scale up
			return res.scaleUp(desiredNomadCount)
		} else if count < desiredNomadCount {
			return res.scaleDown(desiredNomadCount)
		} else {
			fmt.Println("Existing count is already at desired count. No scaling.")
			return nil
		}
	} else {
		return err
	}
}

// scaleUp - scale up - ec2 then nomad
func (res *Resource) scaleUp(desiredNomadCount int) error {
	err := res.EC2AutoScalingGroup.Scale(desiredNomadCount * res.nomadToComputeRatio)
	if err != nil {
		return err
	} else {
		err := res.NomadClient.Scale(desiredNomadCount)
		if err != nil {
			return err
		} else {
			res.lastScaledTime = time.Now()
			return nil
		}
	}
}

// scaleDown - scale down - nomad then ec2
func (res *Resource) scaleDown(desiredNomadCount int) error {
	err := res.NomadClient.Scale(desiredNomadCount)
	if err != nil {
		return err
	} else {
		err := res.EC2AutoScalingGroup.Scale(desiredNomadCount * res.nomadToComputeRatio)
		if err != nil {
			return err
		} else {
			res.lastScaledTime = time.Now()
			return nil
		}
	}
}

// GetNomadClientCount gets nomad client count via Resource type
func (res Resource) GetNomadClientCount() int {
	count, err := res.NomadClient.GetTaskGroupCount()
	if err != nil {
		return -1
	}
	return count
}
