package policy

import (
	"testing"
)

func TestEnsemblerFetching(t *testing.T) {
	es, err := GetEnsembler("Conservative")

	if err != nil {
		t.Errorf("Expected keyword `Conservative` to be valid")
	}

	if es != (ConservativeEnsembling{}) {
		t.Errorf("ConservativeEnsembling struct to be fetched")
	}

	es, err = GetEnsembler("Average")

	if err != nil {
		t.Errorf("Expected keyword `Average` to be valid")
	}

	if es != (AverageEnsembling{}) {
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
