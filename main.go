package main

import (
	"github.com/datagovsg/nomad-parametric-autoscaler/app"
	_ "github.com/datagovsg/nomad-parametric-autoscaler/app"
	"github.com/datagovsg/nomad-parametric-autoscaler/resources"
)

func main() {

	resources.Testnomad()
	a := app.NewApp()
	a.Run()

	// service endpoints
	r := app.NewRouter()
	r.Run() // listen and serve on 0.0.0.0:8080
}
