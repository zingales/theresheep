package main

import (
	"fmt"
	"log"
	"strconv"

	"github.com/zingales/theresheep/gamelogic"
)

func main() {
	// Required, otherwise the games "random" order is the same after each refresh
	// rand.Seed(time.Now().UTC().UnixNano())

	game, err := gamelogic.CreateGame("Game1")
	if err != nil {
		log.Fatal(err)
	}

	// create a game with this number of players
	var num int = 11
	{
		for i := 0; i < num; i++ {
			game.AddPlayer(gamelogic.CreatePlayer("Player"+strconv.Itoa(i), &gamelogic.ConsoleUserInput{}))
		}

	}

	{
		roles := []gamelogic.Role{
			gamelogic.Villager,
			gamelogic.Villager,
			gamelogic.Villager,
			gamelogic.Werewolf,
			gamelogic.Tanner,
			gamelogic.TroubleMaker,
			gamelogic.Robber,
			gamelogic.Drunk,
			gamelogic.Mason,
			gamelogic.Mason,
			gamelogic.Hunter,
			gamelogic.Seer,
			gamelogic.Minion,
			gamelogic.Insomniac,
		}
		game.AssignRolePool(roles)

	}

	if err := game.Start(); err != nil {
		log.Fatal(err)
	}

	fmt.Println(game)

	game.ExecuteNight()

	fmt.Println(game)

	game.EndGame()
}
