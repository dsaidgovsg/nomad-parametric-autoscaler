package subpolicy

import (
	"encoding/json"
	"io/ioutil"
	"net/http"

	"github.com/datagovsg/nomad-parametric-autoscaler/logging"
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
	managedResources []resources.Resource
}

type coreRatioJSON struct {
	Cores     int `json:"cores"`
	Coresused int `json:"coresused"`
}

func NewCoreRatioSubpolicy(name string,
	metricsource string,
	upthreshold float64,
	downthreshold float64,
	scaleup ScalingMagnitude,
	scaledown ScalingMagnitude,
	mr []resources.Resource) *CoreRatioSubPolicy {

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
			ChangeType:  "multiply",
			ChangeValue: 2.0,
		},
		ScaleDown: ScalingMagnitude{
			ChangeType:  "multiply",
			ChangeValue: 0.5,
		},
		managedResources: make([]resources.Resource, 0),
	}
	return &crsp
}

func (crsp CoreRatioSubPolicy) GetManagedResources() []resources.Resource {
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

func (crsp *CoreRatioSubPolicy) RecommendCount() map[resources.Resource]int {
	resp, err := http.Get(crsp.MetricSource)
	if err != nil {
		logging.Error(err.Error())
	}

	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)

	var result coreRatioJSON
	json.Unmarshal([]byte(body), &result)

	output := make(map[resources.Resource]int)
	for _, resc := range crsp.managedResources {
		cores := result.Cores
		coresUsed := result.Coresused

		if cores == 0 || coresUsed == 0 {
			output[resc] = 0
		} else {
			ratio := float64(coresUsed) / float64(cores)
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
