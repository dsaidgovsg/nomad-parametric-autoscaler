package app

import (
	"encoding/json"

	"github.com/datagovsg/nomad-parametric-autoscaler/logging"
	"github.com/datagovsg/nomad-parametric-autoscaler/policy"
	"github.com/datagovsg/nomad-parametric-autoscaler/resources"
	"github.com/datagovsg/nomad-parametric-autoscaler/types"
	"github.com/gin-gonic/gin"
	"go.uber.org/atomic"
)

type endpoints struct {
	wp        *WrappedPolicy
	vc        *resources.VaultClient
	store     *Store
	isRunning *atomic.Bool
}

// GetPolicy returns JSON version of current policy
// its output is compatible with UpdatePolicy.
func (ep *endpoints) GetPolicy(c *gin.Context) {
	c.JSON(200, policy.RecreatePlan(ep.wp.policy))
}

// GetResourceStatus returns map of resource to count
func (ep *endpoints) GetResourceStatus(c *gin.Context) {
	c.JSON(200, ep.wp.policy.GetResourceStatus())
}

// GetSubpolicyList returns list of possible subpolicies
func (ep *endpoints) GetPredefinedFeatures(c *gin.Context) {
	c.JSON(200, gin.H{
		"subpolicies": types.SubpolicyList,
		"ensemblers":  types.EnsemblerList,
	})
}

// UpdatePolicy parses body and builds a new policy to replace
// existing policy
// returns 200 if policy is well-formed and replaces existing successfully
// returns 400 if policy is malformed, along with the error message
func (ep *endpoints) UpdatePolicy(c *gin.Context) {
	var gsp policy.PolicyPlan
	c.BindJSON(&gsp)
	newpolicy, err := policy.MakePolicy(gsp, *ep.vc)

	if err != nil {
		logging.Error(err.Error())
		c.JSON(400, gin.H{
			"message": err.Error(),
		})
	} else {
		ep.wp.lock.Lock()
		ep.wp.policy = newpolicy
		ep.wp.lock.Unlock()

		// writing to postgres
		bt, err := json.Marshal(gsp)
		if err != nil {
			logging.Error(err.Error())
		}

		if err := ep.store.SaveState(string(bt)); err != nil {
			logging.Error(err.Error())
		}

		c.JSON(200, gin.H{
			"message": "Successful Update",
		})
	}
}

// PausePolicy is a utility endpoint that pauses the app and skips
// the checking-scaling step.
func (ep *endpoints) PausePolicy(c *gin.Context) {
	if err := ep.store.SaveRunningState(false); err == nil {
		ep.isRunning.Store(false)
		c.JSON(200, gin.H{
			"message": "Nomad AutoScaler resumed",
		})
	} else {
		c.JSON(400, gin.H{
			"message": err.Error(),
		})
	}
}

// ResumePolicy is a utility endpoint that resumes the app's checking-scaling cycle
func (ep *endpoints) ResumePolicy(c *gin.Context) {
	if err := ep.store.SaveRunningState(true); err == nil {
		ep.isRunning.Store(true)
		c.JSON(200, gin.H{
			"message": "Nomad AutoScaler resumed",
		})
	} else {
		c.JSON(400, gin.H{
			"message": err.Error(),
		})
	}
}

// GetState returns running state of server
func (ep *endpoints) GetState(c *gin.Context) {
	c.JSON(200, ep.isRunning.Load())
}
