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
	log.Printf("Yo")
	game, err := gamelogic.CreateGame("Game1")
	if err != nil {
		log.Fatal(err)
	}

	// add players to game
	{
		text, err := readFromConsole("how many players? ")
		if err != nil {
			log.Fatal(err)
		}

		num, err := strconv.Atoi(text)
		if err != nil {
			log.Fatal(err)
		}

		for i := 0; i < num; i++ {
			game.AddPlayer(gamelogic.CreatePlayer("Player" + strconv.Itoa(i)))
		}

		log.Printf("%i", num)
	}

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
