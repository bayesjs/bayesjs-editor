import { changeNodeCpt } from 'actions';
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

const hasNotNode = pipe(prop('node'), isNil);
const isNotEmpty = complement(isEmpty);

const enhance = compose(
  branch(hasNotNode, renderNothing),
  connectify(null, ({ node: { id } }) => ({
    onChangeNodeCpt: cpt => changeNodeCpt(id, cpt),
  })),
  withProps(({ node: { parents } }) => ({
    hasParents: isNotEmpty(parents),
  })),
  withHandlers({
    onSave: ({ onChangeNodeCpt, onRequestClose }) => (cpt) => {
      onChangeNodeCpt(cpt);
      onRequestClose();
    },
    onCancel: ({ onRequestClose }) => onRequestClose,
    onAlert: () => window.alert,
  }),
);

export default enhance;
