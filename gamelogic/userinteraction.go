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
	Prompt() string
	ReceiveMessage(msgType string, msgBody interface{}) error
	GetType() string
}

type RandomUserInput struct{}

const RandomUserInputType string = "RandomUserInput"

func (input *RandomUserInput) GetType() string {
	return RandomUserInputType
}

func (input *RandomUserInput) ChooseCenterCard(additionalInfo string) int {
	choice := rand.Intn(2)
	log.Printf("ranomly choosing center card %d", choice)
	return choice
}

func (input *RandomUserInput) DoesChoosePlayerInsteadOfCenter(additionalInfo string) bool {
	choice := rand.Intn(1) == 0
	log.Printf("ranomly choose player or center %b", choice)
	return choice
}

func (input *RandomUserInput) ChoosePlayer(additionalInfo string, playerNames []string) string {
	num := rand.Intn(len(playerNames))
	log.Printf("randomly choosing player %d", num)
	return playerNames[num]
}

func (input *RandomUserInput) Prompt() string {
	return ""
}

func (input *RandomUserInput) ReceiveMessage(msgType string, msgBody interface{}) error {
	return nil
}

type ConsoleUserInput struct{}

const ConsoleUserInputType string = "ConsoleUserInput"

func (input *ConsoleUserInput) GetType() string {
	return ConsoleUserInputType
}

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

func (input *ConsoleUserInput) Prompt() string {
	return ""
}

func (input *ConsoleUserInput) ReceiveMessage(msgType string, msgBody interface{}) error {
	return nil
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
