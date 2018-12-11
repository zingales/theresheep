package gamelogic

import (
	"errors"
)

type Role int

var InvalidNumberOfRolesError = errors.New("There is an invalid number of roles based on the players in this game")

var RoleOrder = [...]Role{DoppleGanger, Werewolf, Minion, Mason, Seer, Robber, TroubleMaker, Drunk, Insomniac, DoppleGanger}

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
	DoppleGanger
)

func (role Role) String() string {
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
		"DoppleGanger"}

	if role < 0 || role > DoppleGanger {
		return "Unknown"
	}

	return names[role]
}

func validateRolePool(roles []Role) error {
	if len(roles) < 6 {
		return InvalidNumberOfRolesError
	}

	// There can't be 1 mason

	return nil
}
