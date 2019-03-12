package main

import (
	"github.com/datagovsg/nomad-parametric-autoscaler/app"
	"github.com/datagovsg/nomad-parametric-autoscaler/logging"
)

func main() {
	a, err := app.NewApp()

	if err != nil {
		// does not run scaler without a valid vault token
		logging.Error(err.Error())
	} else {
		a.Run()
	}
}
