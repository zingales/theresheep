package gamelogic

import (
	"errors"
	"fmt"
	"log"
	"math/rand"
	"strconv"
)

var InvalidNumberOfPlayersError = errors.New("There is an invalid number of players in this game")
var CouldNotFindPlayer = errors.New("There was no player by that filter found in this game")
var GameInProgressError = errors.New("Action Cannot Be complete while a game is in progress")

type Game struct {
	Id            string
	players       []*Player
	rolePool      []Role
	actionManager *ActionManager
	Center        [3]*Player
	inProgress    bool
}

func CreateGame(id string) (*Game, error) {
	game := &Game{Id: id}
	game.players = make([]*Player, 0)
	game.actionManager = &ActionManager{game: game, History: make([]*Event, 0)}
	game.inProgress = false
	return game, nil
}

func (game *Game) String() string {
	return fmt.Sprintf("Id: %s\n players %v\n avalibleRoles: %v\n actionManager: %v\n Center: %v", game.Id, game.players, game.rolePool, game.actionManager, game.Center)
}

func (game *Game) AddPlayer(player *Player) (int, error) {
	if game.inProgress {
		return 0, GameInProgressError
	}
	if player.input == nil || player.isDummy {
		log.Fatal("actual players need to have input device")
	}

	if player.Name == "" {
		log.Fatal("user name cannot be empty string")
	}

	// validate no two players have the same name
	game.players = append(game.players, player)
	return len(game.players) - 1, nil
}

func (game *Game) AssignRolePool(roles []Role) error {
	if game.inProgress {
		return GameInProgressError
	}
	if err := validateRolePool(roles); err != nil {
		return err
	}

	game.rolePool = roles

	return nil
}

func (game *Game) Start() error {
	if game.inProgress {
		return GameInProgressError
	}
	if len(game.players) < 3 {
		return InvalidNumberOfPlayersError
	}

	if len(game.rolePool) != len(game.players)+3 {
		return InvalidNumberOfRolesError
	}

	game.inProgress = true

	var roleOrderAssigment []int
	if os.Getenv("DEBUG_ROLE_ORDER") == "" {
		roleOrderAssigment = rand.Perm(len(game.rolePool))
	} else {
		roleOrderStrArray := strings.Split(os.Getenv("DEBUG_ROLE_ORDER"), ",")
		roleOrderAssigment = utils.MustStrArrToint(roleOrderStrArray)
	}

	fmt.Printf("Random Role Order %v\n", roleOrderAssigment)
	index := 0
	for ; index < len(game.players); index++ {
		player := game.players[index]
		role := game.rolePool[roleOrderAssigment[index]]
		game.actionManager.OriginalAssigment(player, role)
	}

	game.actionManager.AssignCenter(game.rolePool[roleOrderAssigment[index]], game.rolePool[roleOrderAssigment[index+1]], game.rolePool[roleOrderAssigment[index+2]])

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

func (game *Game) GetPlayerById(id int) (*Player, error) {
	if id < 0 || id > len(game.players)-1 {
		return nil, CouldNotFindPlayer
	}

	return game.players[id], nil
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
				game.actionManager.LearnAboutCenterCards(singularWerewolf, 1)
			} else {
				// Assumption there are only 2 werewolfs
				game.actionManager.LearnAboutEachother(players[0], players[1])
			}
		case Minion:
			minion := players[0]
			// Assumption only 1 minion
			werewolfs := game.GetPlayerByOriginalRole(Werewolf)
			game.actionManager.LearnAboutPlayersRole(minion, werewolfs)
		case Mason:
			if len(players) == 2 {
				game.actionManager.LearnAboutEachother(players[0], players[1])
			}
		case Seer:
			seer := players[0]
			game.actionManager.SeerAction(seer)
		case Robber:
			robber := players[0]
			choosee := game.actionManager.ChooseAndLearnAboutRole(robber)
			game.actionManager.SwapRoles(robber, robber, choosee)
		case TroubleMaker:
			troubleMaker := players[0]
			game.actionManager.ChooseTwoAndSwap(troubleMaker)
		case Drunk:
			drunk := players[0]
			game.actionManager.SwapWithCenterNoLearn(drunk)
		case Insomniac:
			insomniac := players[0]
			game.actionManager.LearnAboutSelf(insomniac)
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
		name := game.actionManager.NominateToKill(player)

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
			name := game.actionManager.NominateToKill(player)
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
