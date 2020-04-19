package backend

import (
	"errors"
	"fmt"
	"sync"

	"github.com/zingales/theresheep/utils"
)

// The game engine calls ChooseCenterCard(), ChoosePlayer() or
// DoesChoosePlayerInsteadOfCenter(). These methods are request for input.
// These methods set BrowserUserInput.expecting to indicate that the game
// engine is expecting a message of the corresponding message type. When the
// user polls, he will see that the game engine is expecting the corresponding
// message type from him and fill the message chan.
//
// I find the mix of locks and channels a bit confusing. The lock is necessary
// to protect the "expecting" state. "expecting" needs to be state instead of a
// channel/message because the browser may poll multiple times. If "expecting"
// were a message in a channel it would be "used up" on the first poll.
// Consider an alternate architecture where each player has its own goroutine
// and instead of protecting the expecting state with a lock the game engine
// sends a message to the relevant player's goroutine that it's expecting a
// message.

// Message types
const ChooseCenterCardMsgType string = "choose-center-card"
const ChoosePlayerMsgType string = "choose-player"
const ChoosePlayerInsteadOfCenterMsgType string = "choose-player-instead-of-center"

type BrowserUserInput struct {
	// lock protects the expecting variable. So that writes to the
	// variable are read atomically
	lock sync.RWMutex

	// message takes a message from goroutine for the user request and
	// gives it to the game engine
	message chan interface{}

	// expecting is the type of message the game engine is expecting from this
	// player right now, or "" if the game engine is not expecting a
	// message from this player
	expecting string
}

func NewBrowserUserInput() *BrowserUserInput {
	return &BrowserUserInput{
		message: make(chan interface{}, 0),
	}
}

func (input *BrowserUserInput) ChooseCenterCard(string) int {
	input.lock.Lock()
	input.expecting = ChooseCenterCardMsgType
	input.lock.Unlock()

	card := <-input.message
	input.expecting = ""
	return card.(int)
}

func (input *BrowserUserInput) ChoosePlayer(string, []string) string {
	input.lock.Lock()
	input.expecting = ChoosePlayerMsgType
	input.lock.Unlock()

	player := <-input.message
	input.expecting = ""
	return player.(string)
}

func (input *BrowserUserInput) DoesChoosePlayerInsteadOfCenter(string) bool {
	input.lock.Lock()
	input.expecting = ChoosePlayerInsteadOfCenterMsgType
	input.lock.Unlock()

	choice := <-input.message
	input.expecting = ""
	return choice.(bool)
}

func (input *BrowserUserInput) Prompt() string {
	input.lock.RLock()
	defer input.lock.RUnlock()
	return input.expecting
}

func (input *BrowserUserInput) ReceiveMessage(msgType string, msgBody interface{}) error {
	input.lock.RLock()
	defer input.lock.RUnlock()

	_, msgIsInt := msgBody.(int)
	_, msgIsBool := msgBody.(bool)
	_, msgIsString := msgBody.(string)

	isKnonwMessage := utils.Contains(
		[]string{
			ChooseCenterCardMsgType,
			ChoosePlayerMsgType,
			ChoosePlayerInsteadOfCenterMsgType,
		}, msgType)
	if input.expecting == "" {
		return errors.New(fmt.Sprintf("Game engine is not expecting input " +
			"from this player"))
	} else if msgType != input.expecting {
		return errors.New(fmt.Sprintf(
			"Received message of type \"%s\". Expected message of "+
				"type \"%s\"", msgType, input.expecting))
	} else if msgType == ChooseCenterCardMsgType && !msgIsInt {
		return errors.New(fmt.Sprintf(
			"Message body for ChooseCenterCardMsgType should be <int>. "+
				"Received %x", msgBody))
	} else if msgType == ChoosePlayerMsgType && !msgIsString {
		return errors.New(fmt.Sprintf(
			"Message body for ChoosePlayerMsgType should be <string>. "+
				"Received %x", msgBody))
	} else if msgType == ChoosePlayerInsteadOfCenterMsgType && !msgIsBool {
		return errors.New(fmt.Sprintf(
			"Message body for ChoosePlayerInsteadOfCenterMsgType "+
				" should be <bool>. Received %x", msgBody))
	} else if !isKnonwMessage {
		return errors.New(fmt.Sprintf("Unknown message type \"%s\"", msgType))
	}
	select {
	case input.message <- msgBody:
		return nil
	default:
		// This error should never happen in practice. Only using the
		// select for paranoia's sake so i don't do something blocking
		// while holding a lock. We should have a gurauntee here that
		// something is listening on the other end because we've
		// validated that "expecting" is non empty. If this error
		// occurs it indicates that something was coded up incorrectly.
		return errors.New(
			fmt.Sprintf("cannot send message to message chan. " +
				"Chan is full"))
	}
}
