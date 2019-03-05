package main

import (
	"github.com/datagovsg/nomad-parametric-autoscaler/app"
)

func main() {
	a := app.NewApp()
	a.Run()
}
