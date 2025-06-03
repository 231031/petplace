package service_test

import (
	"petplace/internal/model"
	"petplace/internal/repository"
	"petplace/internal/service"
	"petplace/internal/utils"
	"testing"

	"github.com/go-playground/validator/v10"
	"github.com/stretchr/testify/suite"
	"gorm.io/gorm"
)

type suiteUsersService struct {
	suite.Suite
	testDB  *gorm.DB
	service service.UsersService
}

func (suite *suiteUsersService) SetupSuite() {
	testDB, _ := utils.ConnectTestDB()
	suite.testDB = testDB

	userRepo := repository.NewUserRepository(testDB)
	animalUserRepo := repository.NewAnimalUserRepository(testDB)
	favRepo := repository.NewFavoriteCageRepository(testDB)
	val := validator.New()

	usersService := service.NewUserService(userRepo, animalUserRepo, favRepo, val)
	suite.service = usersService
}

func (suite *suiteUsersService) TearDownSuite() {
	sql, _ := suite.testDB.DB()
	sql.Close()
}

func (suite *suiteUsersService) TestCreateUser() {
	suite.service.CreateUser(
		model.User{
			Email:    "test23@gmail.com",
			Password: "12345",
		},
	)
}

func TestSuite(t *testing.T) {
	suite.Run(t, new(suiteUsersService))
}
