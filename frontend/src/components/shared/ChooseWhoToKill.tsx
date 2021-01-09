import React, { FC, useState } from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { nominateToKill } from 'api';
import { useParams } from 'react-router-dom';
// import CheckIcon from '@material-ui/icons/Check';

// If all the werewolves are in the "center". The only way team vilalger can win is if they choose to "kill" the werewovles in the center
const noWerewolfsString = 'NoWerewolfs';

type ChooseWhoToKillProps = {
  playerNames: string[];
};
const ChooseWhoToKill: FC<ChooseWhoToKillProps> = (props) => {
  const { playerNames } = props;
  const [chosenPlayer, setChosenPlayer] = useState<string>('');

  const killOptions = [...playerNames, noWerewolfsString];

  const { gameId, playerId } = useParams<{
    gameId: string;
    playerId: string;
  }>();
  if (gameId === undefined || playerId === undefined) {
    return null;
  }

  const handleChange = async (
    event: React.ChangeEvent<{ name?: string | undefined; value: unknown }>,
  ) => {
    // strongly dislke this cast. SO told me to do it https://stackoverflow.com/questions/58675993/typescript-react-select-onchange-handler-type-error
    const chosenPlayer = event.target.value as string;
    setChosenPlayer(chosenPlayer);
    console.log(chosenPlayer);
    await nominateToKill(gameId, playerId, chosenPlayer);
  };
  return (
    <FormControl>
      <InputLabel id="demo-simple-select-label">Choose who to kill</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={chosenPlayer}
        onChange={handleChange}
      >
        {killOptions.map((playerName) => (
          <MenuItem value={playerName}>{playerName}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ChooseWhoToKill;
