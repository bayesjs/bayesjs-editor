import React from 'react';
import { toString } from 'ramda';
import { nodePropTypes } from 'models';
import CptStatesThead from 'components/CptStatesThead';

const CptParentStatesTable = ({ node: { parents, cpt } }) => (
  <table>
    <CptStatesThead states={parents} />
    <tbody>
      {cpt.map(({ when }) => (
        <tr key={toString(when)}>
          {parents.map(parent => (
            <td key={parent}>{when[parent]}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

CptParentStatesTable.propTypes = {
  node: nodePropTypes.isRequired,
};

export default CptParentStatesTable;
