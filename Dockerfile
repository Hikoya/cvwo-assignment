# syntax=docker/dockerfile:1

FROM golang:alpine
WORKDIR /app
COPY go.mod ./
COPY go.sum ./
RUN go mod download
COPY *.go ./
RUN go build -o /cvwo-assignment

EXPOSE 8080
CMD [ "/cvwo-assignment" ]