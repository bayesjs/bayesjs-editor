import { pathOr } from 'ramda';
import { getComponentTestId } from '../../src/utils/test-utils';

const getPosition = (key, obj) => pathOr(1, ['position', key], obj);

Cypress.Commands.add('newNetwork', (type = 'bn') => {
  cy.getByTestId(getComponentTestId('Button', 'Header')).click();
  cy.getByTestId(getComponentTestId('Header', 'Item', type)).click();
});

Cypress.Commands.add('getInSvg', selector => cy.get('svg')
  .findByTestId(selector));

Cypress.Commands.add('getNodeByTestId', selector => cy.getInSvg(getComponentTestId('GenericNode', selector)));
Cypress.Commands.add('getModalByTestId', selector => cy.getByTestId(getComponentTestId('ModalBody', selector)));

Cypress.Commands.add('createNode', (nodeName, options = {}) => {
  cy.get('svg')
    .trigger('contextmenu', {
      x: getPosition('x', options),
      y: getPosition('y', options),
    });

  cy.get('.react-contextmenu:visible')
    .should('exist');
  cy.getByTestId(getComponentTestId('ContextMenuItems', 'AddNode'))
    .click();

  cy.getByTestId(getComponentTestId('NodeStateEdit', 'Sim'))
    .should('exist');
  cy.getByTestId(getComponentTestId('NodeStateEdit', 'Nao'))
    .should('exist');

  cy.getModalByTestId('AddNode')
    .find('#name')
    .should('exist')
    .first()
    .type(nodeName);

  cy.getModalByTestId('AddNode')
    .findByTestId(getComponentTestId('Button', 'Add'))
    .should('exist')
    .click();

  cy.getNodeByTestId(nodeName).should('exist');
});

Cypress.Commands.add('removeNodeStates', (nodeName, states) => {
  states.forEach((state) => {
    cy.getInSvg(getComponentTestId('NodeStateEdit', state))
      .findByTestId(getComponentTestId('Button', 'RemoveState'))
      .should('exist')
      .click();
  });

  states.forEach((state) => {
    cy.getNodeByTestId(nodeName)
      .getByTestId(getComponentTestId('NodeState', state))
      .should('not.exist');
  });
});

Cypress.Commands.add('addNodeStates', (nodeName, states) => {
  states.forEach((state) => {
    cy.getModalByTestId('AddNode')
      .findByTestId(getComponentTestId('EditStatesList', 'input'))
      .type(`${state}{enter}`);
    cy.getInSvg(getComponentTestId('NodeStateEdit', state))
      .should('exist');
  });

  states.forEach((state) => {
    cy.getNodeByTestId(nodeName)
      .getByTestId(getComponentTestId('NodeState', state))
      .should('exist');
  });
});

Cypress.Commands.add('connectTwoNodes', (fromNodeName, toNodePosition) => {
  cy.getNodeByTestId(fromNodeName).trigger('contextmenu');

  cy.getByTestId(getComponentTestId('ContextMenuItems', 'AddChild')).click();
  cy.get('svg').trigger('mousemove', toNodePosition).click();
  cy.getByTestId(getComponentTestId('Arrow')).should('have.length', 1);
});
