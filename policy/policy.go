package policy

import (
	"github.com/datagovsg/nomad-parametric-autoscaler/policy/subpolicy"
	"github.com/datagovsg/nomad-parametric-autoscaler/resources"
)

/*
Policy - represents overall scaling policy

subpolicies can only recommend a scale-to level
list of subpolicies recommendation -> ensemble and scale

Resources are independent of each other as of now
*/
type Policy struct {
	CheckingFrequency float64 // in seconds default to 60s

	resourceList []*resources.Resource // generated from subpolicies
	subpolicies  []subpolicy.SubPolicy
	ensembler    Ensembler
}

// NewPolicy is a factory function to generate a Policy struct
func NewPolicy(spl []subpolicy.SubPolicy, es Ensembler, cf float64) *Policy {
	rmap := make(map[*resources.Resource]bool)
	for _, sp := range spl {
		for _, res := range sp.GetManagedResources() {
			rmap[res] = true
		}
	}

	rArr := make([]*resources.Resource, len(rmap))
	for k := range rmap {
		rArr = append(rArr, k)
	}

	return &Policy{
		resourceList:      rArr,
		subpolicies:       spl,
		CheckingFrequency: cf,
		ensembler:         es,
	}
}

// Scale aggregates all sub-policy recommendations
func (p *Policy) Scale() error {

	// have all sp compute reco
	rcs := make(map[*resources.Resource][]int)
	for _, sp := range p.subpolicies {
		for k, v := range sp.RecommendCount() {
			rcs[k] = append(rcs[k], v)
		}
	}

	// aggregate reco by resources
	for k, v := range rcs {
		// TODO should cooldown check be done at resource side or policy side???
		k.Scale(p.ensembler.Ensemble(v))
	}

	return nil
}

// UpdateSubpolicy takes in user input and updates subpolicy
func (p *Policy) UpdateSubpolicy() {
	// To be implemented
}

// UpdateResources takes in user input and updates subpolicy
func (p *Policy) UpdateResources() {
	// To be implemented
}
