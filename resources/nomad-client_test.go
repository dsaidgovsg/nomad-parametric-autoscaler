package resources

import (
	"testing"
)

func TestNomadClientInitialisation(t *testing.T) {
	vc, _ := NewVaultClient("test")
	_, err := NewNomadClient(*vc, "https://test.test", "spark", 1, 10, "path")
	if err == nil {
		t.Errorf("Expected invalid address to return an error")
	}
}
