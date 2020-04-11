package backend

import (
    // "fmt"
    // "net/http"
    // "sync"
    // "log"
    // "strings"
    // "strconv"
    // "errors"
    //
    // "github.com/zingales/theresheep/gamelogic"
)

type ChannelUserInput struct{
  info chan int
}

func (input *ChannelUserInput) ChooseCenterCard(string) int {
  return 1
}

func (input *ChannelUserInput) ChoosePlayer(string, []string) string{
  return ""
}

func (input *ChannelUserInput) DoesChoosePlayerInsteadOfCenter(string) bool {
  return false
}
