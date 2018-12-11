package gamelogic

import (
	"errors"
	"fmt"
)

var InvalidNumberOfPlayersError = errors.New("There is an invalid number of players in this game")
var InvalidNumberOfRolesError = errors.New("There is an invalid number of players in this game")

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
