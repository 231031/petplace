package ticker

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"petplace/internal/service"
	"strconv"
	"strings"
	"syscall"
	"time"
)

type tickerService struct {
	BookingService service.BookingService
}

func NewTickerService(
	bookingService service.BookingService,
) *tickerService {
	return &tickerService{
		BookingService: bookingService,
	}
}

const (
	period = time.Hour
)

// Run starts service
func (ds *tickerService) run(ctx context.Context) {
	ticker := time.NewTicker(period)
	for {
		select {
		case <-ticker.C:
			go func() {
				ds.task()
			}()
		case <-ctx.Done():
			ticker.Stop()
			return
		}
	}
}

// periodic task
func (ds *tickerService) task() {
	thailandLocation, err := time.LoadLocation("Asia/Bangkok")
	if err != nil {
		fmt.Println("Error loading location:", err)
		return
	}
	thTime := time.Now().In(thailandLocation)
	fmt.Printf("Ticker task, %v\n", thTime)

	ser, err := ds.BookingService.GetAllBookingHotelByStatus("accepted")
	if err != nil {
		fmt.Println(err.Error())
	}

	for i := range ser {
		checkOut := ser[i].CageRoom.Profile.CheckOut
		mapHour := strings.Split(checkOut, ":")

		h, err := strconv.Atoi(mapHour[0])
		if err != nil {
			fmt.Println(err.Error())
		}

		m, err := strconv.Atoi(mapHour[1])
		if err != nil {
			fmt.Println(err.Error())
		}

		year, month, day := ser[i].EndTime.Date()

		// checkout day from client and checkout time from profile
		checkoutTime := time.Date(year, month, day, h, m, 0, 0, thailandLocation)
		if thTime.After(checkoutTime) || thTime.Equal(checkoutTime) {
			ser[i].Status = "completed"
			err = ds.BookingService.UpdateHotelService(ser[i].ID, ser[i])
			if err != nil {
				fmt.Println(err.Error())
			}
			fmt.Println("updated status: ", ser[i].ID)
		}
	}
}

func (ds *tickerService) StartTickerService() {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	ds.run(ctx)

	// Handle shutdown signals
	shutdown := make(chan os.Signal, 1)
	signal.Notify(shutdown, syscall.SIGINT, syscall.SIGTERM)

	// Block until a shutdown signal is received
	<-shutdown
	fmt.Println("Shutting down ticker service...")
	cancel()
}
