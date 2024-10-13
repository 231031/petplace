package api

import (
	"net/http"
	"petplace/internal/service"

	"github.com/labstack/echo/v4"
)

// handle requests and response requests
type SearchHandler struct {
	CageRoomServiceIn service.CageRoomServiceIn
}

func NewSearchHandler(cageRoomServiceIn service.CageRoomServiceIn) *SearchHandler {
	return &SearchHandler{CageRoomServiceIn: cageRoomServiceIn}
}


func (h *SearchHandler) RegisterRoutes(g *echo.Group) {
	g.GET("/hotel", h.handleSearchHotel)
}

func (h *SearchHandler) handleSearchHotel(c echo.Context) error {
	// la, long := c.QueryParam("latitude"), c.QueryParam("longitude")
	// start, end := c.QueryParam("start_time"), c.QueryParam("end_time")
	// filter := types.FilterSearchCage{
	// 	Longitude: long,
	// 	Latitude:  la,
	// 	StartTime: start,
	// 	EndTime:   end,
	// }

	// // ?latitude=12.34&longitude=56.78&start_time=...&end_time=...&animals[0][animal_type]=dog&animals[0][cage_size]=large&animals[1][animal_type]=cat&animals[1][cage_size]=small
	// animals := []types.FilterInfo{}

	// if err := c.Bind(&animals); err != nil {
	// 	return utils.HandleError(c, http.StatusBadRequest, "Invalid animals data", err)
	// }

	// cages, err := h.CageRoomServiceIn.SearchCage(animals, filter)
	// if err != nil {
	// 	return utils.HandleError(c, http.StatusInternalServerError, "Search system not available", err)
	// }
	
	return c.JSON(http.StatusOK, nil)
}