package gamelogic

type Role int

const (
	Unassigned Role = iota
	Villager
	Werewolf
	Seer
	Robber
	TroubleMaker
	Tanner
	Drunk
	Hunter
	Mason
	Insomniac
	Minion
	DobbleGanger
)

func (role Role) String() string {
	// declare an array of strings
	// ... operator counts how many
	// items in the array (7)
	names := [...]string{
		"Unassigned",
		"Villager",
		"Werewolf",
		"Seer",
		"Robber",
		"TroubleMaker",
		"Tanner",
		"Drunk",
		"Hunter",
		"Mason",
		"Insomniac",
		"Minion",
		"DobbleGanger"}

	if role < 0 || role > DobbleGanger {
		return "Unknown"
	}

	return names[role]
}
