package app

import (
	"encoding/json"
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
	isRunning *bool
}

// WrappedPolicy has a lock to prevent race
type WrappedPolicy struct {
	policy *policy.Policy
	lock   *sync.Mutex
}

// NewApp creates an app ...
func NewApp() (*App, error) {
	// get vault client
	vaultClient, err := resources.NewVaultClient(os.Getenv("VAULT_ADDR"))
	if err != nil {
		return nil, err
	}

	// get store initialised
	store := &Store{}
	if err := store.Init(); err != nil {
		return nil, err
	}

	// initialise existing / default policy
	var existingPolicy *policy.Policy
	state, err := store.GetLatestState()
	if err != nil {
		logging.Error(err.Error())
		existingPolicy = nil
	} else {
		parsed := policy.PolicyPlan{}
		json.Unmarshal([]byte(state), &parsed)
		existingPolicy, err = policy.MakePolicy(parsed, *vaultClient)

		if err != nil {
			logging.Error(err.Error())
		}
	}

	wrappedPolicy := newWrappedPolicy(existingPolicy)

	var isRunning bool
	if b, err := store.GetLatestRunningState(); err != nil {
		isRunning = true
		logging.Error(err.Error())
	} else {
		isRunning = b
	}

	return &App{
		vc:     vaultClient,
		wp:     wrappedPolicy,
		isRunning: &isRunning,
		router: NewRouter(
			&endpoints{
				wp:     wrappedPolicy,
				vc:     vaultClient,
				store:  store,
				isRunning: &isRunning,
			}),
	}, nil
}

func newWrappedPolicy(defaultPolicy *policy.Policy) *WrappedPolicy {
	var mutex = &sync.Mutex{}

	if defaultPolicy == nil {
		defaultPolicy = policy.DefaultPolicy()
	}

	return &WrappedPolicy{
		lock:   mutex,
		policy: defaultPolicy,
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
				app.wp.lock.Lock()

				if *app.isRunning != true {
					app.wp.policy.Scale(app.vc)
				}

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
