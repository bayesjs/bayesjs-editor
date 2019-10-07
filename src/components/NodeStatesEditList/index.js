import React from 'react';
import NodeStateEdit from 'components/NodeStateEdit';
import PropTypes from 'prop-types';
import { statePropTypes } from 'models';
import { bem } from 'utils/styles';
import styles from './styles.scss';

const componentClassName = bem(styles);

const NodeStatesEditList = ({ states, onDeleteState }) => (
  <ul className={componentClassName}>
    {states.map((state, index) => (
      <NodeStateEdit
        key={state}
        state={state}
        index={index}
        onDeleteState={onDeleteState}
      />
    ))}
  </ul>
);

NodeStatesEditList.propTypes = {
  states: PropTypes.arrayOf(statePropTypes).isRequired,
  onDeleteState: PropTypes.func.isRequired,
};

export default NodeStatesEditList;
