package gamelogic

import (
	"fmt"
)

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
