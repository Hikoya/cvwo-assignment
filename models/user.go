package models

import "time"

type User struct {
	ID        int       `json:"id,omitempty"`
	Email     string    `json:"email"`
	Password  string    `json:"password,omitempty"`
	Timestamp time.Time `json:"timestamp,omitempty"`
}
