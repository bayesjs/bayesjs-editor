import { pathOr } from 'ramda';
import { getComponentTestId } from '../../src/utils/test-utils';

const getPosition = (key, obj) => pathOr(1, ['position', key], obj);

Cypress.Commands.add('newNetwork', (type = 'bn') => {
  cy.getByTestId(getComponentTestId('Button', 'Header')).click();
  cy.getByTestId(getComponentTestId('Header', 'Item', type)).click();
});

Cypress.Commands.add('getInSvg', selector => cy.get('svg')
  .findByTestId(selector));

Cypress.Commands.add('getNodeByTestId', selector => cy.getInSvg(getComponentTestId('NodeGeneric', selector)));
Cypress.Commands.add('getModalByTestId', selector => cy.getByTestId(getComponentTestId('ModalBody', selector)));

Cypress.Commands.add('createNode', (nodeName, options = {}) => {
  cy.get('svg')
    .trigger('mousedown', {
      x: getPosition('x', options),
      y: getPosition('y', options),
      button: 2,
    });

  cy.getByTestId(getComponentTestId('ContextMenu'))
    .should('exist');
  cy.getByTestId(getComponentTestId('ContextMenu', 'Item', 'AddNode'))
    .click();

  cy.getByTestId(getComponentTestId('EditStatesList', 'Item', 'Sim'))
    .should('exist');
  cy.getByTestId(getComponentTestId('EditStatesList', 'Item', 'Nao'))
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
    cy.getInSvg(getComponentTestId('EditStatesList', 'Item', state))
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
    cy.getInSvg(getComponentTestId('EditStatesList', 'Item', state))
      .should('exist');
  });

  states.forEach((state) => {
    cy.getNodeByTestId(nodeName)
      .getByTestId(getComponentTestId('NodeState', state))
      .should('exist');
  });
});

Cypress.Commands.add('connectTwoNodes', (fromNodeName, toNodeName) => {
  cy.getNodeByTestId(fromNodeName).trigger('mousedown', { button: 2 });

  cy.getByTestId(getComponentTestId('ContextMenu', 'Item', 'AddChild')).click();
  cy.getNodeByTestId(toNodeName).click();
  cy.getByTestId(getComponentTestId('Arrow')).should('have.length', 1);
});
