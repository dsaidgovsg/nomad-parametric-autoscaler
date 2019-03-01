package policy

/*
Ensembler - combines multiple recommendations from various sub-policies and
outputs a combined recommendation

create custom ensembling methods by extending interface
*/
type Ensembler interface {
	Ensemble(array []int) int
}

// ConservativeEnsembling takes maximum of scaling
type ConservativeEnsembling struct{}

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
