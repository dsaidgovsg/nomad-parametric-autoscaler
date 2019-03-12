package app

import (
	"github.com/datagovsg/nomad-parametric-autoscaler/logging"
	"github.com/datagovsg/nomad-parametric-autoscaler/policy"
	"github.com/datagovsg/nomad-parametric-autoscaler/resources"
	"github.com/gin-gonic/gin"
)

type endpoints struct {
	wp     *WrappedPolicy
	vc     *resources.VaultClient
	paused *bool
}

func (ep *endpoints) GetPolicy(c *gin.Context) {
	c.JSON(200, policy.RecreatePlan(ep.wp.policy))
}

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

		c.JSON(200, gin.H{
			"message": "Successful Update",
		})
	}
}

func (ep *endpoints) PausePolicy(c *gin.Context) {
	*ep.paused = true
	c.JSON(200, gin.H{
		"message": "Nomad AutoScaler paused",
	})
}

func (ep *endpoints) ResumePolicy(c *gin.Context) {
	*ep.paused = false
	c.JSON(200, gin.H{
		"message": "Nomad AutoScaler resumed",
	})
}
