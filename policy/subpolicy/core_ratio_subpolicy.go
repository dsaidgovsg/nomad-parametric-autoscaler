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
	name       string
	gsubpolicy GenericSubPolicy
}

func NewCoreRatioSubPolicy() *CoreRatioSubPolicy {
	crsp := CoreRatioSubPolicy{
		name: "core-ratio-subpolicy",
		gsubpolicy: GenericSubPolicy{
			MetricSource:  "https://sm.locus.rocks/json/",
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
		},
	}
	return &crsp
}

func (crsp CoreRatioSubPolicy) GetManagedResources() []*resources.Resource {
	return crsp.gsubpolicy.managedResources
}

func (crsp *CoreRatioSubPolicy) UpdateThreshold(up, down float64) {
	crsp.gsubpolicy.DownThreshold = down
	crsp.gsubpolicy.UpThreshold = up
}

func (crsp *CoreRatioSubPolicy) UpdateScalingMagnitude(up, down ScalingMagnitude) {
	crsp.gsubpolicy.ScaleUp = up
	crsp.gsubpolicy.ScaleDown = down
}

func (crsp *CoreRatioSubPolicy) RecommendCount() map[*resources.Resource]int {
	resp, err := http.Get(crsp.gsubpolicy.MetricSource)
	if err != nil {
		//error
	}

	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)

	var result map[string]interface{}
	json.Unmarshal([]byte(body), &result)

	output := make(map[*resources.Resource]int)
	for _, resc := range crsp.gsubpolicy.managedResources {
		cores := result["cores"]
		coresUsed := result["cores_used"]

		if cores == nil || coresUsed == nil {
			output[resc] = 0
		} else {
			ratio := coresUsed.(float64) / cores.(float64)
			existingCount := resc.GetNomadClientCount()

			if ratio < crsp.gsubpolicy.DownThreshold {
				output[resc] = determineNewDesiredLevel(existingCount, crsp.gsubpolicy.ScaleDown)
			} else if ratio > crsp.gsubpolicy.UpThreshold {
				output[resc] = determineNewDesiredLevel(existingCount, crsp.gsubpolicy.ScaleUp)
			} else {
				output[resc] = existingCount
			}
		}
	}
	return output
}
