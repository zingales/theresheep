package gamelogic

import (
	"errors"
	"fmt"
	"log"
	"math/rand"
	"strconv"
)

var InvalidNumberOfPlayersError = errors.New("There is an invalid number of players in this game")

type Game struct {
	Id       string
	players  []*Player
	rolePool []Role
	History  *ActionManager
	Center   [3]Role
}

func CreateGame(id string) (*Game, error) {
	game := &Game{Id: id}
	game.players = make([]*Player, 0)
	game.History = &ActionManager{}
	return game, nil
}

func (game *Game) String() string {
	return fmt.Sprintf("Id: %s\n players %v\n avalibleRoles: %v\n History: %v\n Center: %v", game.Id, game.players, game.rolePool, game.History, game.Center)
}

func (game *Game) AddPlayer(player *Player) {
	if player.input == nil {
		log.Fatal("user needs to have input device")
	}

	if player.Name == "" {
		log.Fatal("user name cannot be empty string")
	}
	game.players = append(game.players, player)
}

func (game *Game) AssignRolePool(roles []Role) error {
	if err := validateRolePool(roles); err != nil {
		return err
	}

	game.rolePool = roles

	return nil
}

func (game *Game) Start() error {
	if len(game.players) < 3 {
		return InvalidNumberOfPlayersError
	}

	if len(game.rolePool) != len(game.players)+3 {
		return InvalidNumberOfRolesError
	}

	roleOrderAssigment := rand.Perm(len(game.rolePool))
	fmt.Println("Random Role Order %v", roleOrderAssigment)
	index := 0
	for ; index < len(game.players); index++ {
		player := game.players[index]
		role := game.rolePool[roleOrderAssigment[index]]
		player.OriginalAssigment(role)
		game.History.AddOriginalRoleAssignment(player.Name, role)
	}

	game.Center[0] = game.rolePool[roleOrderAssigment[index]]
	game.Center[1] = game.rolePool[roleOrderAssigment[index+1]]
	game.Center[2] = game.rolePool[roleOrderAssigment[index+2]]

	game.History.AssignCenter(game.Center[0], game.Center[1], game.Center[2])

	return nil
}

func (game *Game) GetPlayerByRole(role Role) []*Player {
	players := make([]*Player, 0)
	for i := 0; i < len(game.players); i++ {
		if game.players[i].originalRole == role {
			players = append(players, game.players[i])

		}
	}

	return players

}

func (game *Game) PlayerNames() []string {
	names := make([]string, 0)
	for i := 0; i < len(game.players); i++ {
		names = append(names, game.players[i].Name)
	}

	return names
}

func (game *Game) GetPlayerByName(name string) *Player {
	for i := 0; i < len(game.players); i++ {
		if game.players[i].Name == name {
			return game.players[i]
		}
	}

	return nil
}

func (game *Game) SwapRoles(player1 *Player, player2 *Player) {
	tempRole := player1.currentRole
	player1.currentRole = player2.currentRole
	player2.currentRole = tempRole
	game.History.RoleSwap(player1.Name, player1.currentRole, player2.Name, player2.currentRole)
}

func nameOfCenterCard(i int) string {
	return "Center_" + strconv.Itoa(i)
}

func (game *Game) SwapWithCenter(player *Player, centerNumber int) {
	tempRole := player.currentRole
	player.currentRole = game.Center[centerNumber]
	game.Center[centerNumber] = tempRole
	game.History.RoleSwap(player.Name, player.currentRole, nameOfCenterCard(centerNumber), tempRole)
}

func (game *Game) ExecuteNight() {
	for i := 0; i < len(RoleOrder); i++ {
		activeRole := RoleOrder[i]
		players := game.GetPlayerByRole(activeRole)
		if len(players) == 0 {
			continue
		}

		switch activeRole {
		case Werewolf:
			if len(players) == 1 {
				singularWerewolf := players[0]
				centerNumbers := singularWerewolf.ChooseCenterCards(1)
				centerNumber := centerNumbers[0]
				singularWerewolf.KnowsRole(nameOfCenterCard(centerNumber), game.Center[centerNumber])
			} else {
				// Assumption there are only 2 werewolfs
				players[0].KnowsRole(players[1].Name, players[1].originalRole)
				players[1].KnowsRole(players[0].Name, players[0].originalRole)
			}
		case Minion:
			minion := players[0]
			// Assumption only 1 minion
			werewolfs := game.GetPlayerByRole(Werewolf)
			for j := 0; j < len(werewolfs); j++ {
				minion.KnowsRole(werewolfs[j].Name, werewolfs[j].originalRole)
			}
		case Mason:
			if len(players) == 2 {
				players[0].KnowsRole(players[1].Name, players[1].originalRole)
				players[1].KnowsRole(players[0].Name, players[0].originalRole)
			}
		case Seer:
			seer := players[0]
			if seer.DoesChoosePlayerInsteadOfCenter() {
				playerNames := seer.ChoosePlayers(game.PlayerNames(), 1)
				player := game.GetPlayerByName(playerNames[0])
				seer.KnowsRole(playerNames[0], player.originalRole)
			} else {
				centerNumbers := seer.ChooseCenterCards(2)
				seer.KnowsRole(nameOfCenterCard(centerNumbers[0]), game.Center[centerNumbers[0]])
				seer.KnowsRole(nameOfCenterCard(centerNumbers[1]), game.Center[centerNumbers[1]])
			}
		case Robber:
			robber := players[0]
			playerNames := robber.ChoosePlayers(game.PlayerNames(), 1)
			player := game.GetPlayerByName(playerNames[0])
			robber.KnowsRole(playerNames[0], player.currentRole)
			game.SwapRoles(robber, player)
		case TroubleMaker:
			troubleMaker := players[0]
			playerNames := troubleMaker.ChoosePlayers(game.PlayerNames(), 2)
			player1 := game.GetPlayerByName(playerNames[0])
			player2 := game.GetPlayerByName(playerNames[1])
			game.SwapRoles(player1, player2)
		case Drunk:
			drunk := players[0]
			centerNumbers := drunk.ChooseCenterCards(1)
			game.SwapWithCenter(drunk, centerNumbers[0])
		case Insomniac:
			insomniac := players[0]
			insomniac.KnowsRole(insomniac.Name, insomniac.currentRole)
		default:
			// Aka the villager
			continue
		}
	}
}
