package ticker

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"
)

type dailyTickerService struct{}

func NewDailyTickerService() *dailyTickerService {
	return &dailyTickerService{}
}

func (ds *dailyTickerService) StartDailyTicker() {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	now := time.Now()
	nextMidnight := now.Truncate(24 * time.Hour).Add(24 * time.Hour)
	durationUntilMidnight := nextMidnight.Sub(now)

	time.AfterFunc(durationUntilMidnight, func() {
		ds.taskDaily()
		go ds.runDailyTicker(ctx)
	})

	shutdown := make(chan os.Signal, 1)
	signal.Notify(shutdown, syscall.SIGINT, syscall.SIGTERM)

	<-shutdown
	fmt.Println("Shutting down daily ticker service...")
	cancel()

}
func (ds *dailyTickerService) runDailyTicker(ctx context.Context) {
	ticker := time.NewTicker(time.Hour * 24)
	fmt.Printf("Starting daily ticker")

	for {
		select {
		case <-ticker.C:
			// go func() {
			// 	ds.taskDaily()
			// }()
			ds.taskDaily()
		case <-ctx.Done():
			ticker.Stop()
			return
		}

	}
}
func (ds *dailyTickerService) taskDaily() {
	fmt.Println("Invoked everyday at 00:000")
}
