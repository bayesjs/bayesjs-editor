import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  equals,
  complement,
  isEmpty,
  propEq,
  any,
  path,
  pipe,
  not,
  map,
  defaultTo,
  prop,
} from 'ramda';

import { getComponentTestId } from 'utils/test-utils';
import { nodePropTypes } from 'models';
import { isEnterKey } from 'utils/event';
import Button from '../Button';
import styles from './styles.css';

const isNotEmpty = complement(isEmpty);
const getNodeDescription = pipe(prop('description'), defaultTo(''));
const pathTargetValue = path(['target', 'value']);
const onEnterKeyUp = func => event => isEnterKey(event) && func();

const hasNodeWithName = (nodes, name) => any(propEq('id', name), nodes);
const isValidNodeName = (nodes, name) => isNotEmpty(name) && not(hasNodeWithName(nodes, name));

const onChangeHandler = setValue => pipe(pathTargetValue, setValue);
const executeFunctions = (...functions) => map(func => func(), functions);

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
  const hasNoChanges = equals(id, name) && equals(nodeDescription, description);
  const onSaveNodeName = () => isValidNodeName(nodes, name) && onChangeNodeName(node, name);
  const onSaveNodedescription = () => onChangeNodeDescription(node, description);
  const onSaveAll = () => executeFunctions(onSaveNodedescription, onSaveNodeName);
  const onEditStates = () => onEditNodeStates(node);
  const onEditCpt = () => onEditNodeCpt(node);

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
