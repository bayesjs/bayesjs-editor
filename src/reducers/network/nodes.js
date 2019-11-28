import {
  ADD_NODE,
  ADD_PARENT,
  CHANGE_NODE_DESCRIPTION,
  CHANGE_NODE_ID,
  LOAD_NETWORK,
  NEW_NETWORK,
  REMOVE_NODE,
  REMOVE_PARENT,
} from 'actions';
import {
  T,
  allPass,
  always,
  any,
  append,
  applySpec,
  assoc,
  complement,
  cond,
  curry,
  evolve,
  identity,
  ifElse,
  map,
  path,
  pipe,
  prop,
  propEq,
  useWith,
} from 'ramda';
import {
  addNodeParent,
  changeNodeParentName,
  filterNodeParents,
} from 'utils/node-parents';
import {
  addNodeParentInCpt,
  createCpt,
  removeNodeParentInCpt,
  updateNodeParentIdInCpt,
  updateNodeParentStatesInCpt,
  updateStatesInCpt,
} from 'utils/node-cpt';
import { findNodeById, removeNodeById } from 'utils/node';

import { SAVE_EDITING_NODE_CPT } from 'constants/editing-node-cpt';
import { SAVE_EDITING_NODE_STATES } from 'constants/editing-node-states';
import { containsParentInNode } from 'validations/node';
import { hasCycleAddingNodeParent } from 'validations/network';

const propId = prop('id');
const propStates = prop('states');
const pathPayloadCpt = path(['payload', 'cpt']);
const pathPayloadParentId = path(['payload', 'parentId']);
const pathPayloadStates = path(['payload', 'states']);
const pathPayloadNextId = path(['payload', 'nextId']);
const pathPayloadDescription = path(['payload', 'description']);
const pathPayloadStateNodes = path(['payload', 'state', 'nodes']);
const pathPayloadId = path(['payload', 'id']);
const isNodeFromPayloadId = pipe(pathPayloadId, propEq('id'));

const addParentValidation = [
  propEq('id'), // node is the parent
  containsParentInNode, // already has this parent
  useWith(hasCycleAddingNodeParent, [identity, propId, identity]), // adds cycles in network
];

const invalidParent = curry((parentId, nodes, node) =>
  any(validation => validation(parentId, node, nodes), addParentValidation));

const canAddParent = (state, action) =>
  allPass([
    isNodeFromPayloadId(action),
    complement(invalidParent(pathPayloadParentId(action), state)),
  ]);

const changeParentStates = curry((parentId, nextStates, nodes, node) =>
  evolve(
    {
      cpt: always(
        updateNodeParentStatesInCpt(parentId, nextStates, nodes, node),
      ),
    },
    node,
  ));

const changeNodeStates = curry((nextStates, node) =>
  evolve(
    {
      states: always(nextStates),
      cpt: always(updateStatesInCpt(nextStates, node)),
    },
    node,
  ));

const changeParentId = curry((previousId, nextId, node) =>
  evolve(
    {
      parents: always(changeNodeParentName(previousId, nextId, node)),
      cpt: always(updateNodeParentIdInCpt(previousId, nextId, node)),
    },
    node,
  ));

const addParent = curry((parentId, nodes, node) =>
  evolve(
    {
      parents: always(addNodeParent(parentId, node)),
      cpt: always(addNodeParentInCpt(findNodeById(parentId, nodes), node)),
    },
    node,
  ));

const removeParentFromNode = curry((parentId, nodes, node) =>
  evolve(
    {
      parents: always(filterNodeParents(parentId, node)),
      cpt: always(removeNodeParentInCpt(findNodeById(parentId, nodes), node)),
    },
    node,
  ));

const newNode = applySpec({
  id: propId,
  states: propStates,
  parents: always([]),
  cpt: pipe(propStates, createCpt),
});

export default (state = [], action) => {
  switch (action.type) {
    case NEW_NETWORK:
      return [];
    case LOAD_NETWORK:
      return pathPayloadStateNodes(action);
    case ADD_NODE:
      return append(newNode(action.payload), state);
    case REMOVE_NODE:
      return map(
        removeParentFromNode(pathPayloadId(action), state),
        removeNodeById(pathPayloadId(action), state),
      );
    case ADD_PARENT:
      return map(
        ifElse(
          canAddParent(state, action),
          addParent(pathPayloadParentId(action), state),
          identity,
        ),
        state,
      );

    case REMOVE_PARENT:
      return map(
        ifElse(
          isNodeFromPayloadId(action),
          removeParentFromNode(pathPayloadParentId(action), state),
          identity,
        ),
        state,
      );

    case SAVE_EDITING_NODE_CPT:
      return map(
        ifElse(
          isNodeFromPayloadId(action),
          assoc('cpt', pathPayloadCpt(action)),
          identity,
        ),
        state,
      );

    case CHANGE_NODE_DESCRIPTION:
      return map(
        ifElse(
          isNodeFromPayloadId(action),
          assoc('description', pathPayloadDescription(action)),
          identity,
        ),
        state,
      );

    case CHANGE_NODE_ID:
      return map(
        cond([
          [isNodeFromPayloadId(action), assoc('id', pathPayloadNextId(action))],
          [
            containsParentInNode(pathPayloadId(action)),
            changeParentId(pathPayloadId(action), pathPayloadNextId(action)),
          ],
          [T, identity],
        ]),
        state,
      );

    case SAVE_EDITING_NODE_STATES:
      return map(
        cond([
          [
            isNodeFromPayloadId(action),
            changeNodeStates(pathPayloadStates(action)),
          ],
          [
            containsParentInNode(pathPayloadId(action)),
            changeParentStates(
              pathPayloadId(action),
              pathPayloadStates(action),
              state,
            ),
          ],
          [T, identity],
        ]),
        state,
      );

    default:
      return state;
  }
};
