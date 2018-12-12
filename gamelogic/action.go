package gamelogic

import "fmt"

type Action int

const (
	OriginalAssignment Action = iota
	LearnRoles
	NominatesToKill
	SwapRoles
)

type Event struct {
	Doer     *Player
	Action   Action
	Affected []*PlayerRolePair
}

type PlayerRolePair struct {
	Name string
	Role Role
}

func (playerRolePair *PlayerRolePair) String() string {
	return fmt.Sprintf("Player:%s; Role: %v",
		playerRolePair.Name, playerRolePair.Role)
}

func (event *Event) String() string {
	return fmt.Sprintf("Player:%s Did %v, affected player(s) %v",
		event.Doer.Name, event.Action, event.Affected)
}

func (action Action) String() string {
	names := [...]string{
		"OrginalAssignment",
		"LearnRoles",
		"SwapRoles",
	}

	if action < 0 || action > SwapRoles {
		return "Unknown"
	}

	return names[action]
}
