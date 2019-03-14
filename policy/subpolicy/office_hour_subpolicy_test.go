package subpolicy

import (
	"testing"

	"github.com/datagovsg/nomad-parametric-autoscaler/resources"
)

func TestDecodingOfficeHourSP(t *testing.T) {
	input := map[string]interface{}{
		"UpThrhold":     9.1,
		"DownThreshold": 0.2,
		"ScaleUp": map[string]interface{}{
			"ChangeType":  "multiply",
			"ChangeValue": 2,
		},
		"ScaleDown": map[string]interface{}{
			"ChangeType":  "multiply",
			"ChangeValue": 2,
		},
	}
	emptyList := make([]resources.Resource, 0)
	_, err := NewOfficeHourSubPolicy("a", emptyList, input)
	if err == nil {
		t.Errorf("Expected typo for `UpThreshold` to be caught")
	}
}

func TestDecodingCorrectOfficeHourSP(t *testing.T) {
	input := map[string]interface{}{
		"MetricSource":  "sample",
		"UpThreshold":   9.1,
		"DownThreshold": 0.2,
		"ScaleUp": map[string]interface{}{
			"ChangeType":  "multiply",
			"ChangeValue": 2,
		},
		"ScaleDown": map[string]interface{}{
			"ChangeType":  "divide",
			"ChangeValue": 3,
		},
	}
	emptyList := make([]resources.Resource, 0)
	sp, err := NewOfficeHourSubPolicy("a", emptyList, input)
	if err != nil {
		t.Errorf("Expected well-formed map[string]interface{} to parse into meta struct")
	}

	if sp.metadata.ScaleDown.ChangeType != "divide" && sp.metadata.ScaleDown.ChangeValue != 3.0 {
		t.Errorf("Expected ScaleDown to be parsed")
	}

	if sp.metadata.ScaleUp.ChangeType != "multiply" && sp.metadata.ScaleUp.ChangeValue != 2.0 {
		t.Errorf("Expected ScaleUp to be parsed")
	}

	if *sp.metadata.DownThreshold != 0.2 && *sp.metadata.UpThreshold != 9.1 {
		t.Errorf("Expected thresholds to be parsed")
	}
}
