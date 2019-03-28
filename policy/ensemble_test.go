package policy

import (
	"testing"

	"github.com/datagovsg/nomad-parametric-autoscaler/types"
)

func TestEnsemblerFetching(t *testing.T) {
	es, err := GetEnsembler(types.EnsembleConservative)

	if err != nil {
		t.Errorf("Expected keyword `Conservative` to be valid")
	}

	if es != (ConservativeEnsembling{name: types.EnsembleConservative}) {
		t.Errorf("ConservativeEnsembling struct to be fetched")
	}

	es, err = GetEnsembler(types.EnsembleAverage)

	if err != nil {
		t.Errorf("Expected keyword `Average` to be valid")
	}

	if es != (AverageEnsembling{name: types.EnsembleAverage}) {
		t.Errorf("AverageEnsembling struct to be fetched")
	}

	_, err = GetEnsembler("average")

	if err == nil {
		t.Errorf("Expected keyword `average` to be valid")
	}
}

func TestEnsemblerBehaviour(t *testing.T) {
	es := ConservativeEnsembling{}
	if es.Ensemble([]int{1, 2, 3}) != 3 {
		t.Errorf("Conservative Ensembling expected to give max")
	}

	as := AverageEnsembling{}
	if as.Ensemble([]int{1, 2, 3}) != 2 {
		t.Errorf("Average Ensembling expected to give average")
	}
}
