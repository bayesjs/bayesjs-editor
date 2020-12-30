import {
  branch,
  compose,
  renderNothing,
  withHandlers,
} from 'recompose';
import {
  isNil,
  pipe,
  prop,
} from 'ramda';
import { onCancelEditingNodeStates, onSaveEditingNodeStates } from '@actions/editing-node-states';

import { connectify } from '@decorators';
import { getEditingNodeStates } from '@selectors/editing-node-states';
import { getNodes } from '@selectors';

const hasNotNode = pipe(prop('node'), isNil);

const enhance = compose(
  connectify({
    node: getEditingNodeStates,
    nodes: getNodes,
  }, {
    onSaveNodeStates: onSaveEditingNodeStates,
    onCancel: onCancelEditingNodeStates,
  }),
  branch(hasNotNode, renderNothing),
  withHandlers({
    onSave: ({ onSaveNodeStates, nodes }) => (id, states) => onSaveNodeStates(id, states, nodes),
    onAlert: () => window.alert,
  }),
);

export default enhance;
