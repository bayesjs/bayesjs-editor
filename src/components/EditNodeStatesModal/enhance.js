import { changeNodeStates } from 'actions';
import {
  compose,
  branch,
  renderNothing,
  withHandlers,
} from 'recompose';
import {
  isNil,
  pipe,
  prop,
} from 'ramda';
import { connectify } from 'decorators';

const hasNotNode = pipe(prop('node'), isNil);

const enhance = compose(
  branch(hasNotNode, renderNothing),
  connectify(null, ({ node: { id } }) => ({
    onChangeNodeStates: states => changeNodeStates(id, states),
  })),
  withHandlers({
    onSave: ({ onChangeNodeStates, onRequestClose }) => (states) => {
      onChangeNodeStates(states);
      onRequestClose();
    },
    onCancel: ({ onRequestClose }) => onRequestClose,
    onAlert: () => window.alert,
  }),
);

export default enhance;
