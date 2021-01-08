import { clamp, path, pipe } from 'ramda';

import { NODE_CPT_PRECISION } from '@constants/node';
import PropTypes from 'prop-types';
import React from 'react';
import float from 'float';
import { getComponentTestId } from '@utils/test-utils';
import { noop } from 'lodash';
import styles from './styles.scss';

const clamp0And1 = clamp(0, 1);
const pathTargetValue = path(['target', 'value']);

const formatValue = value => float.round(clamp0And1(value), NODE_CPT_PRECISION);
const getValueAndFormat = pipe(pathTargetValue, formatValue);

const onChangeHandler = onChange => event => onChange(getValueAndFormat(event));

const InputCpt = ({ onChange, id, ...props }) => (
  <input
    className={styles.inputCpt}
    type="number"
    step="0.01"
    max="1"
    min="0"
    data-testid={getComponentTestId('InputCpt', id)}
    onChange={onChangeHandler(onChange)}
    {...props}
  />
);

InputCpt.propTypes = {
  onChange: PropTypes.func,
  id: PropTypes.string.isRequired,
};

InputCpt.defaultProps = {
  onChange: noop,
};

export default InputCpt;
