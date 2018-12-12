package gamelogic

import (
	"bufio"
	"fmt"
	"log"
	"math/rand"
	"os"
	"strconv"
)

type UserInput interface {
	ChooseCenterCard(string) int
	ChoosePlayer(string, []string) string
	DoesChoosePlayerInsteadOfCenter(string) bool
}

type RandomUserInput struct{}

func (input *RandomUserInput) ChooseCenterCard(additionalInfo string) int {
	return rand.Intn(2)
}

func (input *RandomUserInput) DoesChoosePlayerInsteadOfCenter(additionalInfo string) bool {
	return rand.Intn(1) == 0
}

func (input *RandomUserInput) ChoosePlayer(additionalInfo string, playerNames []string) string {
	num := rand.Intn(len(playerNames))
	return playerNames[num]
}

type ConsoleUserInput struct{}

func (input *ConsoleUserInput) ChooseCenterCard(additionalInfo string) int {
	text, err := readFromConsole(additionalInfo + " Which Center Card would you like to choose (between 0-2)? ")
	if err != nil {
		log.Fatal(err)
	}

	num, err := strconv.Atoi(text)
	if err != nil {
		log.Fatal(err)
	}

	return num
}

func (input *ConsoleUserInput) DoesChoosePlayerInsteadOfCenter(additionalInfo string) bool {
	text, err := readFromConsole("Would you like to see two center roles, or 1 person role (0 is look at center, 1 is another player)? ")
	if err != nil {
		log.Fatal(err)
	}

	num, err := strconv.Atoi(text)
	if err != nil {
		log.Fatal(err)
	}

	return num == 1
}

func (input *ConsoleUserInput) ChoosePlayer(additionalInfo string, playerNames []string) string {
	fmt.Println("Names")
	for i := 0; i < len(playerNames); i++ {
		fmt.Printf("%d: %s\n", i, playerNames[i])
	}
	text, err := readFromConsole(additionalInfo + " Choose a player by entering the coresponding number? ")
	if err != nil {
		log.Fatal(err)
	}

	num, err := strconv.Atoi(text)
	if err != nil {
		log.Fatal(err)
	}
	return playerNames[num]
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