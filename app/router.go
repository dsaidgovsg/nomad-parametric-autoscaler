package app

import (
	"github.com/gin-gonic/gin"
)

func NewRouter(ep *endpoints) *gin.Engine {
	router := gin.Default()

	router.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	router.GET("/state", ep.GetPolicy)
	router.POST("/update", ep.UpdatePolicy)

	// Helper endpoints
	router.PUT("/pause", ep.PausePolicy)
	router.PUT("/resume", ep.ResumePolicy)

	return router
}
