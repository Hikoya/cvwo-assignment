package models

import "time"

type Task struct {
	ID          int       `json:"id,omitempty"`
	UserID      int       `json:"userID,omitempty"`
	TaskName    string    `json:"taskName"`
	Description string    `json:"description"`
	Category    string    `json:"category"`
	Timestamp   time.Time `json:"timestamp,omitempty"`
}
