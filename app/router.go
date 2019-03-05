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

	router.POST("/update", ep.UpdatePolicy)

	return router
}
