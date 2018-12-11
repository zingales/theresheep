package gamelogic

import (
	"fmt"
)

type Player struct {
	Name         string
	input        UserInput
	isDummy      bool
	originalRole Role
	currentRole  Role
}

func (player *Player) OriginalAssigment(role Role) {
	player.originalRole = role
	player.currentRole = role
}

func CreatePlayer(name string, ui UserInput) *Player {
	return &Player{Name: name, input: ui, isDummy: false}
}

func (player *Player) String() string {
	return fmt.Sprintf("<%s was %v and now is %v>", player.Name, player.originalRole, player.currentRole)
}

func (player *Player) ChooseCenterCards(number int) []int {
	nums := make([]int, number)
	for i := 0; i < number; i++ {

		var num int
		invalid := true
		additionalInfo := ""
		for invalid {
			invalid = false
			num = player.input.ChooseCenterCard(additionalInfo)
			if num < 1 {
				invalid = true
				additionalInfo = "Number cannot be smaller than 1"
				continue
			}

			if num > 3 {
				invalid = true
				additionalInfo = "Number cannot be larger than 3"
				continue
			}

			for j := 0; j < len(nums); j++ {
				if nums[j] == num {
					invalid = true
					additionalInfo = "When chosing more than 1 number, numbers can't be the same"
					continue
				}
			}
		}
		// Correcting for zero based indexing
		nums[i] = num - 1
	}

	return nums
}

func (player *Player) DoesChoosePlayerInsteadOfCenter() bool {
	return player.input.DoesChoosePlayerInsteadOfCenter("")
}

func (player *Player) ChoosePlayers(playerNames []string, count int) []string {
	// remove player name from the list of options:
	for i := 0; i < len(playerNames); i++ {
		if playerNames[i] == player.Name {
			playerNames[i] = playerNames[len(playerNames)-1]
			playerNames = playerNames[:len(playerNames)-1]
		}
	}

	names := make([]string, count)
	for i := 0; i < count; i++ {
		additionalInfo := ""
		invalid := true
		var name string
		for invalid {
			invalid = false
			name = player.input.ChoosePlayer(additionalInfo, playerNames)

			for j := 0; j < len(names); j++ {
				if names[j] == name {
					invalid = true
					additionalInfo = "When chosing more than 1 player, you can't choose the same player twice"
					continue
				}
			}
			// validate you don't choose the same player more than once
		}

		names[i] = name
	}

	return names
}

func (player *Player) KnowsRole(playerName string, role Role) {

}
