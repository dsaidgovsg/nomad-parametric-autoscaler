package subpolicy

import (
	"testing"

	"github.com/datagovsg/nomad-parametric-autoscaler/resources"
)

func TestDecodingDailyScheduleSP(t *testing.T) {
	input := map[string]interface{}{
		"Default": 9.1,
		"Schedule": []map[string]int{
			{"Begin": 1, "End": 3, "Count": 3},
			{"Begin": 3, "End": 4, "Count": 3},
		},
	}
	emptyList := make([]resources.Resource, 0)
	_, err := NewDailyScheduleSubPolicy("a", emptyList, input)
	if err == nil {
		t.Errorf("Expected typo for `UpThreshold` to be caught")
	}
}

func TestWindowChecking(t *testing.T) {
	sw := ScalingWindow{
		begin: 0000,
		end:   0200,
		count: 10,
	}

	if !sw.IsInWindow(0000) {
		t.Errorf("Expected 000hrs to be within window")
	}

	if sw.IsInWindow(0200) {
		t.Errorf("Expected 0200hrs to be out of window")
	}
}
