package utils

import (
	"time"
)

func GetCurrentTime() time.Time {
	loc, err := time.LoadLocation(GetEnv("TZ", "Asia/Singapore"))
	if err != nil {
		return time.Now().UTC().Add(8 * time.Hour)
	}
	return time.Now().In(loc)
}

func GetCurrentTimeHHMM() int {
	now := GetCurrentTime()
	return (now.Hour())*100 + now.Minute()
}
