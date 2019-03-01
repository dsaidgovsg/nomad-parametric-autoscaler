package subpolicy

import "github.com/datagovsg/nomad-parametric-autoscaler/resources"

// ScalingMagnitude needs a way better name
type ScalingMagnitude struct {
	changeType  string // add, multiply, until
	changeValue float64
}

type SubPolicy interface {
	RecommendCount() map[*resources.Resource]int
	UpdateThreshold(newup, newdown float64)
	UpdateScalingMagnitude(newup, newdown ScalingMagnitude)
	GetManagedResources() []*resources.Resource
}

type GenericSubPolicy struct {
	MetricSource  string           `json:"MetricSource"`
	UpThreshold   float64          `json:"UpThreshold"`
	DownThreshold float64          `json:"DownThreshold"`
	ScaleUp       ScalingMagnitude `json:"ScaleUp"`
	ScaleDown     ScalingMagnitude `json:"ScaleDown"`

	managedResources []*resources.Resource
}

// determineNewDesiredLevel is a utiliy function that resolves the various types
// of scaling methods
func determineNewDesiredLevel(cur int, sm ScalingMagnitude) int {
	switch sm.changeType {
	case "multiply":
		return int(float64(cur) * sm.changeValue)
	case "until":
		return int(sm.changeValue)
	default:
		return cur
	}
}
