import {
  complement,
  isNil,
  lensPath,
  set,
  toString,
} from 'ramda';
import { cptWithParentsPropTypes, cptWithoutParentsPropTypes, statePropTypes } from '@models';

import EditNodeCptTableRow from '@components/EditNodeCptTableRow';
import NodeCptStatesThead from '@components/NodeCptStatesThead';
import PropTypes from 'prop-types';
import React from 'react';

const isNotNil = complement(isNil);

const updateCptValue = (currentCpt, newCpt, cptIndex) => {
  if (isNotNil(cptIndex)) {
    return set(lensPath([cptIndex, 'then']), newCpt, currentCpt);
  }
  return newCpt;
};

const onHandleChange = (cpt, onChange, cptIndex) => newCpt =>
  onChange(updateCptValue(cpt, newCpt, cptIndex));

const NodeCptEditTable = ({
  hasParents,
  cpt,
  states,
  onChange,
  onKeyUp,
}) => (
  <table>
    <NodeCptStatesThead states={states} />
    <tbody>
      {
        hasParents
          ? cpt.map(({ when, then }, cptIndex) => (
            <EditNodeCptTableRow
              key={toString(when)}
              cptObject={then}
              onChange={onHandleChange(cpt, onChange, cptIndex)}
              onKeyUp={onKeyUp}
            />
          )) : (
            <EditNodeCptTableRow
              cptObject={cpt}
              onChange={onHandleChange(cpt, onChange)}
              onKeyUp={onKeyUp}
            />
          )
      }
    </tbody>
  </table>
);

NodeCptEditTable.propTypes = {
  hasParents: PropTypes.bool.isRequired,
  cpt: PropTypes.oneOfType([cptWithoutParentsPropTypes, cptWithParentsPropTypes]).isRequired,
  states: PropTypes.arrayOf(statePropTypes).isRequired,
  onChange: PropTypes.func.isRequired,
  onKeyUp: PropTypes.func.isRequired,
};

export default NodeCptEditTable;
