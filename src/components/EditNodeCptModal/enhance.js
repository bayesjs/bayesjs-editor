import {
  branch,
  compose,
  renderNothing,
  withHandlers,
  withProps,
} from 'recompose';
import {
  complement,
  isEmpty,
  isNil,
  pipe,
  prop,
} from 'ramda';
import { onCancelEditingNodeCpt, onSaveEditingNodeCpt } from '@actions/editing-node-cpt';

import { connectify } from '@decorators';
import { getEditingNodeCpt } from '@selectors/editing-node-cpt';

const hasNotNode = pipe(prop('node'), isNil);
const isNotEmpty = complement(isEmpty);

const enhance = compose(
  connectify({
    node: getEditingNodeCpt,
  }, {
    onSave: onSaveEditingNodeCpt,
    onCancel: onCancelEditingNodeCpt,
  }),
  branch(hasNotNode, renderNothing),
  withProps(({ node: { parents } }) => ({
    hasParents: isNotEmpty(parents),
  })),
  withHandlers({
    onAlert: () => window.alert,
  }),
);

export default enhance;
