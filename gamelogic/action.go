package gamelogic

import "fmt"

type Action struct {
	player Player
}

type ActionManager struct {
	game *Game
}

func (am *ActionManager) OriginalAssigment(player *Player, role Role) {
	player.OriginalAssigment(role)
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
	return fmt.Sprintf("ActionManger not implemented")
}

func (am *ActionManager) LearnAboutCenterCards(player *Player, numCardsToSee int) {
	centerNumbers := player.ChooseCenterCards(numCardsToSee)
	for _, num := range centerNumbers {
		center := am.game.Center[centerNumbers[num]]
		player.KnowsRole(center.Name, center.currentRole)
	}
}

func (am *ActionManager) SwapWithCenterNoLearn(drunk *Player) {
	centerNumbers := drunk.ChooseCenterCards(1)
	am.SwapRoles(drunk, drunk, am.game.Center[centerNumbers[0]])
}

func (am *ActionManager) LearnAboutEachother(player0 *Player, player1 *Player) {
	player0.KnowsRole(player1.Name, player1.currentRole)
	player1.KnowsRole(player0.Name, player0.currentRole)
}

func (am *ActionManager) LearnAboutPlayersRole(learner *Player, seeing []*Player) {
	for _, player := range seeing {
		learner.KnowsRole(player.Name, player.currentRole)
	}
}

func (am *ActionManager) ChooseAndLearnAboutRole(chooser *Player) *Player {
	playerNames := chooser.ChoosePlayers(am.game.PlayerNames(), 1)
	player := am.game.GetPlayerByName(playerNames[0])
	chooser.KnowsRole(playerNames[0], player.originalRole)
	return player
}

func (am *ActionManager) SwapRoles(swapper *Player, player1 *Player, player2 *Player) {
	tempRole := player1.currentRole
	player1.currentRole = player2.currentRole
	player2.currentRole = tempRole

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
	return names[0]
}
