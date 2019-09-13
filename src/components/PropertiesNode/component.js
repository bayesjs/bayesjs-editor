import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  equals,
  complement,
  isEmpty,
  propEq,
  path,
  pipe,
  defaultTo,
  prop,
  both,
  not,
  none,
} from 'ramda';

import { getComponentTestId } from 'utils/test-utils';
import { nodePropTypes } from 'models';
import { isEnterKey } from 'utils/event';
import Button from '../Button';
import styles from './styles.css';

const isNotEmpty = complement(isEmpty);
const isNotEquals = complement(equals);
const getNodeDescription = pipe(prop('description'), defaultTo(''));
const pathTargetValue = path(['target', 'value']);
const onEnterKeyUp = func => event => isEnterKey(event) && func();

const hasNoNodeWithThisName = (name, nodes) => none(propEq('id', name), nodes);
const isValidNodeName = both(isNotEmpty, hasNoNodeWithThisName);

const onChangeHandler = setValue => pipe(pathTargetValue, setValue);

const PropertiesNode = ({
  onEditNodeStates,
  onEditNodeCpt,
  onChangeNodeName,
  onChangeNodeDescription,
  nodes,
  node,
}) => {
  const { id } = node;
  const nodeDescription = getNodeDescription(node);
  const [name, setName] = useState(id);
  const [description, setDescription] = useState(nodeDescription);
  const isNodeIdChanged = isNotEquals(id, name);
  const isNodeDescriptionChanged = isNotEquals(nodeDescription, description);
  const hasNoChanges = not(isNodeIdChanged) && not(isNodeDescriptionChanged);
  const onSaveNodeName = useCallback(
    () => isValidNodeName(name, nodes) && onChangeNodeName(node, name),
    [name, node, nodes],
  );
  const onSaveNodedescription = useCallback(
    () => onChangeNodeDescription(node, description),
    [node, description],
  );
  const onEditStates = useCallback(() => onEditNodeStates(node), [node]);
  const onEditCpt = useCallback(() => onEditNodeCpt(node), [node]);
  const onSaveAll = useCallback(() => {
    if (isNodeDescriptionChanged) onSaveNodedescription();
    if (isNodeIdChanged) onSaveNodeName();
  }, [name, description, node, nodes]);

  useEffect(() => {
    setName(id);
    setDescription(nodeDescription);
  }, [node]);

  return (
    <div data-testid={getComponentTestId('PropertiesNode')}>
      <h2>Propriedades da Variável</h2>

      <div className={styles.fieldWrapper}>
        <label htmlFor="name">
          Nome
          <input
            id="name"
            type="text"
            value={name}
            onChange={onChangeHandler(setName)}
            onKeyUp={onEnterKeyUp(onSaveNodeName)}
          />
        </label>
      </div>

      <div className={styles.fieldWrapper}>
        <label htmlFor="description">
          Descrição
          <textarea
            id="description"
            value={description}
            onChange={onChangeHandler(setDescription)}
          />
        </label>
      </div>

      <div className={styles.fieldWrapper}>
        <Button className={styles.button} onClick={onEditStates} name="editStates">
          Editar estados
        </Button>
      </div>

      <div className={styles.fieldWrapper}>
        <Button className={styles.button} onClick={onEditCpt} name="editProbabilities">
          Editar probabilidades
        </Button>
      </div>

      <div className={styles.fieldWrapper}>
        <Button className={styles.button} onClick={onSaveAll} name="save" disabled={hasNoChanges}>
          Salvar alterações
        </Button>
      </div>
    </div>
  );
};

PropertiesNode.propTypes = {
  node: nodePropTypes.isRequired,
  onEditNodeStates: PropTypes.func.isRequired,
  onEditNodeCpt: PropTypes.func.isRequired,
  nodes: PropTypes.arrayOf(nodePropTypes).isRequired,
  onChangeNodeDescription: PropTypes.func.isRequired,
  onChangeNodeName: PropTypes.func.isRequired,
};

export default PropertiesNode;
