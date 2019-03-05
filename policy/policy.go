package policy

import (
	"time"

	"github.com/datagovsg/nomad-parametric-autoscaler/policy/subpolicy"
	"github.com/datagovsg/nomad-parametric-autoscaler/resources"
)

/*
Policy - represents overall scaling policy

Subpolicies can only recommend a scale-to level
list of subpolicies recommendation -> ensemble and scale

Resources are independent of each other as of now
*/
type Policy struct {
	CheckingFrequency time.Duration
	ResourceMap       map[string]*resources.Resource
	Subpolicies       []subpolicy.SubPolicy
	Ensembler         Ensembler
}

type PolicyPlan struct {
	CheckingFrequency string                         `json:"CheckingFreq"` // in seconds default to 60s
	ResourceMap       map[string]*resources.Resource `json:"Resources"`
	Subpolicies       []subpolicy.GenericSubPolicy   `json:"Subpolicies"`
	Ensembler         string                         `json:"Ensembler"`
}

// MakePolicy is a factory function to generate a Policy struct
// make sure all resources in sub policy are covered
func MakePolicy(pp PolicyPlan) (*Policy, error) {
	subpolicies := make([]subpolicy.SubPolicy, len(pp.Subpolicies))
	for _, sp := range pp.Subpolicies {
		array := make([]*resources.Resource, len(sp.ManagedResources))

		for _, res := range sp.ManagedResources {
			array = append(array, pp.ResourceMap[res])
		}

		ssp, err := subpolicy.CreateSpecificSubpolicy(sp, array)
		if err != nil {
			return nil, err
		}

		subpolicies = append(subpolicies, ssp)
	}

	freq, err := time.ParseDuration(pp.CheckingFrequency)
	if err != nil {
		freq = 30 * time.Second
	}

	ensembler, err := GetEnsembler(pp.Ensembler)
	if err != nil {
		return nil, err
	}

	return &Policy{
		ResourceMap:       pp.ResourceMap,
		Subpolicies:       subpolicies,
		CheckingFrequency: freq,
		Ensembler:         ensembler,
	}, nil
}

// DefaultPolicy is a factory function to generate an empty default
func DefaultPolicy() *Policy {
	time, _ := time.ParseDuration("10s")
	return &Policy{
		ResourceMap:       make(map[string]*resources.Resource),
		Subpolicies:       make([]subpolicy.SubPolicy, 1, 1),
		CheckingFrequency: time,
		Ensembler:         ConservativeEnsembling{},
	}
}

// Scale aggregates all sub-policy recommendations
func (p *Policy) Scale(vc *resources.VaultClient) error {

	// have all sp compute reco
	rcs := make(map[*resources.Resource][]int)
	for _, sp := range p.Subpolicies {
		for k, v := range sp.RecommendCount() {
			rcs[k] = append(rcs[k], v)
		}
	}

	// aggregate reco by resources
	for k, v := range rcs {
		// TODO should cooldown check be done at resource side or policy side???
		k.Scale(p.Ensembler.Ensemble(v), vc)
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
