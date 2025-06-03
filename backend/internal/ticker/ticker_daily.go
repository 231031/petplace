package ticker

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"petplace/internal/service"
	"syscall"
	"time"
)

type dailyTickerService struct {
	ReservationTimeService service.ReservationTimeService
}

func NewDailyTickerService(
	reservationTimeService service.ReservationTimeService,
) *dailyTickerService {
	return &dailyTickerService{
		ReservationTimeService: reservationTimeService,
	}
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
	location, err := time.LoadLocation("Asia/Bangkok")
	if err != nil {
		fmt.Println(err.Error())
		fmt.Println("failed to load time zone")
		return
	}
	currentTime := time.Now().In(location)
	currentDay := time.Date(
		currentTime.Year(),
		currentTime.Month(),
		currentTime.Day(),
		0, 0, 0, 0, location,
	)
	previousDay := time.Date(
		currentTime.Year(),
		currentTime.Month(),
		(currentTime.Day())-1,
		0, 0, 0, 0, location,
	)

	// update date for next 30 days from current day
	newDay := previousDay.AddDate(0, 0, 30)
	strMsg, err := ds.ReservationTimeService.UpdateDailyNewDate(previousDay, newDay)
	if err != nil {
		fmt.Println(err.Error())
		fmt.Println(strMsg)
		return
	}
	fmt.Println(strMsg)

	// transaction
	// update reservation status -> auto close
	// update status -> auto rejected all requests
	strMsg, err = ds.ReservationTimeService.UpdateDailyReservationAndBook(currentDay)
	if err != nil {
		fmt.Println(err.Error())
		fmt.Println(strMsg)
		return
	}
	fmt.Println(strMsg)
}
