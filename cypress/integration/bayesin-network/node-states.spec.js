import { getComponentTestId } from 'utils/test-utils';

describe('Node States', () => {
  const nodeName = 'Node 1';

  beforeEach(() => {
    cy.createNode(nodeName);
  });

  it('opens edit states by right click', () => {
    cy.getNodeByTestId(nodeName)
      .trigger('contextmenu');
    cy.getByTestId(getComponentTestId('ContextMenuItems', 'EditStates'))
      .click();

    cy.getByTestId(getComponentTestId('ModalBody', 'EditarEstados', nodeName))
      .should('exist')
      .should('exist');
  });

  it('edit states by click on right pane', () => {
    cy.getNodeByTestId(nodeName).click();
    cy.getByTestId(getComponentTestId('Button', 'EditStates'))
      .click();

    cy.getByTestId(getComponentTestId('ModalBody', 'EditarEstados', nodeName))
      .should('exist')
      .should('exist');
  });

  it('removes all states', () => {
    cy.getNodeByTestId(nodeName).click();
    cy.getByTestId(getComponentTestId('Button', 'EditStates'))
      .click();

    cy.getByTestId(getComponentTestId('ModalBody', 'EditarEstados', nodeName))
      .should('exist')
      .find(`[data-testid*=${getComponentTestId('EditStatesList', 'Item')}]`)
      .should('have.length', 2);

    cy.getByTestId(getComponentTestId('EditStatesList', 'Item', 'Sim'))
      .findByTestId(getComponentTestId('Button', 'RemoveState'))
      .should('exist')
      .click();
    cy.getByTestId(getComponentTestId('EditStatesList', 'Item', 'Nao'))
      .findByTestId(getComponentTestId('Button', 'RemoveState'))
      .should('exist')
      .click();

    cy.getByTestId(getComponentTestId('ModalBody', 'EditarEstados', nodeName))
      .should('exist')
      .find(`[data-testid*=${getComponentTestId('EditStatesList', 'Item')}]`)
      .should('have.length', 0);
  });

  it('adds a new states', () => {
    const state = 'new-states';

    cy.getNodeByTestId(nodeName).click();
    cy.getByTestId(getComponentTestId('Button', 'EditStates'))
      .click();

    cy.getByTestId(getComponentTestId('ModalBody', 'EditarEstados', nodeName))
      .should('exist')
      .find('input')
      .type(`${state}{enter}`);

    cy.getByTestId(getComponentTestId('EditStatesList', 'Item', state))
      .should('exist');

    cy.getByTestId(getComponentTestId('ModalBody', 'EditarEstados', nodeName))
      .should('exist')
      .findByTestId(getComponentTestId('Button', 'Save')).click();

    cy.getNodeByTestId(nodeName)
      .getByTestId(getComponentTestId('NodeState', state))
      .should('exist');
  });

  it('removes all states and add new ones', () => {
    const states = ['state-1', 'state-2', 'state-3'];

    cy.getNodeByTestId(nodeName).click();
    cy.getByTestId(getComponentTestId('Button', 'EditStates')).click();

    cy.getByTestId(getComponentTestId('EditStatesList', 'Item', 'Sim'))
      .findByTestId(getComponentTestId('Button', 'RemoveState'))
      .should('exist')
      .click();
    cy.getByTestId(getComponentTestId('EditStatesList', 'Item', 'Nao'))
      .findByTestId(getComponentTestId('Button', 'RemoveState'))
      .should('exist')
      .click();

    states.forEach((state) => {
      cy.getByTestId(getComponentTestId('ModalBody', 'EditarEstados', nodeName))
        .should('exist')
        .find('input')
        .type(`${state}{enter}`);

      cy.getByTestId(getComponentTestId('EditStatesList', 'Item', state))
        .should('exist');
    });

    cy.getByTestId(getComponentTestId('ModalBody', 'EditarEstados', nodeName))
      .should('exist')
      .findByTestId(getComponentTestId('Button', 'Save'))
      .click();

    states.forEach((state) => {
      cy.getNodeByTestId(nodeName)
        .getByTestId(getComponentTestId('NodeState', state))
        .should('exist');
    });
  });
});
