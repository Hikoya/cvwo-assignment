# Lister
## CVWO 2021 Submission

Lister is a simple task management application to help users keep track of their to-do items in a quick and efficient manner.

## Features

- User Authentication with Login and Registration
- Full CRUD capabilities
- Category-sorting to allow quick search based on individual tags
- Simple UI

## Tech Stack

Lister itself is open source and hosted on [Github](https://github.com/Hikoya/cvwo-assignment)
- [ReactJS] - HTML enhanced for web apps!
- [Golang] - Interaction with database, backend
- [MySQL] - Simple and easy-to-use database 

Lister follows a standard three-tier architecture:
- The application is deployed onto [Heroku](https://infinite-badlands-96242.herokuapp.com/)
- The MySQL database is hosted on Amazon RDS.

## Installation

Lister requires React and Golang to run

Create a .env file in the root directory and input the necessary credentials to start the server.

```sh
cd cvwo-assignment
go run main.go
```

The following env variables are required:

| Name | Description |
| ------ | ------ |
| PORT | The port to run the server at (Used: 8080) |
| DB_URI | Database URI. The format can be found | [here](https://github.com/go-sql-driver/mysql#dsn-data-source-name). Set parseTime = true. |
| TASK_TABLE | Name of the database that contains all the tasks (Used: tasks) |
| USER_TABLE | Name of the database that contains all the users (Used: users) |
| JWT_SECRET | Secret for signing a JWT |
| COOKIE_HASH | Hash keys should be at least 64 bytes long 
| COOKIE_BLOCK | Block keys should be 32 bytes (AES-256) long.
| COOKIE_NAME | Name of the cookie that is sent to the user (Used: token) |


## Plugins

Lister is currently extended with the following plugins.

Golang:
| Plugin | Description |
| ------ | ------ |
| Go-MySQL-Driver |A MySQL-Driver for Go's database/sql package |
| jwt-go | A go (or 'golang' for search engine friendliness) implementation of JSON Web Tokens. |
| gorilla-mux |Package gorilla/mux implements a request router and dispatcher for matching incoming requests to their respective handler. |
| GoDotEnv | A Go (golang) port of the Ruby dotenv project (which loads env vars from a .env file) |
| securecookie | securecookie encodes and decodes authenticated and optionally encrypted cookie values. |
| go-bcrypt | Package bcrypt implements Provos and Mazières's bcrypt adaptive hashing algorithm. |

ReactJS:
| Plugin | Description |
| ------ | ------ |
| Prettier | Code formatter for readability |
| Bootstrap | The most popular CSS Framework for developing responsive and mobile-first websites.|
| Axios | Promise based HTTP client for the browser and node.js |

## License
MIT
