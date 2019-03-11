package policy

import (
	"fmt"
)

/*
Ensembler - combines multiple recommendations from various sub-policies and
outputs a combined recommendation

create custom ensembling methods by extending interface
*/
type Ensembler interface {
	Ensemble(array []int) int
	Name() string
}

// GetEnsembler matches name and returns an ensembler
func GetEnsembler(name string) (Ensembler, error) {
	switch name {
	case "Conservative":
		return ConservativeEnsembling{
			name: name,
		}, nil
	case "Average":
		return AverageEnsembling{
			name: name,
		}, nil
	default:
		return nil, fmt.Errorf("%v is not a valid ensembling method", name)
	}
}

// ConservativeEnsembling takes maximum of scaling
type ConservativeEnsembling struct {
	name string
}

func (ce ConservativeEnsembling) Name() string {
	return ce.name
}

// Ensemble finds the largest value in the slice
func (ce ConservativeEnsembling) Ensemble(array []int) int {
	var max = array[0]
	for _, value := range array {
		if max < value {
			max = value
		}
	}
	return max
}

// AverageEnsembling takes average of scaling
type AverageEnsembling struct {
	name string
}

func (ce AverageEnsembling) Name() string {
	return ce.name
}

// Ensemble finds the mean
func (ce AverageEnsembling) Ensemble(array []int) int {
	var max = array[0]
	for _, value := range array {
		max += value
	}
	return max / len(array)
}
