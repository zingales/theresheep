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
	var num int = 3
	{
		for i := 0; i < num; i++ {
			game.AddPlayer(gamelogic.CreatePlayer("Player"+strconv.Itoa(i), &gamelogic.ConsoleUserInput{}))
		}

	}

	{
		roles := []gamelogic.Role{
			gamelogic.Villager,
			gamelogic.Villager,
			gamelogic.Werewolf,
			gamelogic.Werewolf,
			gamelogic.TroubleMaker,
			gamelogic.Robber,
		}
		game.AssignRolePool(roles)

	}

	game.Start()

	fmt.Println(game)

	game.ExecuteNight()

	fmt.Println(game)

	game.EndGame()
}
