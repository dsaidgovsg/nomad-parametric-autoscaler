package subpolicy

import (
	"encoding/json"
	"io/ioutil"
	"net/http"

	"github.com/datagovsg/nomad-parametric-autoscaler/resources"
)

// CoreRatioSubPolicy is a subpolicy that extends the `SubPolicy` interface
// and takes in the GenericSubpolicy struct
type CoreRatioSubPolicy struct {
	Name             string
	MetricSource     string
	UpThreshold      float64
	DownThreshold    float64
	ScaleUp          ScalingMagnitude
	ScaleDown        ScalingMagnitude
	managedResources []*resources.Resource
}

func NewCoreRatioSubpolicy(name string,
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

func DefaultCoreRatioSubPolicy() *CoreRatioSubPolicy {
	crsp := CoreRatioSubPolicy{
		Name:          "CoreRatio",
		MetricSource:  "https://something",
		UpThreshold:   0.5,
		DownThreshold: 0.25,
		ScaleUp: ScalingMagnitude{
			changeType:  "multiply",
			changeValue: 2.0,
		},
		ScaleDown: ScalingMagnitude{
			changeType:  "multiply",
			changeValue: 0.5,
		},
		managedResources: make([]*resources.Resource, 1),
	}
	return &crsp
}

func (crsp CoreRatioSubPolicy) GetManagedResources() []*resources.Resource {
	return crsp.managedResources
}

func (crsp *CoreRatioSubPolicy) UpdateThreshold(up, down float64) {
	crsp.DownThreshold = down
	crsp.UpThreshold = up
}

func (crsp *CoreRatioSubPolicy) UpdateScalingMagnitude(up, down ScalingMagnitude) {
	crsp.ScaleUp = up
	crsp.ScaleDown = down
}

func (crsp *CoreRatioSubPolicy) RecommendCount() map[*resources.Resource]int {
	resp, err := http.Get(crsp.MetricSource)
	if err != nil {
		//error
	}

	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)

	var result map[string]interface{}
	json.Unmarshal([]byte(body), &result)

	output := make(map[*resources.Resource]int)
	for _, resc := range crsp.managedResources {
		cores := result["cores"]
		coresUsed := result["cores_used"]

		if cores == nil || coresUsed == nil {
			output[resc] = 0
		} else {
			ratio := coresUsed.(float64) / cores.(float64)
			existingCount := resc.GetNomadClientCount()

			if ratio < crsp.DownThreshold {
				output[resc] = determineNewDesiredLevel(existingCount, crsp.ScaleDown)
			} else if ratio > crsp.UpThreshold {
				output[resc] = determineNewDesiredLevel(existingCount, crsp.ScaleUp)
			} else {
				output[resc] = existingCount
			}
		}
	}
	return output
}
