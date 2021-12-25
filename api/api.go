package api

import (
	"cvwo-backend/models"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/gorilla/mux"
	"github.com/gorilla/securecookie"
	"golang.org/x/crypto/bcrypt"

	_ "github.com/go-sql-driver/mysql"
)

var db *sql.DB
var sc *securecookie.SecureCookie
var URL = "http://localhost:3000"

func init() {
	createDBInstance()
	initCookie()
}

func createDBInstance() {
	// DB connection string
	connectionString := os.Getenv("DB_URI")

	DB, err := sql.Open("mysql", connectionString)
	if err != nil {
		log.Println(err.Error())
	}

	db = DB
	err = db.Ping()
	if err != nil {
		log.Println(err)
	}

	db.SetConnMaxLifetime(time.Minute * 3)
}

func initCookie() {
	cookie_bl, _ := hex.DecodeString(os.Getenv("COOKIE_BLOCK"))
	cookie_hs, _ := hex.DecodeString(os.Getenv("COOKIE_HASH"))
	sc = securecookie.New(cookie_bl, cookie_hs)
}

func GetAllTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", URL)
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	var payload []models.Task
	checkAuth, _ := checkAuthorisation(r)
	if checkAuth {
		type User struct {
			UserID int
		}

		var user User

		_ = json.NewDecoder(r.Body).Decode(&user)

		payload = getAllTask(user.UserID)
	}

	json.NewEncoder(w).Encode(payload)
}

func CreateTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", URL)
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	var task models.Task
	_ = json.NewDecoder(r.Body).Decode(&task)

	payload := ""
	checkAuth, _ := checkAuthorisation(r)
	if checkAuth {
		payload = createTask(task)
	} else {
		payload = `{"result":"failed"}`
	}

	json.NewEncoder(w).Encode(payload)
}

func DeleteTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", URL)
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Methods", "DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	payload := ""
	checkAuth, userID := checkAuthorisation(r)
	if checkAuth {
		params := mux.Vars(r)
		taskID, _ := strconv.Atoi(params["id"])

		if checkAuthDB(taskID, userID) {
			payload = deleteTask(params["id"])
		} else {
			payload = `{"result":"failed"}`
		}
	} else {
		payload = `{"result":"failed"}`
	}

	json.NewEncoder(w).Encode(payload)
}

func UpdateTask(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", URL)
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Methods", "PUT")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	payload := ""
	checkAuth, userID := checkAuthorisation(r)
	if checkAuth {
		var task models.Task
		_ = json.NewDecoder(r.Body).Decode(&task)

		if checkAuthDB(task.ID, userID) {
			payload = updateTask(task)
		} else {
			payload = `{"result":"failed"}`
		}

	} else {
		payload = `{"result":"failed"}`
	}

	json.NewEncoder(w).Encode(payload)
}

func getAllTask(userID int) []models.Task {
	var tasks []models.Task

	if userID == 0 {

	} else {
		taskTable := os.Getenv("TASK_TABLE")
		selectQuery := "SELECT * FROM "
		specificQuery := " WHERE userID = "

		query := fmt.Sprintf("%s%s%s%s", selectQuery, taskTable, specificQuery, strconv.Itoa(userID))
		res, err := db.Query(query)
		if err != nil {
			log.Println(err.Error())
		}

		for res.Next() {
			var task models.Task
			err = res.Scan(&task.ID, &task.UserID, &task.TaskName, &task.Description, &task.Category, &task.Timestamp)
			if err != nil {
				log.Println(err.Error())
			}
			tasks = append(tasks, task)
		}
	}

	return tasks
}

func createTask(task models.Task) string {
	taskTable := os.Getenv("TASK_TABLE")
	insertQuery := "INSERT INTO "
	valuesQuery := " (userID, taskName, description, category) VALUES (?, ?, ?, ?)"

	msg := `{"result":"failed"}`

	if len(task.TaskName) == 0 || len(task.Description) == 0 || len(task.Category) == 0 {
		msg = `{"result":"failed, empty field"}`
	} else {
		query := fmt.Sprintf("%s%s%s", insertQuery, taskTable, valuesQuery)
		res, err := db.Prepare(query)
		if err != nil {
			log.Println(err.Error())
		}

		_, err = res.Exec(task.UserID, task.TaskName, task.Description, task.Category)
		if err != nil {
			log.Println(err.Error())
		}

		msg = `{"result":"success"}`
	}

	return msg
}

func deleteTask(taskID string) string {
	taskTable := os.Getenv("TASK_TABLE")
	deleteQuery := "DELETE FROM "
	valuesQuery := " WHERE id = ?"

	msg := `{"result":"failed"}`

	if _, err := strconv.Atoi(taskID); err == nil {
		query := fmt.Sprintf("%s%s%s", deleteQuery, taskTable, valuesQuery)

		res, err := db.Prepare(query)
		if err != nil {
			log.Println(err.Error())
		}

		_, err = res.Exec(taskID)
		if err != nil {
			log.Println(err.Error())
		}

		msg = `{"result":"success"}`

	} else {
		msg = `{"result":"failed, id is not an int"}`
	}

	return msg
}

func updateTask(task models.Task) string {
	taskTable := os.Getenv("TASK_TABLE")
	updateQuery := "UPDATE "
	valuesQuery := " SET taskName = ? , description = ? , category = ? WHERE id = ?"

	msg := `{"result":"failed"}`

	if len(task.TaskName) == 0 || len(task.Description) == 0 || len(task.Category) == 0 {
		msg = `{"result":"failed, empty field"}`
	} else {
		query := fmt.Sprintf("%s%s%s", updateQuery, taskTable, valuesQuery)

		res, err := db.Prepare(query)
		if err != nil {
			log.Println(err.Error())
		}

		_, err = res.Exec(task.TaskName, task.Description, task.Category, task.ID)
		if err != nil {
			log.Println(err.Error())
		}

		msg = `{"result":"success"}`
	}

	return msg
}

func Register(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", URL)
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	var user models.User
	_ = json.NewDecoder(r.Body).Decode(&user)

	payload := register(user)

	json.NewEncoder(w).Encode(payload)
}

func register(user models.User) string {
	userTable := os.Getenv("USER_TABLE")
	updateQuery := "INSERT INTO  "
	valuesQuery := " (email, password) VALUES (?, ?)"

	msg := `{"result":"failed"}`

	if len(user.Email) == 0 || len(user.Password) == 0 {
		msg = `{"result":"failed, empty field"}`
	} else {
		password, _ := bcrypt.GenerateFromPassword([]byte(user.Password), 14)

		query := fmt.Sprintf("%s%s%s", updateQuery, userTable, valuesQuery)

		res, err := db.Prepare(query)
		if err != nil {
			log.Println(err.Error())
		}

		_, err = res.Exec(user.Email, password)
		if err != nil {
			log.Println(err.Error())
		}

		msg = `{"result":"success"}`
	}

	return msg
}

func Login(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", URL)
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	var user models.User
	_ = json.NewDecoder(r.Body).Decode(&user)

	payload, success, token := login(user)
	if success {
		value := map[string]string{
			"token": token,
		}

		if encoded, err := sc.Encode(os.Getenv("COOKIE_NAME"), value); err == nil {
			cookie := &http.Cookie{
				Name:  os.Getenv("COOKIE_NAME"),
				Value: encoded,
				Path:  "/",
			}

			http.SetCookie(w, cookie)
		}

	}

	json.NewEncoder(w).Encode(payload)
}

func login(user models.User) (string, bool, string) {
	userTable := os.Getenv("USER_TABLE")
	selectQuery := "SELECT * FROM  "
	valuesQuery := " WHERE email = ? "

	msg := `{"result":"failed"}`

	if len(user.Email) == 0 || len(user.Password) == 0 {
		msg = `{"result":"failed, empty field"}`
		return msg, false, ""
	} else {

		token := ""
		query := fmt.Sprintf("%s%s%s", selectQuery, userTable, valuesQuery)

		res, err := db.Prepare(query)
		if err != nil {
			log.Println(err.Error())
		}

		exec_res, err := res.Query(user.Email)
		if err != nil {
			log.Println(err.Error())
		}

		count := 0
		for exec_res.Next() {
			count += 1
		}

		if count > 1 {
			msg = `{"result":"failed, duplicate accounts detected"}`
		} else {

			exec_res, err := res.Query(user.Email)
			if err != nil {
				log.Println(err.Error())
			}

			for exec_res.Next() {
				var user_db models.User
				err = exec_res.Scan(&user_db.ID, &user_db.Email, &user_db.Password, &user_db.Timestamp)
				if err != nil {
					log.Println(err.Error())
				}

				if err := bcrypt.CompareHashAndPassword([]byte(user_db.Password), []byte(user.Password)); err != nil {
					msg = `{"result":"failed, password incorrect"}`
					return msg, false, ""
				} else {

					type CustomClaims struct {
						UserID int    `json:"userID"`
						Email  string `json:"email"`
						jwt.StandardClaims
					}

					// Create the Claims
					custom_claims := CustomClaims{
						user_db.ID,
						user_db.Email,
						jwt.StandardClaims{
							ExpiresAt: time.Now().Add(time.Hour * 24).Unix(),
							Issuer:    user_db.Email,
						},
					}

					claims := jwt.NewWithClaims(jwt.SigningMethodHS256, custom_claims)
					secret := os.Getenv("JWT_SECRET")
					token, err = claims.SignedString([]byte(secret))
					if err != nil {
						log.Println(err.Error())
					}

				}
			}

			msg = `{"result":"success"}`
		}

		return msg, true, token
	}
}

func CheckAuthentication(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Origin", URL)

	msg := `{"result":"failed"}`

	if cookie, err := r.Cookie(os.Getenv("COOKIE_NAME")); err == nil {
		value := make(map[string]string)

		if err = sc.Decode(os.Getenv("COOKIE_NAME"), cookie.Value, &value); err == nil {
			type CustomClaims struct {
				UserID int    `json:"userID"`
				Email  string `json:"email"`
				jwt.StandardClaims
			}

			token, err := jwt.ParseWithClaims(value["token"], &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
				return []byte(os.Getenv("JWT_SECRET")), nil
			})

			if claims, ok := token.Claims.(*CustomClaims); ok && token.Valid {
				msg = fmt.Sprintf(`{"result": "success", "userID" : %v, "email" : "%v" }`, claims.UserID, claims.Email)
			} else {
				log.Println(err)
			}
		}
	}

	json.NewEncoder(w).Encode(msg)
}

func checkAuthorisation(r *http.Request) (bool, int) {
	res := false
	userID := 0

	if cookie, err := r.Cookie(os.Getenv("COOKIE_NAME")); err == nil {
		value := make(map[string]string)

		if err = sc.Decode(os.Getenv("COOKIE_NAME"), cookie.Value, &value); err == nil {
			type CustomClaims struct {
				UserID int    `json:"userID"`
				Email  string `json:"email"`
				jwt.StandardClaims
			}

			token, _ := jwt.ParseWithClaims(value["token"], &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
				return []byte(os.Getenv("JWT_SECRET")), nil
			})

			if claims, ok := token.Claims.(*CustomClaims); ok && token.Valid {
				res = true
				userID = claims.UserID
			}
		}
	}

	return res, userID
}

func checkAuthDB(taskID int, userID int) bool {
	payload := false

	taskTable := os.Getenv("TASK_TABLE")
	selectQuery := "SELECT * FROM "
	specificQuery := " WHERE id = "

	query := fmt.Sprintf("%s%s%s%s", selectQuery, taskTable, specificQuery, strconv.Itoa(taskID))
	res, err := db.Query(query)
	if err != nil {
		log.Println(err.Error())
	}

	for res.Next() {
		var task models.Task
		err = res.Scan(&task.ID, &task.UserID, &task.TaskName, &task.Description, &task.Category, &task.Timestamp)
		if err != nil {
			log.Println(err.Error())
		}

		if task.UserID == userID {
			payload = true
		}
	}

	return payload
}
