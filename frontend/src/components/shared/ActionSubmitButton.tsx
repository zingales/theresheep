import React, { FC } from 'react';
import { ActionPrompt } from 'types';
import { Button } from '@material-ui/core';
import './ActionSubmitButton.scss';
import Elipsis from 'components/shared/Elipsis';

type Props = {
  onClick: () => void;
  actionPrompt: ActionPrompt;
};
const ActionSubmitButton: FC<Props> = (props) => {
  const { onClick, actionPrompt } = props;
  const disabled = actionPrompt === '';
  return (
    <span className="ActionSubmitButton">
      <Button
        className="ActionSubmit__button"
        variant="contained"
        onClick={onClick}
        disabled={disabled}
      >
        Submit
      </Button>
      {disabled && (
        <span className="ActionSubmitButton__prompt">
          It's not your turn yet <Elipsis />
        </span>
      )}
    </span>
  );
};

export default ActionSubmitButton;
