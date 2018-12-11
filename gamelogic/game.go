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
	Center   [3]*Player
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
	if player.input == nil || player.isDummy {
		log.Fatal("actual players need to have input device")
	}

	if player.Name == "" {
		log.Fatal("user name cannot be empty string")
	}

	// validate no two players have the same name
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
	fmt.Printf("Random Role Order %v\n", roleOrderAssigment)
	index := 0
	for ; index < len(game.players); index++ {
		player := game.players[index]
		role := game.rolePool[roleOrderAssigment[index]]
		player.OriginalAssigment(role)
		game.History.AddOriginalRoleAssignment(player.Name, role)
	}

	game.Center[0] = &Player{Name: nameOfCenterCard(0), isDummy: true}
	game.Center[0].OriginalAssigment(game.rolePool[roleOrderAssigment[index]])

	game.Center[1] = &Player{Name: nameOfCenterCard(1), isDummy: true}
	game.Center[1].OriginalAssigment(game.rolePool[roleOrderAssigment[index+1]])

	game.Center[2] = &Player{Name: nameOfCenterCard(2), isDummy: true}
	game.Center[2].OriginalAssigment(game.rolePool[roleOrderAssigment[index+2]])

	game.History.AssignCenter(game.Center[0], game.Center[1], game.Center[2])

	return nil
}

func nameOfCenterCard(i int) string {
	return "Center_" + strconv.Itoa(i)
}

func (game *Game) GetPlayerByOriginalRole(role Role) []*Player {
	players := make([]*Player, 0)
	for i := 0; i < len(game.players); i++ {
		if game.players[i].originalRole == role {
			players = append(players, game.players[i])

		}
	}

	return players
}

func (game *Game) GetPlayerByCurrentRole(role Role) []*Player {
	players := make([]*Player, 0)
	for i := 0; i < len(game.players); i++ {
		if game.players[i].currentRole == role {
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

	log.Fatal("Could not find name " + name)
	return nil
}

func (game *Game) SwapRoles(player1 *Player, player2 *Player) {
	tempRole := player1.currentRole
	player1.currentRole = player2.currentRole
	player2.currentRole = tempRole
	game.History.RoleSwap(player1.Name, player1.currentRole, player2.Name, player2.currentRole)
}

func (game *Game) ExecuteNight() {
	for i := 0; i < len(RoleOrder); i++ {
		activeRole := RoleOrder[i]
		players := game.GetPlayerByOriginalRole(activeRole)
		fmt.Printf("Role Turn %v\n", activeRole)
		fmt.Printf("Number of players of that role %d\n", len(players))
		if len(players) == 0 {
			continue
		}

		switch activeRole {
		case DoppleGanger:
			log.Fatal("DoppleGanger has not been implemented")
		case Werewolf:
			if len(players) == 1 {
				singularWerewolf := players[0]
				centerNumbers := singularWerewolf.ChooseCenterCards(1)
				center := game.Center[centerNumbers[0]]
				singularWerewolf.KnowsRole(center.Name, center.currentRole)
			} else {
				// Assumption there are only 2 werewolfs
				players[0].KnowsRole(players[1].Name, players[1].originalRole)
				players[1].KnowsRole(players[0].Name, players[0].originalRole)
			}
		case Minion:
			minion := players[0]
			// Assumption only 1 minion
			werewolfs := game.GetPlayerByOriginalRole(Werewolf)
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
				center1 := game.Center[centerNumbers[0]]
				center2 := game.Center[centerNumbers[1]]
				seer.KnowsRole(center1.Name, center1.currentRole)
				seer.KnowsRole(center2.Name, center2.currentRole)
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
			game.SwapRoles(drunk, game.Center[centerNumbers[0]])
		case Insomniac:
			insomniac := players[0]
			insomniac.KnowsRole(insomniac.Name, insomniac.currentRole)
		default:
			// Aka the villager
			continue
		}
	}
}

const NoWereWolfs string = "NoWerewolfs"

func (game *Game) EndGame() {
	killcount := make(map[string]int)
	whoNominatesWhom := make(map[string]string)
	// each player chooses whom to kill
	for i := 0; i < len(game.players); i++ {
		playerNames := game.PlayerNames()
		// you can't choose to kill yourself. But you can choose that there are no werewolfs in game
		playerNames[i] = NoWereWolfs

		names := game.players[i].ChoosePlayers(playerNames, 1)
		name := names[0]
		whoNominatesWhom[game.players[i].Name] = name

		if _, ok := killcount[name]; !ok {
			killcount[name] = 0
		}

		killcount[name]++
	}

	// find how many votes decide a kill
	maxKillCount := -1
	for _, v := range killcount {
		if v > maxKillCount {
			maxKillCount = v
		}
	}

	// Find whose been nominated to be killed
	nominees := make([]string, 0)
	for k, v := range killcount {
		if v == maxKillCount {
			nominees = append(nominees, k)
		}
	}

	// If a nominated person is hunter they can kill someone else
	for _, name := range nominees {
		if name == NoWereWolfs {
			continue
		}

		player := game.GetPlayerByName(name)
		if player.currentRole == Hunter {
			playerNames := player.ChoosePlayers(game.PlayerNames(), 1)
			nominees = append(nominees, playerNames[0])
		}
	}

	// Find all winners and losers
	tannerDeath := false
	werewolfDeath := false
	NoWereWolfsSelected := false
	for _, name := range nominees {
		if name == NoWereWolfs {
			NoWereWolfsSelected = true
			continue
		}

		player := game.GetPlayerByName(name)
		switch player.currentRole {
		case Tanner:
			tannerDeath = true
		case Werewolf:
			werewolfDeath = true
		}
	}

	fmt.Printf("Nominees %v\n", nominees)

	centerWerewolfs := 0
	if game.Center[0].currentRole == Werewolf {
		centerWerewolfs++
	}
	if game.Center[1].currentRole == Werewolf {
		centerWerewolfs++
	}
	if game.Center[2].currentRole == Werewolf {
		centerWerewolfs++
	}

	fmt.Printf("Werewolf Death %t, Tanner Death %t, No Werewolfs Selected %t, number of central werewolfs %d\n", werewolfDeath, tannerDeath, NoWereWolfsSelected, centerWerewolfs)

	if werewolfDeath {
		game.VillagerWin()
	}

	if tannerDeath {
		game.TannerWin()
	} else {

		if NoWereWolfsSelected && centerWerewolfs > 1 {
			game.VillagerWin()
		} else if !werewolfDeath {
			game.WerewolfWin()
		}
	}
}

func (game *Game) TannerWin() {
	fmt.Println("Tanner wins")
}

func (game *Game) VillagerWin() {
	fmt.Println("Team Villager wins")
}

func (game *Game) WerewolfWin() {
	fmt.Println("Team Werewolf wins")
}
