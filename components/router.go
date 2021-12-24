package components

import (
	"cvwo-backend/api"

	"github.com/gorilla/mux"
)

func setRouter() *mux.Router {

	router := mux.NewRouter()

	router.HandleFunc("/api/tasks", api.GetAllTask).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/createTask", api.CreateTask).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/deleteTask/{id}", api.DeleteTask).Methods("DELETE", "OPTIONS")
	router.HandleFunc("/api/updateTask", api.UpdateTask).Methods("PUT", "OPTIONS")

	router.HandleFunc("/api/register", api.Register).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/login", api.Login).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/checkUser", api.CheckAuthentication).Methods("GET", "OPTIONS")

	return router
}
