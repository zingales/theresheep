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
	game.History = &ActionManager{game: game}
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
		game.History.OriginalAssigment(player, role)
	}

	game.History.AssignCenter(game.rolePool[roleOrderAssigment[index]], game.rolePool[roleOrderAssigment[index+1]], game.rolePool[roleOrderAssigment[index+2]])

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
				game.History.LearnAboutCenterCards(singularWerewolf, 1)
			} else {
				// Assumption there are only 2 werewolfs
				game.History.LearnAboutEachother(players[0], players[1])
			}
		case Minion:
			minion := players[0]
			// Assumption only 1 minion
			werewolfs := game.GetPlayerByOriginalRole(Werewolf)
			game.History.LearnAboutPlayersRole(minion, werewolfs)
		case Mason:
			if len(players) == 2 {
				game.History.LearnAboutEachother(players[0], players[1])
			}
		case Seer:
			seer := players[0]
			game.History.SeerAction(seer)
		case Robber:
			robber := players[0]
			choosee := game.History.ChooseAndLearnAboutRole(robber)
			game.History.SwapRoles(robber, robber, choosee)
		case TroubleMaker:
			troubleMaker := players[0]
			game.History.ChooseTwoAndSwap(troubleMaker)
		case Drunk:
			drunk := players[0]
			game.History.SwapWithCenterNoLearn(drunk)
		case Insomniac:
			insomniac := players[0]
			game.History.LearnAboutSelf(insomniac)
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
	for _, player := range game.players {
		name := game.History.NominateToKill(player)

		whoNominatesWhom[player.Name] = name

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
			name := game.History.NominateToKill(player)
			nominees = append(nominees, name)
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
