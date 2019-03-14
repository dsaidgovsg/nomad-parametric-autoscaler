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
	ScaleOut         ScalingMagnitude
	ScaleIn          ScalingMagnitude
	managedResources []resources.Resource
}

func NewOfficeHourSubPolicy(name string,
	metricsource string,
	upthreshold float64,
	downthreshold float64,
	scaleOut ScalingMagnitude,
	scaleIn ScalingMagnitude,
	mr []resources.Resource) *OfficeHourSubPolicy {

	return &OfficeHourSubPolicy{
		Name:             name,
		MetricSource:     metricsource,
		UpThreshold:      upthreshold,
		DownThreshold:    downthreshold,
		ScaleOut:         scaleOut,
		ScaleIn:          scaleIn,
		managedResources: mr,
	}
}

func DefaultOfficeHourSubPolicy() *OfficeHourSubPolicy {
	ohsp := OfficeHourSubPolicy{
		Name:          "OfficeHour",
		MetricSource:  "https://something",
		UpThreshold:   18,
		DownThreshold: 9,
		ScaleOut: ScalingMagnitude{
			ChangeType:  "until",
			ChangeValue: 10,
		},
		ScaleIn: ScalingMagnitude{
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
	ohsp.ScaleOut = up
	ohsp.ScaleIn = down
}

func (ohsp *OfficeHourSubPolicy) RecommendCount() map[resources.Resource]int {
	currentHour := time.Now().UTC().Hour() + 8

	output := make(map[resources.Resource]int)

	// if within office hour, scale-up, else scale-down
	for _, resc := range ohsp.managedResources {
		if currentHour < int(ohsp.UpThreshold) && currentHour > int(ohsp.DownThreshold) {
			output[resc] = determineNewDesiredLevel(0, ohsp.ScaleOut)
		} else {
			output[resc] = determineNewDesiredLevel(0, ohsp.ScaleIn)
		}
	}
	return output
}

func (crsp *OfficeHourSubPolicy) DeriveGenericSubpolicy() GenericSubPolicy {
	resourceNameList := make([]string, 0)
	for _, r := range crsp.managedResources {
		resourceNameList = append(resourceNameList, r.ResourceName())
	}

	return GenericSubPolicy{
		Name:             crsp.Name,
		MetricSource:     crsp.MetricSource,
		UpThreshold:      crsp.UpThreshold,
		DownThreshold:    crsp.DownThreshold,
		ScaleOut:         crsp.ScaleOut,
		ScaleIn:          crsp.ScaleIn,
		ManagedResources: resourceNameList,
	}
}
