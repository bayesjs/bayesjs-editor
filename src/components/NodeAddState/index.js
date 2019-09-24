import React, { useState, useCallback } from 'react';
import Icon from 'components/Icon';
import Button from 'components/Button';
import PropTypes from 'prop-types';
import {
  pipe,
  path,
  complement,
  isEmpty,
  trim,
  both,
} from 'ramda';
import { isEnterKey } from 'utils/event';
import { bem } from 'utils/styles';
import styles from './styles.scss';

const componentClassName = bem(styles);
const isNotEmpty = complement(isEmpty);
const pathTargetValue = path(['target', 'value']);

const NodeAddState = ({ onAddState }) => {
  const [state, setState] = useState('');
  const onChange = useCallback(pipe(pathTargetValue, setState), [setState]);
  const onValidAndSave = useCallback(both(isNotEmpty, onAddState), [onAddState]);
  const onSave = useCallback(() => onValidAndSave(trim(state)) && setState(''), [state, onAddState]);
  const onKeyUp = useCallback(both(isEnterKey, onSave), [state, onAddState]);

  return (
    <div className={componentClassName}>
      <input
        className={componentClassName.element('input').toString()}
        type="text"
        placeholder="Novo estado"
        value={state}
        onChange={onChange}
        onKeyUp={onKeyUp}
      />
      <Button
        className={componentClassName.element('button').toString()}
        onClick={onSave}
        title="Adicionar Estado"
      >
        <Icon name="plus" />
      </Button>
    </div>
  );
};

NodeAddState.propTypes = {
  onAddState: PropTypes.func.isRequired,
};

export default NodeAddState;
