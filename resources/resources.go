package resources

import (
	"fmt"
	"github.com/datagovsg/nomad-parametric-autoscaler/logging"
	"time"
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

	ScaleOutCooldown    time.Duration
	ScaleInCooldown     time.Duration
	NomadToComputeRatio int
	Name                string
	lastScaledTime      time.Time // if now - time < cooldown, reject scaling
	nextResetTime       time.Time
}

type ResourcePlan struct {
	EC2AutoScalingGroupPlan `json:"EC2"`
	NomadClientPlan         `json:"Nomad"`
	ScaleInCooldown         string `json:"ScaleInCooldown"`
	ScaleOutCooldown        string `json:"ScaleOutCooldown"`
	NomadToComputeRatio     int    `json:"N2CRatio"`
}

func (rp ResourcePlan) ApplyPlan(name string, vc VaultClient) (Resource, error) {
	nc, err := rp.NomadClientPlan.ApplyPlan(vc)
	if err != nil {
		return nil, err
	}

	easg := rp.EC2AutoScalingGroupPlan.ApplyPlan()

	dcd, err := time.ParseDuration(rp.ScaleInCooldown)
	if err != nil {
		dcd = 300 * time.Second //  default 5 minute cooldown for scaling down
	}

	ucd, err := time.ParseDuration(rp.ScaleOutCooldown)
	if err != nil {
		ucd = 5 * time.Second //  default 5 seconds cooldown for scaling up
	}

	return &EC2NomadResource{
		NomadClient:         *nc,
		EC2AutoScalingGroup: *easg,
		ScaleInCooldown:     dcd,
		ScaleOutCooldown:    ucd,
		NomadToComputeRatio: rp.NomadToComputeRatio,
		Name:                name,
		nextResetTime:       time.Unix(1<<63-62135596801, 999999999),
	}, nil
}

func fmtDuration(d time.Duration) string {
	d = d.Round(time.Minute)
	h := d / time.Hour
	d -= h * time.Hour
	m := d / time.Minute
	return fmt.Sprintf("%02d:%02d", h, m)
}

// Scale receives a desired nomad count and scales both nomad + ec2 accordingly
func (res *EC2NomadResource) Scale(desiredNomadCount int, vc *VaultClient) error {
	now := time.Now()
	maxTime := time.Unix(1<<63-62135596801, 999999999)

	if now.After(res.nextResetTime) {
		if err := res.NomadClient.RestartNomadAlloc(); err != nil {
			resetDuration := res.getResetDuration()
			res.nextResetTime = now.Add(resetDuration)
			logging.Info("[restart log] cancel allocation failure. starting timer to retry cancel allocation in %v", resetDuration)
		} else {

			res.nextResetTime = maxTime
			logging.Info("[restart log] cancel allocation success")
		}
	}

	if time.Since(res.lastScaledTime) < res.ScaleInCooldown {
		return fmt.Errorf("Too soon to scale again")
	}

	// check if its a scale out or scale in
	count, err := res.NomadClient.GetTaskGroupCount()
	if err != nil {
		return err
	}

	asgCount, err := res.EC2AutoScalingGroup.GetAsgCount()
	if err != nil {
		return err
	}

	// the policy may recommend 0 cores based on 0 usage, but it makes no sense to trigger to condition to call scaleIn
	// below the specified MinCount.
	if res.NomadClient.MinCount > desiredNomadCount {
		desiredNomadCount = res.NomadClient.MinCount
	}
	logging.Info("[scaling log] resource_name=%s nomad_count=%d ec2_count=%d, desired=%d", res.Name, count, asgCount, desiredNomadCount)

	// limit violation requires correction
	if count < res.NomadClient.MinCount {
		return res.scaleOut(res.NomadClient.MinCount, vc)
	} else if count > res.NomadClient.MaxCount {
		return res.scaleIn(res.NomadClient.MaxCount, vc)
	}

	// scale accordingly
	if count < desiredNomadCount {
		// If scaling out before the timer to reset an allocation, cancel the timer.
		if res.nextResetTime.Before(maxTime) {
			res.nextResetTime = maxTime
			logging.Info("[restart log] stopping timer to cancel allocation")
		}
		return res.scaleOut(desiredNomadCount, vc)
	} else if count > desiredNomadCount {
		// When doing the last scaleIn to the minimum count, start the timer to reset any allocation.
		// This is primarily targeted towards Nomad jobs running Spark workers.
		if desiredNomadCount == res.NomadClient.MinCount {
			resetDuration := res.getResetDuration()
			res.nextResetTime = now.Add(resetDuration)
			logging.Info("[restart log] starting timer to cancel allocation in %v", resetDuration)
		}
		return res.scaleIn(desiredNomadCount, vc)
	} else {
		return nil
	}
}

// Returns the duration of 2 cycles of ScaleOutCoolDown or 5 minutes
// (to give a buffer for ASG to terminate EC2 instance completely), whichever is greater
func (res *EC2NomadResource) getResetDuration() time.Duration {
	var duration time.Duration
	// Wait for at least 2 cycle of scaleOut
	if res.ScaleOutCooldown > res.ScaleInCooldown {
		duration = 2 * res.ScaleOutCooldown
	} else {
		duration = 2 * res.ScaleInCooldown
	}
	if duration < 5*time.Minute {
		duration = 5 * time.Minute
	}

	return duration
}

// scaleOut - scale out - ec2 then nomad
func (res *EC2NomadResource) scaleOut(desiredNomadCount int, vc *VaultClient) error {
	if res.NomadToComputeRatio > 0 { // ignore ec2
		if err := res.EC2AutoScalingGroup.Scale(desiredNomadCount * res.NomadToComputeRatio); err != nil {
			return err
		}
	}

	if err := res.NomadClient.Scale(desiredNomadCount, vc); err != nil {
		return err
	}

	res.lastScaledTime = time.Now()
	return nil
}

// scaleIn - scale in - nomad then ec2
func (res *EC2NomadResource) scaleIn(desiredNomadCount int, vc *VaultClient) error {
	if err := res.NomadClient.Scale(desiredNomadCount, vc); err != nil {
		return err
	}

	if res.NomadToComputeRatio > 0 { // ignore ec2
		if err := res.EC2AutoScalingGroup.Scale(desiredNomadCount * res.NomadToComputeRatio); err != nil {
			return err
		}
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
		ScaleOutCooldown:        res.ScaleOutCooldown.String(),
		ScaleInCooldown:         res.ScaleInCooldown.String(),
		NomadToComputeRatio:     res.NomadToComputeRatio,
	}
}
