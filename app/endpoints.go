package app

import (
	"github.com/datagovsg/nomad-parametric-autoscaler/logging"
	"github.com/datagovsg/nomad-parametric-autoscaler/policy"
	"github.com/datagovsg/nomad-parametric-autoscaler/resources"
	"github.com/gin-gonic/gin"
)

type endpoints struct {
	wp *WrappedPolicy
	vc *resources.VaultClient
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
