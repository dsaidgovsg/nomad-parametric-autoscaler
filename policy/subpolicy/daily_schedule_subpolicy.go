package subpolicy

import (
	"fmt"
	"time"

	"github.com/datagovsg/nomad-parametric-autoscaler/resources"
	"github.com/mitchellh/mapstructure"
)

// OfficeHourSubPolicy is a subpolicy that extends the `SubPolicy` interface
// and takes in the GenericSubpolicy struct
type DailyScheduleSubPolicy struct {
	Name             string
	managedResources []resources.Resource
	metadata         DailyScheduleSubPolicyMetadata
}

type ScalingWindow struct {
	Begin int `json:"Begin"`
	End   int `json:"End"`
	Count int `json:"Count"`
}

func (sw ScalingWindow) IsInWindow(time int) bool {
	return sw.Begin <= time && time < sw.End
}

// OfficeHourSubPolicyMetadata represents metadata unique to OfficeHourSubPolicy
type DailyScheduleSubPolicyMetadata struct {
	Default  *int            `json:"Default"`
	Schedule []ScalingWindow `json:"Schedule"`
}

func NewDailyScheduleSubPolicy(name string, mr []resources.Resource, meta interface{}) (*DailyScheduleSubPolicy, error) {
	var decoded DailyScheduleSubPolicyMetadata
	mapstructure.Decode(meta, &decoded)

	if err := verifyDailyScheduleMetadata(decoded); err != nil {
		return nil, err
	}

	fmt.Println(meta)
	fmt.Println(decoded.Schedule[0].Count)

	return &DailyScheduleSubPolicy{
		Name:             name,
		managedResources: mr,
		metadata:         decoded,
	}, nil
}

func verifyDailyScheduleMetadata(meta DailyScheduleSubPolicyMetadata) error {
	if meta.Default == nil {
		return fmt.Errorf("Default missing from DailyScheduleSubPolicyMetadata")
	}

	if meta.Schedule == nil {
		return fmt.Errorf("Schedule missing from DailyScheduleSubPolicyMetadata")
	}

	return nil
}

func (dssp DailyScheduleSubPolicy) GetManagedResources() []resources.Resource {
	return dssp.managedResources
}

func (dssp *DailyScheduleSubPolicy) RecommendCount() map[resources.Resource]int {
	now := time.Now().UTC()
	currentTime := (now.Hour()+8)*100 + now.Minute()

	output := make(map[resources.Resource]int)

	// if within office hour, scale-up, else scale-down
	for _, resc := range dssp.managedResources {
		var recommendation int
		windowExist := false
		for _, sw := range dssp.metadata.Schedule {
			if sw.IsInWindow(currentTime) {
				recommendation = sw.Count
				windowExist = true
				break
			}
		}

		if !windowExist {
			recommendation = *dssp.metadata.Default
		}

		output[resc] = recommendation
	}
	return output
}

func (dssp *DailyScheduleSubPolicy) DeriveGenericSubpolicy() GenericSubPolicy {
	resourceNameList := make([]string, 0)
	for _, r := range dssp.managedResources {
		resourceNameList = append(resourceNameList, r.ResourceName())
	}

	fmt.Println(dssp.metadata)

	return GenericSubPolicy{
		Name:             dssp.Name,
		ManagedResources: resourceNameList,
		Metadata:         dssp.metadata,
	}
}
