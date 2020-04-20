package backend

import (
	"errors"
	"fmt"
	"sync"

	"github.com/zingales/theresheep/utils"
)

// BrowserUserInput is how the game engine pulls information from the browser.
// It maintains one interface to GameEngine, and one to the Server.
//
// GameEngine:
//     To the game engine, BrowserUserInput is how the game engine pulls
//     information from the browser. A pull flow might look like this
//
//     <- GameEngine.f()
//       <- Player.g()
//         <- BrowserUserInput.h()
//
//     It is BrowserUserInput's resonsibility to block until it gets the
//     appropriate information from the browser. When GameEngine pulls something
//     from BrowserUserInput, BrowserUserInput sets the state 'expecting' to the
//     the thing the GameEngine needs.
//
//
// Server:
//     BrowserUserInput can't pull something directly from the browser, because
//     we're not using websocket. Instead, browser is constantly polling.
//     Server checks on each poll if BrowserUserInput is currently being pulled
//     on by game engine (via Prompt()). When GameEngine initiates a pull
//     BrowserUserInput sets state "expecting" to be something, so when browser
//     polls it can check "expecting" and know to call do action which will
//     push info via ReceiveMessage
//     TODO: fix that last sentence.
//
//
// ** Not all information destined for the game engine goes through
// BrowserUserInput. Only information that the game engine is "pulling" from
// the browser. I.e. a flow that the game engine initiates (e.g. the game
// engine decides that the seer needs to see a card, so it initiates the
// request to the browser). "Push flows" do not go through BrowserUserInput.
// E.g. the browser initiates when to decide who to kill. That "push flow"
// doesn't need to go through BrowserUserInput, the player object handles that
// directly. The seperation is useful because for pull flows it's nice to have
// a channel that the game engine can pull on (BrowserUserInput.message). For
// push flows, where nothing needs to block, the browser can just set state
// directly on Player protected with a lock

// Message types
const ChooseCenterCardMsgType string = "choose-center-card"
const ChoosePlayerMsgType string = "choose-player"
const ChoosePlayerInsteadOfCenterMsgType string = "choose-player-instead-of-center"

type BrowserUserInput struct {

	// message takes a message from goroutine for the user request and
	// gives it to the game engine
	message chan interface{}

	// lock protects the expecting variable. So that writes to the
	// variable are read atomically
	lock sync.RWMutex

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

/*****************************************************************************
 ************************ Game Engine Interface ******************************
 ****************************************************************************/

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

/*****************************************************************************
 **************************** Server Interface *******************************
 ****************************************************************************/
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
