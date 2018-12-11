package gamelogic

import (
	"fmt"
)

type Player struct {
	Name         string
	originalRole Role
	currentRole  Role
}

func (player *Player) OriginalAssigment(role Role) {
	player.originalRole = role
	player.currentRole = role
}

func CreatePlayer(name string) *Player {
	return &Player{Name: name}
}

func (player *Player) String() string {
	return fmt.Sprintf("<%s was %v and now is %v>", player.Name, player.originalRole, player.currentRole)
}

func (player *Player) ChooseCenterCards(number int) []int {
	// Replace with user input
	return []int{1}
}

func (player *Player) DoesChoosePlayerInsteadOfCenter() bool {
	// replace with user input
	return true
}

func (player *Player) ChoosePlayers(playerNames []string, count int) []string {
	// replace with user input
	// validate you don't choose yourself as a player
	if count == 1 {
		return []string{playerNames[1]}
	} else {
		return []string{playerNames[1], playerNames[2]}
	}
}

func (player *Player) KnowsRole(playerName string, role Role) {

}
