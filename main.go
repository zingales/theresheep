package main

import "log"

type Role struct {
}

type Game struct {
	id             string
	players        []Player
	availibleRoles []Role
	actions        []Action
}

type Action struct {
	player Player
}

type Player struct {
	Name         string
	originalRole Role
	currentRole  Role
}

func main() {
	log.Printf("Yo")

}
