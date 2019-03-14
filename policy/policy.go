package policy

import (
	"fmt"
	"time"

	"github.com/datagovsg/nomad-parametric-autoscaler/logging"
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
	ResourceMap       map[string]resources.Resource
	Subpolicies       []subpolicy.SubPolicy
	Ensembler         Ensembler
}

// PolicyPlan is the json-unmarshallable/marshallable representation of the policy
type PolicyPlan struct {
	CheckingFrequency string                            `json:"CheckingFreq"`
	ResourceMap       map[string]resources.ResourcePlan `json:"Resources"`
	Subpolicies       []subpolicy.GenericSubPolicy      `json:"Subpolicies"`
	Ensembler         string                            `json:"Ensembler"`
}

// MakePolicy is a factory function to generate a Policy struct
// make sure all resources in sub policy are covered
func MakePolicy(pp PolicyPlan, vc resources.VaultClient) (*Policy, error) {

	//make resources first, fail if any resource does not get created correctly
	resourceMap := make(map[string]resources.Resource)
	for k, v := range pp.ResourceMap {
		res, err := v.ApplyPlan(k, vc)
		if err != nil {
			return nil, err
		}
		resourceMap[k] = res
	}

	// make sp
	subpolicies := make([]subpolicy.SubPolicy, 0)
	for _, sp := range pp.Subpolicies {
		array := make([]resources.Resource, 0)

		for _, res := range sp.ManagedResources {
			array = append(array, resourceMap[res])
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
		ResourceMap:       resourceMap,
		Subpolicies:       subpolicies,
		CheckingFrequency: freq,
		Ensembler:         ensembler,
	}, nil
}

func RecreatePlan(p *Policy) PolicyPlan {
	gsp := make([]subpolicy.GenericSubPolicy, 0)
	for _, sp := range p.Subpolicies {
		gsp = append(gsp, sp.DeriveGenericSubpolicy())
	}

	rm := make(map[string]resources.ResourcePlan)
	for k, v := range p.ResourceMap {
		rm[k] = v.RecreateResourcePlan()
	}

	return PolicyPlan{
		CheckingFrequency: p.CheckingFrequency.String(),
		ResourceMap:       rm,
		Subpolicies:       gsp,
		Ensembler:         p.Ensembler.Name(),
	}
}

// DefaultPolicy is a factory function to generate an empty default
func DefaultPolicy() *Policy {
	t, _ := time.ParseDuration("10s")
	return &Policy{
		ResourceMap:       make(map[string]resources.Resource),
		Subpolicies:       make([]subpolicy.SubPolicy, 0),
		CheckingFrequency: t,
		Ensembler:         ConservativeEnsembling{},
	}
}

// Scale aggregates all sub-policy recommendations
func (p *Policy) Scale(vc *resources.VaultClient) error {

	if len(p.Subpolicies) == 0 {
		return fmt.Errorf("No sub-policies exist in current policy")
	}

	// have all sp compute reco
	rcs := make(map[resources.Resource][]int)
	for _, sp := range p.Subpolicies {
		for k, v := range sp.RecommendCount() {
			rcs[k] = append(rcs[k], v)
		}
	}

	// aggregate reco by resources
	for k, v := range rcs {
		err := k.Scale(p.Ensembler.Ensemble(v), vc)
		if err != nil {
			logging.Warning(err.Error())
		}
	}

	return nil
}

func (p *Policy) GetResourceStatus() map[string]int {
	status := make(map[string]int)
	for k, v := range p.ResourceMap {
		status[k] = v.GetNomadClientCount()
	}
	return status
}
