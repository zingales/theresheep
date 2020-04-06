export type Role = 'werewolf' | 'villager' | 'seer';
export type Action =
  | 'choose who to kill'
  | 'choose center card'
  | 'swap role'
  | 'seer action';

type PlayerId = number;

// Information to be revealed to each player when the game is over.
export type GameOverState = {
  winningTeam: 'werewolf' | 'villager' | 'tanner';
  assasinatedPerson: PlayerId;
  playerToRole: Map<PlayerId, Role>;
  playerToChosenKill: Map<PlayerId, PlayerId>;
  centerCards: Role[];
};

export type BackendState = {
  timer: number;
  playerIdToName: Map<PlayerId, string>;
  originalRole: Role;
  newRole?: Role;
  pendingAction: Action | null;
  gameOver?: GameOverState;
};
