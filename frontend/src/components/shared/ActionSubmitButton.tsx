import React, { FC } from 'react';
import { ActionPrompt } from 'types';
import { Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

type Props = {
  onClick: () => void;
  actionPrompt: ActionPrompt;
};
const ActionSubmitButton: FC<Props> = (props) => {
  const { onClick, actionPrompt } = props;
  const disabled = actionPrompt === '';
  return (
    <span>
      <Button onClick={onClick} disabled={disabled}>
        {disabled ? 'Waiting' : 'Submit'}
        {disabled && <CircularProgress />}
      </Button>
    </span>
  );
};

export default ActionSubmitButton;
