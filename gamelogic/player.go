package gamelogic

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"sync"

	"github.com/zingales/theresheep/utils"
)

type Player struct {
	Name         string
	input        UserInput
	isDummy      bool
	originalRole Role
	currentRole  Role
	HasSeen      map[string]Role

	// protects killNomination
	lock           sync.RWMutex
	killNomination string
}

func (p *Player) MarshalJSON() ([]byte, error) {
	hasSeen := make(map[string]string)
	for playerName, roleId := range p.HasSeen {
		hasSeen[playerName] = RoleIDToName[roleId]
	}
	return json.Marshal(map[string]interface{}{
		"name":         p.Name,
		"originalRole": RoleIDToName[p.originalRole],
		"hasSeen":      hasSeen,
		"actionPrompt": p.input.Prompt(),
	})
}

func (player *Player) OriginalAssigment(role Role) {
	player.originalRole = role
	player.currentRole = role
}

func CreatePlayer(name string, ui UserInput) *Player {
	return &Player{Name: name, input: ui, isDummy: false, HasSeen: make(map[string]Role)}
}

func (player *Player) String() string {
	return fmt.Sprintf("<%s was %v and now is %v; Has Seen %v>", player.Name, player.originalRole, player.currentRole, player.HasSeen)
}

func (player *Player) createPlayerRolePair() *PlayerRolePair {
	return &PlayerRolePair{Name: player.Name, Role: player.currentRole}
}

func (player *Player) ChooseCenterCards(number int) []int {
	nums := make([]int, 0)
	for i := 0; i < number; i++ {

		var num int
		invalid := true
		additionalInfo := ""
		for invalid {
			invalid = false
			num = player.input.ChooseCenterCard(additionalInfo)
			if num < 0 {
				invalid = true
				additionalInfo = "Number cannot be smaller than 0"
				continue
			}

			if num > 2 {
				invalid = true
				additionalInfo = "Number cannot be larger than 2"
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

		nums = append(nums, num)
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

			// validate you don't choose the same player more than once
			for j := 0; j < len(names); j++ {
				if names[j] == name {
					invalid = true
					additionalInfo = "When chosing more than 1 player, you can't choose the same player twice"
					continue
				}
			}
		}

		names[i] = name
	}

	return names
}

func (player *Player) KnowsRole(playerName string, role Role) {
	player.HasSeen[playerName] = role
}

func (player *Player) UserAction(actionType string, actionBody interface{}) error {
	switch actionType {
	case ChooseCenterCardMsg:
		return player.input.ReceiveMessage(actionType, actionBody)
	case ChoosePlayerMsg:
		return player.input.ReceiveMessage(actionType, actionBody)
	case ChoosePlayerInsteadOfCenterMsg:
		return player.input.ReceiveMessage(actionType, actionBody)
	case NominateToKillMsg:
		actionBodyAsStr, isStr := actionBody.(string)
		if !isStr {
			return fmt.Errorf(
				"Message must be type <string> for \"%s\". "+
					"Received %x",
				NominateToKillMsg, actionBody)
		}
		player.SetNominateToKill(actionBodyAsStr)
		return nil
	default:
		return fmt.Errorf("Unknown user action ", actionType)
	}
}

func (player *Player) SetNominateToKill(nomination string) {
	player.lock.Lock()
	defer player.lock.Unlock()
	player.killNomination = nomination
}

func (player *Player) GetKillNomination(playerNames []string) string {
	if player.input.GetType() == "BrowserUserInput" {
		player.lock.Lock()
		defer player.lock.Unlock()
		if player.killNomination == "" {
			// user didn't choose a characeter. Choose a character
			// randomly on behalf of the user
			playersMinusCurrent := utils.Filter(
				playerNames, func(name string) bool {
					return name != player.Name
				})
			randIdx := rand.Intn(len(playersMinusCurrent))
			player.killNomination =
				playersMinusCurrent[randIdx]
		}
		return player.killNomination
	} else {
		for i := 0; i < len(playerNames); i++ {
			// you can't choose to kill yourself. But you can
			// choose that there are no werewolfs in game
			if playerNames[i] == player.Name {
				playerNames[i] = NoWereWolfs
				break
			}
		}
		names := player.ChoosePlayers(playerNames, 1)
		return names[0]
	}
}
