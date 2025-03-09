package repository_test

import (
	"petplace/internal/model"
	"petplace/internal/repository"
	"petplace/internal/utils"
	"testing"

	"github.com/stretchr/testify/suite"
	"gorm.io/gorm"
)

type suiteUsersRepository struct {
	suite.Suite
	testDB     *gorm.DB
	repository repository.UserRepository
}

// Setup before all tests
func (suite *suiteUsersRepository) SetupSuite() {
	db, _ := utils.ConnectTestDB()
	suite.testDB = db

	r := repository.NewUserRepository(db)
	suite.repository = r
}

// Setup after all tests
func (suite *suiteUsersRepository) TearDownSuite() {
	sql, _ := suite.testDB.DB()
	sql.Close()
}

func (suite *suiteUsersRepository) TestCreateUserPositive() {
	_, err := suite.repository.CreateUser(
		model.User{
			Email:    "test41@gmail.com",
			Password: "12345",
		},
	)

	suite.NoError(err, "error from inserting user")
}

func (suite *suiteUsersRepository) TestCreateUserNegative() {
	_, err := suite.repository.CreateUser(
		model.User{
			Email:    "test23@gmail.com",
			Password: "12345",
		},
	)
	suite.Error(err, "this insertion should get error")
}

func (suite *suiteUsersRepository) TestGetUserByID() {
}

func (suite *suiteUsersRepository) TestGetUserByEmail() {
}

func (suite *suiteUsersRepository) TestUpdateUser() {
}

func TestSuite(t *testing.T) {
	suite.Run(t, new(suiteUsersRepository))
}
