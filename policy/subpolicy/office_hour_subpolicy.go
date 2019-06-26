package subpolicy

import (
	"fmt"

	"github.com/datagovsg/nomad-parametric-autoscaler/resources"
	"github.com/datagovsg/nomad-parametric-autoscaler/utils"
	"github.com/mitchellh/mapstructure"
)

// OfficeHourSubPolicy is a subpolicy that extends the `SubPolicy` interface
// and takes in the GenericSubpolicy struct
type OfficeHourSubPolicy struct {
	Name             string
	managedResources []resources.Resource
	metadata         OfficeHourSubPolicyMetadata
}

// OfficeHourSubPolicyMetadata represents metadata unique to OfficeHourSubPolicy
type OfficeHourSubPolicyMetadata struct {
	UpThreshold   *float64          `json:"UpThreshold"`
	DownThreshold *float64          `json:"DownThreshold"`
	ScaleUp       *ScalingMagnitude `json:"ScaleUp"`
	ScaleDown     *ScalingMagnitude `json:"ScaleDown"`
}

func NewOfficeHourSubPolicy(name string, mr []resources.Resource, meta interface{}) (*OfficeHourSubPolicy, error) {
	var decoded OfficeHourSubPolicyMetadata
	mapstructure.Decode(meta, &decoded)

	if err := verifyOfficeHourMetadata(decoded); err != nil {
		return nil, err
	}

	return &OfficeHourSubPolicy{
		Name:             name,
		managedResources: mr,
		metadata:         decoded,
	}, nil
}

func verifyOfficeHourMetadata(meta OfficeHourSubPolicyMetadata) error {
	if meta.UpThreshold == nil {
		return fmt.Errorf("UpThreshold missing from OfficeHourSubPolicyMetadata")
	}

	if meta.DownThreshold == nil {
		return fmt.Errorf("DownThreshold missing from OfficeHourSubPolicyMetadata")
	}

	if meta.ScaleUp == nil {
		return fmt.Errorf("ScaleUp missing from OfficeHourSubPolicyMetadata")
	}

	if meta.ScaleDown == nil {
		return fmt.Errorf("ScaleDown missing from OfficeHourSubPolicyMetadata")
	}
	return nil
}

func (ohsp OfficeHourSubPolicy) GetManagedResources() []resources.Resource {
	return ohsp.managedResources
}

func (ohsp *OfficeHourSubPolicy) RecommendCount() map[resources.Resource]int {
	currentHour := utils.GetCurrentTime().Hour()

	output := make(map[resources.Resource]int)

	// if within office hour, scale-up, else scale-down
	for _, resc := range ohsp.managedResources {
		if currentHour < int(*ohsp.metadata.UpThreshold) && currentHour > int(*ohsp.metadata.DownThreshold) {
			output[resc] = determineNewDesiredLevel(0, *ohsp.metadata.ScaleUp)
		} else {
			output[resc] = determineNewDesiredLevel(0, *ohsp.metadata.ScaleDown)
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
		ManagedResources: resourceNameList,
		Metadata:         crsp.metadata,
	}
}
