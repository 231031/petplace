package service

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"petplace/internal/auth"
	"petplace/internal/model"
	"petplace/internal/types"

	"gorm.io/gorm"

	"github.com/go-playground/validator/v10"
)

// implement bussiness logic
type AuthService struct {
	UsersServiceIn UsersServiceIn
	Validate       *validator.Validate
}

func NewAuthService(
	usersServiceIn UsersServiceIn,
	validate *validator.Validate,
) *AuthService {
	return &AuthService{
		UsersServiceIn: usersServiceIn,
		Validate:       validate,
	}
}

func (s *AuthService) SignUp(user model.User) error {
	hashed, err := auth.HashPassword(user.Password)
	if err != nil {
		return err
	}

	user.Password = hashed
	_, res := s.UsersServiceIn.CreateUser(user)
	if res != nil {
		return res
	}
	return nil
}

func (s *AuthService) LogIn(payload types.LoginPayload) (any, string, error) {
	user, err := s.UsersServiceIn.GetUserByEmail(payload.Email)
	if err != nil {
		return model.User{}, "", err
	}

	if user.Email == "" || user.Password == "" {
		return model.User{}, "", nil
	}

	matched := auth.ComparePassword(payload.Password, user.Password)
	if !matched {
		return model.User{}, "", nil
	}

	userToken, err := auth.GenerateJwt(user.ID, user.Email, "client")
	if err != nil {
		return model.User{}, "", err
	}

	// profiles, current role = client
	returnUser := map[string]interface{}{
		"id":            user.ID,
		"email":         user.Email,
		"firstname":     user.FirstName,
		"surename":      user.Surename,
		"profile":       user.Profiles,
		"image_profile": user.ImageProfile,
	}
	return returnUser, userToken, nil
}

func (s *AuthService) LoginGoogle(authCode string) (any, string, error) {
	authResp, err := getAccessToken(authCode)
	if err != nil {
		return nil, "", err
	}

	userInfo, err := getUserInfo(authResp.AccessToken)
	if err != nil {
		return nil, "", err
	}

	// check exiting user
	user, err := s.UsersServiceIn.GetUserByEmail(userInfo.Email)

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			user = model.User{
				Email:        userInfo.Email,
				Password:     "",
				FirstName:    userInfo.GivenName,
				ImageProfile: userInfo.Picture,
			}
			createdUser, err := s.UsersServiceIn.CreateUser(user)
			if err != nil {
				return nil, "", err
			}

			userToken, err := auth.GenerateJwt(createdUser.ID, createdUser.Email, "client")
			if err != nil {
				return nil, "", err
			}

			returnUser := map[string]interface{}{
				"id":            createdUser.ID,
				"email":         createdUser.Email,
				"firstname":     createdUser.FirstName,
				"surename":      createdUser.Surename,
				"profile":       createdUser.Profiles,
				"image_profile": createdUser.ImageProfile,
			}
			return returnUser, userToken, nil
		}

		return nil, "", err
	}

	userToken, err := auth.GenerateJwt(user.ID, user.Email, "client")
	if err != nil {
		return nil, "", err
	}

	returnUser := map[string]interface{}{
		"id":            user.ID,
		"email":         user.Email,
		"firstname":     user.FirstName,
		"surename":      user.Surename,
		"profile":       user.Profiles,
		"image_profile": user.ImageProfile,
	}
	return returnUser, userToken, nil
}

func getUserInfo(accessToken string) (types.UserInfoResponse, error) {

	userInfo := types.UserInfoResponse{}

	api := os.Getenv("GOOGLE_API_INFO")
	req, err := http.NewRequest("GET", api, nil)
	if err != nil {
		return userInfo, err
	}

	req.Header.Set("Authorization", "Bearer "+accessToken)
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return userInfo, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return userInfo, fmt.Errorf("access user info failed with status: %s", resp.Status)
	}
	bodyBytes, _ := ioutil.ReadAll(resp.Body)

	err = json.Unmarshal(bodyBytes, &userInfo)
	if err != nil {
		return userInfo, err
	}

	return userInfo, nil
}

func getAccessToken(authCode string) (types.AuthGoogleResp, error) {
	data := &types.GoogleInfo{
		Code:        authCode,
		GrantType:   "authorization_code",
		RedirectURI: os.Getenv("GOOGLE_REDIRECT_URI"),
	}

	authResp := types.AuthGoogleResp{}

	body, err := json.Marshal(data)
	if err != nil {
		return authResp, err
	}

	req, err := http.NewRequest("POST", "https://oauth2.googleapis.com/token", bytes.NewBuffer(body))
	if err != nil {
		return authResp, err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", genBasicAuthHeader(os.Getenv("GOOGLE_CLIENT_ID"), os.Getenv("GOOGLE_CLIENT_SECRET")))

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return authResp, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return authResp, fmt.Errorf("auth failed with status: %s", resp.Status)
	}

	bodyR, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return authResp, err
	}

	err = json.Unmarshal(bodyR, &authResp)
	if err != nil {
		fmt.Println(err.Error())
		return authResp, err
	}
	return authResp, nil
}

// func refreshTokenGoogle() {}

func genBasicAuthHeader(clientID, clientSecret string) string {
	auth := clientID + ":" + clientSecret
	return "Basic " + base64.StdEncoding.EncodeToString([]byte(auth))
}
