import React, {FC, ReactNode} from 'react';
import './Checkbox.scss';

type CheckboxProps = {
  children?: ReactNode;
};
const Checkbox: FC<CheckboxProps> = props => {
  return (
    <div>
      <span className="Checkbox__row">
        <input type="checkbox" className="Checkbox__checkbox" />
        {props.children}
      </span>
    </div>
  );
};

export default Checkbox;
