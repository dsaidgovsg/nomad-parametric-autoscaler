package app

import (
	"fmt"
	"time"
)

type App struct {
	// policy policy.Policy
}

func NewApp() App {
	return App{}
}

// runs a check every few second
func (app *App) Run() {
	// app.policy.checkingFrequency
	ticker := time.NewTicker(5 * time.Second)
	quit := make(chan struct{})

	go func() {
		for {
			select {
			case <-ticker.C:
				fmt.Println("CHECKING POLICY")
			case <-quit:
				ticker.Stop()
				return
			}
		}
	}()

}
