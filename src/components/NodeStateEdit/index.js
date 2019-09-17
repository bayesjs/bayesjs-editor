import React from 'react';

import Button from 'components/Button';
import Icon from 'components/Icon';
import PropTypes from 'prop-types';
import { bem } from 'utils/styles';
import styles from './styles.scss';

const componentClassName = bem(styles);

const NodeStateEdit = ({ state, index, onDeleteState }) => {
  const onClick = () => onDeleteState({ state, index });

  return (
    <li className={componentClassName}>
      <span title={state}>{state}</span>
      <Button
        className={componentClassName.element('button').toString()}
        onClick={onClick}
        title="Remover Estado"
        name="removeState"
      >
        <Icon name="trash" />
      </Button>
    </li>
  );
};

NodeStateEdit.propTypes = {
  state: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  onDeleteState: PropTypes.func.isRequired,
};

export default NodeStateEdit;
