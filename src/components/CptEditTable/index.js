import React from 'react';
import EditCptTableRow from 'components/EditCptTableRow';
import {
  set,
  toString,
  complement,
  isNil,
  lensPath,
} from 'ramda';
import PropTypes from 'prop-types';
import { statePropTypes, cptWithoutParentsPropTypes, cptWithParentsPropTypes } from 'models';
import CptStatesThead from 'components/CptStatesThead';

const isNotNil = complement(isNil);

const updateCptValue = (currentCpt, newCpt, cptIndex) => {
  if (isNotNil(cptIndex)) {
    return set(lensPath([cptIndex, 'then']), newCpt, currentCpt);
  }
  return newCpt;
};

const onHandleChange = (cpt, onChange, cptIndex) => newCpt =>
  onChange(updateCptValue(cpt, newCpt, cptIndex));

const CptEditTable = ({
  hasParents,
  cpt,
  states,
  onChange,
  onKeyUp,
}) => (
  <table>
    <CptStatesThead states={states} />
    <tbody>
      {
        hasParents
          ? cpt.map(({ when, then }, cptIndex) => (
            <EditCptTableRow
              key={toString(when)}
              cptObject={then}
              onChange={onHandleChange(cpt, onChange, cptIndex)}
              onKeyUp={onKeyUp}
            />
          )) : (
            <EditCptTableRow
              cptObject={cpt}
              onChange={onHandleChange(cpt, onChange)}
              onKeyUp={onKeyUp}
            />
          )
      }
    </tbody>
  </table>
);

CptEditTable.propTypes = {
  hasParents: PropTypes.bool.isRequired,
  cpt: PropTypes.oneOfType([cptWithoutParentsPropTypes, cptWithParentsPropTypes]).isRequired,
  states: PropTypes.arrayOf(statePropTypes).isRequired,
  onChange: PropTypes.func.isRequired,
  onKeyUp: PropTypes.func.isRequired,
};

export default CptEditTable;
