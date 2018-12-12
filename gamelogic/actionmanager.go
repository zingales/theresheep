package gamelogic

import "fmt"

type ActionManager struct {
	game    *Game
	History []*Event
}

var GamePlayer *Player = &Player{Name: "GameEngine", isDummy: true}

func (am *ActionManager) AddEvent(doer *Player, action Action, affected []*PlayerRolePair) {
	am.History = append(am.History, &Event{Doer: doer, Action: action, Affected: affected})
}

func (am *ActionManager) AddEventOneAffect(doer *Player, action Action, affected *PlayerRolePair) {
	am.AddEvent(doer, action, []*PlayerRolePair{affected})
}

func (am *ActionManager) OriginalAssigment(player *Player, role Role) {
	player.OriginalAssigment(role)
	am.AddEventOneAffect(GamePlayer, OriginalAssignment, player.createPlayerRolePair())
}

func (am *ActionManager) AssignCenter(role0 Role, role1 Role, role2 Role) {
	center0 := &Player{Name: nameOfCenterCard(0), isDummy: true}
	center1 := &Player{Name: nameOfCenterCard(1), isDummy: true}
	center2 := &Player{Name: nameOfCenterCard(2), isDummy: true}

	center0.OriginalAssigment(role0)
	center1.OriginalAssigment(role1)
	center2.OriginalAssigment(role2)

	am.game.Center[0] = center0
	am.game.Center[1] = center1
	am.game.Center[2] = center2
}

func (am *ActionManager) String() string {
	return fmt.Sprintf("History: %v", am.History)
}

// Tier 1 Actions do not require player input

func (am *ActionManager) SwapRoles(swapper *Player, player1 *Player, player2 *Player) {
	tempRole := player1.currentRole
	player1.currentRole = player2.currentRole
	player2.currentRole = tempRole
	am.AddEvent(swapper, SwapRoles, []*PlayerRolePair{player1.createPlayerRolePair(), player2.createPlayerRolePair()})
}

func (am *ActionManager) LearnAboutEachother(player0 *Player, player1 *Player) {
	player0.KnowsRole(player1.Name, player1.currentRole)
	player1.KnowsRole(player0.Name, player0.currentRole)
	am.AddEvent(GamePlayer, LearnRoles, []*PlayerRolePair{player0.createPlayerRolePair(), player1.createPlayerRolePair()})
}

func (am *ActionManager) LearnAboutPlayersRole(learner *Player, seeing []*Player) {
	for _, player := range seeing {
		learner.KnowsRole(player.Name, player.currentRole)
		am.AddEventOneAffect(learner, LearnRoles, player.createPlayerRolePair())
	}
}

// Tier 2 actions require player input
func (am *ActionManager) LearnAboutCenterCards(player *Player, numCardsToSee int) {
	// todo consider breaking this into a tier 1 and tier 2 action
	centerNumbers := player.ChooseCenterCards(numCardsToSee)
	for _, num := range centerNumbers {
		center := am.game.Center[num]
		player.KnowsRole(center.Name, center.currentRole)
		am.AddEventOneAffect(player, LearnRoles, center.createPlayerRolePair())
	}
}

func (am *ActionManager) SwapWithCenterNoLearn(drunk *Player) {
	centerNumbers := drunk.ChooseCenterCards(1)
	am.SwapRoles(drunk, drunk, am.game.Center[centerNumbers[0]])
}

func (am *ActionManager) ChooseAndLearnAboutRole(chooser *Player) *Player {
	playerNames := chooser.ChoosePlayers(am.game.PlayerNames(), 1)
	player := am.game.GetPlayerByName(playerNames[0])
	chooser.KnowsRole(playerNames[0], player.originalRole)
	am.AddEventOneAffect(chooser, LearnRoles, player.createPlayerRolePair())
	return player
}

func (am *ActionManager) SeerAction(seer *Player) {
	if seer.DoesChoosePlayerInsteadOfCenter() {
		am.ChooseAndLearnAboutRole(seer)
	} else {
		am.LearnAboutCenterCards(seer, 2)
	}
}

func (am *ActionManager) ChooseTwoAndSwap(troubleMaker *Player) {
	playerNames := troubleMaker.ChoosePlayers(am.game.PlayerNames(), 2)
	player1 := am.game.GetPlayerByName(playerNames[0])
	player2 := am.game.GetPlayerByName(playerNames[1])
	am.SwapRoles(troubleMaker, player1, player2)
}

func (am *ActionManager) LearnAboutSelf(insomniac *Player) {
	insomniac.KnowsRole(insomniac.Name, insomniac.currentRole)
	am.AddEventOneAffect(insomniac, LearnRoles, insomniac.createPlayerRolePair())
}

func (am *ActionManager) NominateToKill(player *Player) string {
	playerNames := am.game.PlayerNames()

	for i := 0; i < len(playerNames); i++ {
		// you can't choose to kill yourself. But you can choose that there are no werewolfs in game
		if playerNames[i] == player.Name {
			playerNames[i] = NoWereWolfs
			break
		}
	}

	names := player.ChoosePlayers(playerNames, 1)
	am.AddEventOneAffect(player, NominatesToKill, &PlayerRolePair{Name: names[0], Role: -1})
	return names[0]
}
