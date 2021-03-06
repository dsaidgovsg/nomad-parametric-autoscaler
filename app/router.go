package app

import (
	"strconv"
	"strings"
	"time"

	"github.com/datagovsg/nomad-parametric-autoscaler/logging"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Config struct {
	CORSAllowOrigin      string `mapstructure:"cors_allow_origin"`
	CORSAllowCredentials string `mapstructure:"cors_allow_credentials"`
	CORSAllowHeaders     string `mapstructure:"cors_allow_headers"`
	CORSAllowMethods     string `mapstructure:"cors_allow_methods"`
}

func NewRouter(ep *endpoints) *gin.Engine {
	router := gin.Default()

	conf := Config{
		CORSAllowOrigin:      "*",
		CORSAllowCredentials: "true",
		CORSAllowHeaders:     "pragma,content-type,content-length,accept-encoding,x-csrf-token,authorization,accept,origin,x-requested-with",
		CORSAllowMethods:     "GET,POST,PUT,DELETE",
	}

	router.Use(corsMiddleware(&conf))

	// Core endpoints
	router.GET("/policy", ep.GetPolicy)
	router.POST("/policy", ep.UpdatePolicy)

	router.GET("/resource", ep.GetResourceStatus)
	router.GET("/predefined", ep.GetPredefinedFeatures)

	// Helper endpoints
	router.GET("/state", ep.GetState)
	router.PUT("/state/pause", ep.PausePolicy)
	router.PUT("/state/resume", ep.ResumePolicy)

	// Healthcheck
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	return router
}

func corsMiddleware(conf *Config) gin.HandlerFunc {
	allowCreds, err := strconv.ParseBool(conf.CORSAllowCredentials)

	if err != nil {
		// Default to false if cannot parse Allow-Credentials
		logging.Warning(err.Error())
		allowCreds = false
	}

	return cors.New(cors.Config{
		AllowOrigins:     strings.Split(conf.CORSAllowOrigin, ","),
		AllowMethods:     strings.Split(conf.CORSAllowMethods, ","),
		AllowHeaders:     strings.Split(conf.CORSAllowHeaders, ","),
		AllowCredentials: allowCreds,
		ExposeHeaders:    []string{"Content-Length"},
		MaxAge:           12 * time.Hour,
	})
}
