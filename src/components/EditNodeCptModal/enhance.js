import { connectify } from 'decorators';
import {
  branch,
  compose,
  renderNothing,
  withProps,
  withHandlers,
} from 'recompose';
import {
  isNil,
  prop,
  pipe,
  isEmpty,
  complement,
} from 'ramda';
import { getEditingNodeCpt } from 'selectors/editing-node-cpt';
import { onCancelEditingNodeCpt, onSaveEditingNodeCpt } from 'actions/editing-node-cpt';

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
