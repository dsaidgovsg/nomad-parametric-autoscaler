package resources

import (
	"testing"
)

func TestScalingBoundary(t *testing.T) {
	easg := NewEC2AutoScalingGroup("", "test", 10, 1)

	if easg.getValidScaleCount(11) != 10 {
		t.Errorf("Expected max limit to be obeyed.")
	}

	if easg.getValidScaleCount(0) != 1 {
		t.Errorf("Expected min limit to be obeyed.")
	}

	n := 5
	if easg.getValidScaleCount(n) != n {
		t.Errorf("Expected recommendations within tolerance to be accepted.")
	}
}
