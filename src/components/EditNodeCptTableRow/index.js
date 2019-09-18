import React, { useMemo } from 'react';
import { NODE_CPT_PRECISION } from 'constants/node';
import float from 'float';
import InputCpt from 'components/InputCpt';
import PropTypes from 'prop-types';
import {
  keys,
  pipe,
  find,
  equals,
  complement,
  reduce,
  length,
} from 'ramda';
import { noop } from 'lodash';
import { cptWithoutParentsPropTypes } from 'models';
import { updateCptValue } from 'utils/node-cpt';
import { isNodeCptValid } from 'validations/node';
import classNames from 'classnames';
import styles from './styles.scss';

const isLengthEqualsTwo = pipe(length, equals(2));
const notEquals = complement(equals);

const getRestFromValue = valueFloat => float.round((1 - valueFloat), NODE_CPT_PRECISION);
const getOtherState = (states, currentState) => find(notEquals(currentState), states);

const updateCpt = (cptObject, updateCptValues) =>
  reduce((acc, values) => updateCptValue(acc, ...values), cptObject, updateCptValues);

const onChangeHandler = ({
  state,
  states,
  cptObject,
  onChange,
}) => (value) => {
  const hasTwoStates = isLengthEqualsTwo(states);
  const updateCptValues = [
    [value, state],
    ...(
      hasTwoStates
        ? [[getRestFromValue(value), getOtherState(states, state)]]
        : []
    ),
  ];

  onChange(updateCpt(cptObject, updateCptValues));
};

const EditNodeCptTableRow = ({ cptObject, onKeyUp, ...props }) => {
  const states = useMemo(() => keys(cptObject), [cptObject]);
  const isValid = useMemo(() => isNodeCptValid(cptObject), [cptObject]);

  return (
    <tr className={classNames({ [styles.invalidRow]: !isValid })}>
      {states.map(state => (
        <td key={state}>
          <InputCpt
            id={state}
            value={cptObject[state]}
            onChange={onChangeHandler({
              state,
              states,
              cptObject,
              ...props,
            })}
            onKeyUp={onKeyUp}
          />
        </td>
      ))}
    </tr>
  );
};

EditNodeCptTableRow.propTypes = {
  cptObject: PropTypes.oneOfType([cptWithoutParentsPropTypes]).isRequired,
  onKeyUp: PropTypes.func,
  onChange: PropTypes.func,
};

EditNodeCptTableRow.defaultProps = {
  onKeyUp: noop,
  onChange: noop,
};

export default EditNodeCptTableRow;
