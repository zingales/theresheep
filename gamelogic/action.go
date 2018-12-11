package gamelogic

import "fmt"

type Action struct {
	player Player
}

type ActionManager struct {
}

func (am *ActionManager) AddOriginalRoleAssignment(playerName string, role Role) {

}

func (am *ActionManager) AssignCenter(role0 Role, role1 Role, role2 Role) {

}

func (am *ActionManager) String() string {
	return fmt.Sprintf("ActionManger not implemented")
}

func (am *ActionManager) RoleSwap(name1 string, role1 Role, name2 string, role2 Role) {

}
