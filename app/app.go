package app

import (
	"os"
	"sync"
	"time"

	"github.com/datagovsg/nomad-parametric-autoscaler/logging"
	"github.com/datagovsg/nomad-parametric-autoscaler/policy"
	"github.com/datagovsg/nomad-parametric-autoscaler/resources"
	"github.com/gin-gonic/gin"
)

type App struct {
	wp     *WrappedPolicy
	vc     *resources.VaultClient
	router *gin.Engine
}

// WrappedPolicy has a lock to prevent race
type WrappedPolicy struct {
	policy *policy.Policy
	lock   *sync.Mutex
}

// NewApp creates an app...
func NewApp() *App {
	wrappedPolicy := newWrappedPolicy()
	vaultClient := resources.NewVaultClient(os.Getenv("VAULT_ADDR"))
	return &App{
		vc: vaultClient,
		wp: wrappedPolicy,
		router: NewRouter(&endpoints{
			wp: wrappedPolicy,
			vc: vaultClient,
		}),
	}
}

func newWrappedPolicy() *WrappedPolicy {
	var mutex = &sync.Mutex{}
	return &WrappedPolicy{
		lock:   mutex,
		policy: policy.DefaultPolicy(),
	}
}

// Run causes the app to begin periodically checking and scaling
func (app *App) Run() {
	quit := make(chan struct{})
	go func() {
		freq := app.wp.policy.CheckingFrequency
		app.wp.lock.Lock()
		ticker := time.NewTicker(freq)
		app.wp.lock.Unlock()

		for {
			select {
			case <-ticker.C:
				logging.Info("Check Metrics ... ")
				app.wp.lock.Lock()
				logging.Info("Performing fake scaling ... ")
				// scaling is done on the policy-side so app just keeps caling scale
				app.wp.policy.Scale(app.vc)

				// update ticker
				if freq != app.wp.policy.CheckingFrequency {
					freq = app.wp.policy.CheckingFrequency
					ticker = time.NewTicker(freq)
				}

				app.wp.lock.Unlock()

			case <-quit:
				logging.Info("Stop Command Received ... ")
				ticker.Stop()
				return
			}
		}
	}()
	app.router.Run()
}
