package subpolicy

import (
	"time"

	"github.com/datagovsg/nomad-parametric-autoscaler/resources"
)

// OfficeHourSubPolicy is a subpolicy that extends the `SubPolicy` interface
// and takes in the GenericSubpolicy struct
type OfficeHourSubPolicy struct {
	Name             string
	MetricSource     string
	UpThreshold      float64
	DownThreshold    float64
	ScaleUp          ScalingMagnitude
	ScaleDown        ScalingMagnitude
	managedResources []*resources.Resource
}

func NewOfficeHourSubPolicy(name string,
	metricsource string,
	upthreshold float64,
	downthreshold float64,
	scaleup ScalingMagnitude,
	scaledown ScalingMagnitude,
	mr []*resources.Resource) *CoreRatioSubPolicy {

	return &CoreRatioSubPolicy{
		Name:             name,
		MetricSource:     metricsource,
		UpThreshold:      upthreshold,
		DownThreshold:    downthreshold,
		ScaleUp:          scaleup,
		ScaleDown:        scaledown,
		managedResources: mr,
	}
}

func DefaultOfficeHourSubPolicy() *OfficeHourSubPolicy {
	crsp := OfficeHourSubPolicy{
		Name:          "CoreRatio",
		MetricSource:  "https://something",
		UpThreshold:   18,
		DownThreshold: 8.5,
		ScaleUp: ScalingMagnitude{
			ChangeType:  "until",
			ChangeValue: 10,
		},
		ScaleDown: ScalingMagnitude{
			ChangeType:  "until",
			ChangeValue: 3,
		},
		managedResources: make([]*resources.Resource, 0),
	}
	return &crsp
}

func (crsp OfficeHourSubPolicy) GetManagedResources() []*resources.Resource {
	return crsp.managedResources
}

func (crsp *OfficeHourSubPolicy) UpdateThreshold(up, down float64) {
	crsp.DownThreshold = down
	crsp.UpThreshold = up
}

func (crsp *OfficeHourSubPolicy) UpdateScalingMagnitude(up, down ScalingMagnitude) {
	crsp.ScaleUp = up
	crsp.ScaleDown = down
}

func (crsp *OfficeHourSubPolicy) RecommendCount() map[*resources.Resource]int {
	now := time.Now()
	output := make(map[*resources.Resource]int)

	// if within office hour, scale-up, else scale-down
	for _, resc := range crsp.managedResources {
		if now.Hour() < int(crsp.UpThreshold) && now.Hour() > int(crsp.DownThreshold) {
			output[resc] = determineNewDesiredLevel(0, crsp.ScaleUp)
		} else {
			output[resc] = determineNewDesiredLevel(0, crsp.ScaleDown)
		}
	}
	return output
}
