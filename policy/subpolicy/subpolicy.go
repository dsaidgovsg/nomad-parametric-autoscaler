package subpolicy

import (
	"fmt"

	"github.com/datagovsg/nomad-parametric-autoscaler/resources"
)

// ScalingMagnitude needs a way better name
type ScalingMagnitude struct {
	ChangeType  string  `json:"Changetype"`
	ChangeValue float64 `json:"ChangeValue"`
}

type SubPolicy interface {
	RecommendCount() map[resources.Resource]int
	UpdateThreshold(newup, newdown float64)
	UpdateScalingMagnitude(newup, newdown ScalingMagnitude)
	GetManagedResources() []resources.Resource
	DeriveGenericSubpolicy() GenericSubPolicy
}

// GenericSubPolicy is used for decoding of json
// according to name, create actual sp
type GenericSubPolicy struct {
	Name             string           `json:"Name"`
	MetricSource     string           `json:"MetricSource"`
	UpThreshold      float64          `json:"UpThreshold"`
	DownThreshold    float64          `json:"DownThreshold"`
	ScaleUp          ScalingMagnitude `json:"ScaleUp"`
	ScaleDown        ScalingMagnitude `json:"ScaleDown"`
	ManagedResources []string         `json:"ManagedResources"`
}

// CreateSpecificSubpolicy checks name of GSP and creates the actual policy
func CreateSpecificSubpolicy(gsp GenericSubPolicy, mr []resources.Resource) (SubPolicy, error) {
	switch gsp.Name {
	case "CoreRatio":
		return NewCoreRatioSubpolicy(gsp.Name,
			gsp.MetricSource,
			gsp.UpThreshold,
			gsp.DownThreshold,
			gsp.ScaleUp,
			gsp.ScaleDown,
			mr), nil
	case "OfficeHour":
		return NewOfficeHourSubPolicy(gsp.Name,
			gsp.MetricSource,
			gsp.UpThreshold,
			gsp.DownThreshold,
			gsp.ScaleUp,
			gsp.ScaleDown,
			mr), nil
	default:
		return nil, fmt.Errorf("%v is not a valid subpolicy", gsp.Name)
	}
}

// determineNewDesiredLevel is a utiliy function that resolves the various types
// of scaling methods
func determineNewDesiredLevel(cur int, sm ScalingMagnitude) int {
	switch sm.ChangeType {
	case "multiply":
		return int(float64(cur) * sm.ChangeValue)
	case "until":
		return int(sm.ChangeValue)
	default:
		return cur
	}
}
