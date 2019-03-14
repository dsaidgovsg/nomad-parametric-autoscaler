package subpolicy

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/datagovsg/nomad-parametric-autoscaler/logging"
	"github.com/datagovsg/nomad-parametric-autoscaler/resources"
	"github.com/mitchellh/mapstructure"
)

// CoreRatioSubPolicy is a subpolicy that extends the `SubPolicy` interface
// and takes in the GenericSubpolicy struct
type CoreRatioSubPolicy struct {
	Name             string
	managedResources []resources.Resource
	metadata         CoreRatioSubPolicyMetadata
}

// CoreRatioSubPolicyMetadata represents metadata unique to CoreRatioSubPolicy
type CoreRatioSubPolicyMetadata struct {
	MetricSource  *string           `json:"MetricSource"`
	UpThreshold   *float64          `json:"UpThreshold"`
	DownThreshold *float64          `json:"DownThreshold"`
	ScaleUp       *ScalingMagnitude `json:"ScaleUp"`
	ScaleDown     *ScalingMagnitude `json:"ScaleDown"`
}

type coreRatioJSON struct {
	Cores     int `json:"cores"`
	Coresused int `json:"coresused"`
}

func NewCoreRatioSubpolicy(name string, mr []resources.Resource, meta interface{}) (*CoreRatioSubPolicy, error) {
	var decoded CoreRatioSubPolicyMetadata
	mapstructure.Decode(meta, &decoded)

	if err := verifyCoreRatioMetadata(decoded); err != nil {
		return nil, err
	}
	return &CoreRatioSubPolicy{
		Name:             name,
		managedResources: mr,
		metadata:         decoded,
	}, nil
}

func verifyCoreRatioMetadata(meta CoreRatioSubPolicyMetadata) error {
	if meta.MetricSource == nil {
		return fmt.Errorf("MetricSource missing from CoreRatioSubPolicyMetadata")
	}
	if meta.UpThreshold == nil {
		return fmt.Errorf("UpThreshold missing from CoreRatioSubPolicyMetadata")
	}

	if meta.DownThreshold == nil {
		return fmt.Errorf("DownThreshold missing from CoreRatioSubPolicyMetadata")
	}

	if meta.ScaleDown == nil {
		return fmt.Errorf("ScaleDown missing from CoreRatioSubPolicyMetadata")
	}

	if meta.ScaleUp == nil {
		return fmt.Errorf("ScaleUp missing from CoreRatioSubPolicyMetadata")
	}
	return nil
}

func (crsp CoreRatioSubPolicy) GetManagedResources() []resources.Resource {
	return crsp.managedResources
}

func (crsp *CoreRatioSubPolicy) RecommendCount() map[resources.Resource]int {
	resp, err := http.Get(*crsp.metadata.MetricSource)
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

			if ratio < *crsp.metadata.DownThreshold {
				output[resc] = determineNewDesiredLevel(existingCount, *crsp.metadata.ScaleDown)
			} else if ratio > *crsp.metadata.UpThreshold {
				output[resc] = determineNewDesiredLevel(existingCount, *crsp.metadata.ScaleUp)
			} else {
				output[resc] = existingCount
			}
		}
	}
	return output
}

func (crsp *CoreRatioSubPolicy) DeriveGenericSubpolicy() GenericSubPolicy {
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
