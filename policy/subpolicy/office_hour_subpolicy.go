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
	managedResources []resources.Resource
}

func NewOfficeHourSubPolicy(name string,
	metricsource string,
	upthreshold float64,
	downthreshold float64,
	scaleup ScalingMagnitude,
	scaledown ScalingMagnitude,
	mr []resources.Resource) *OfficeHourSubPolicy {

	return &OfficeHourSubPolicy{
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
	ohsp := OfficeHourSubPolicy{
		Name:          "OfficeHour",
		MetricSource:  "https://something",
		UpThreshold:   18,
		DownThreshold: 9,
		ScaleUp: ScalingMagnitude{
			ChangeType:  "until",
			ChangeValue: 10,
		},
		ScaleDown: ScalingMagnitude{
			ChangeType:  "until",
			ChangeValue: 3,
		},
		managedResources: make([]resources.Resource, 0),
	}
	return &ohsp
}

func (ohsp OfficeHourSubPolicy) GetManagedResources() []resources.Resource {
	return ohsp.managedResources
}

func (ohsp *OfficeHourSubPolicy) UpdateThreshold(up, down float64) {
	ohsp.DownThreshold = down
	ohsp.UpThreshold = up
}

func (ohsp *OfficeHourSubPolicy) UpdateScalingMagnitude(up, down ScalingMagnitude) {
	ohsp.ScaleUp = up
	ohsp.ScaleDown = down
}

func (ohsp *OfficeHourSubPolicy) RecommendCount() map[resources.Resource]int {
	now := time.Now()
	output := make(map[resources.Resource]int)

	// if within office hour, scale-up, else scale-down
	for _, resc := range ohsp.managedResources {
		if now.Hour() < int(ohsp.UpThreshold) && now.Hour() > int(ohsp.DownThreshold) {
			output[resc] = determineNewDesiredLevel(0, ohsp.ScaleUp)
		} else {
			output[resc] = determineNewDesiredLevel(0, ohsp.ScaleDown)
		}
	}
	return output
}
