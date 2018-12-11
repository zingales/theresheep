package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
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
		// text, err := readFromConsole("how many players? ")
		// if err != nil {
		// 	log.Fatal(err)
		// }

		// num, err := strconv.Atoi(text)
		// if err != nil {
		// 	log.Fatal(err)
		// }

		for i := 0; i < num; i++ {
			game.AddPlayer(gamelogic.CreatePlayer("Player" + strconv.Itoa(i)))
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
}

func readFromConsole(prompt string) (string, error) {
	reader := bufio.NewReader(os.Stdin)
	fmt.Print(prompt)
	text, err := reader.ReadString('\n')
	if err != nil {
		return "", err
	}
	return text[:len(text)-1], nil
}
