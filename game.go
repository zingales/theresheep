package main

import (
	"errors"
	"fmt"
)

type Role int

var InvalidNumberOfPlayersError = errors.New("There is an invalid number of players in this game")
var InvalidNumberOfRolesError = errors.New("There is an invalid number of players in this game")

const (
	Unassigned Role = iota
	Villager
	Werewolf
	Seer
	Robber
	TroubleMaker
	Tanner
	Drunk
	Hunter
	Mason
	Insomniac
	Minion
	DobbleGanger
)

func (role Role) String() string {
	// declare an array of strings
	// ... operator counts how many
	// items in the array (7)
	names := [...]string{
		"Unassigned",
		"Villager",
		"Werewolf",
		"Seer",
		"Robber",
		"TroubleMaker",
		"Tanner",
		"Drunk",
		"Hunter",
		"Mason",
		"Insomniac",
		"Minion",
		"DobbleGanger"}

	if role < 0 || role > DobbleGanger {
		return "Unknown"
	}

	return names[role]
}

type Game struct {
	Id             string
	players        []*Player
	availibleRoles []Role
	Actions        []Action
}

func CreateGame(id string) (*Game, error) {
	game := &Game{Id: id}
	game.players = make([]*Player, 0)
	game.Actions = make([]Action, 0)
	return game, nil
}

func (game *Game) String() string {
	return fmt.Sprintf("Id: %s\n players %v\n avalibleRoles: %v\n actions: %v", game.Id, game.players, game.availibleRoles, game.Actions)
}

func (game *Game) AddPlayer(player *Player) {
	game.players = append(game.players, player)
}

func (game *Game) Start() error {
	if len(game.players) < 3 {
		return InvalidNumberOfPlayersError
	}

	if len(game.availibleRoles) != len(game.players)+3 {
		return InvalidNumberOfRolesError
	}

	return nil
}

type Action struct {
	player Player
}

type Player struct {
	Name         string
	originalRole Role
	currentRole  Role
}

func CreatePlayer(name string) *Player {
	return &Player{Name: name}
}

func (player *Player) String() string {
	return fmt.Sprintf("<%s was %v and now is %v>", player.Name, player.originalRole, player.currentRole)
}
