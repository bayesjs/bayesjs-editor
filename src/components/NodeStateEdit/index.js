import Button from '@components/Button';
import Icon from '@components/Icon';
import PropTypes from 'prop-types';
import React from 'react';
import { bem } from '@utils/styles';
import { getComponentTestId } from '@utils/test-utils';
import styles from './styles.scss';

const componentClassName = bem(styles);

const NodeStateEdit = ({ state, index, onDeleteState }) => {
  const onClick = () => onDeleteState({ state, index });

  return (
    <li className={componentClassName} data-testid={getComponentTestId('NodeStateEdit', state)}>
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
