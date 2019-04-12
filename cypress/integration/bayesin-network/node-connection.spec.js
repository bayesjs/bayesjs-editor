import { getComponentTestId } from '../../../src/utils/test-utils';

describe('Node Connection', () => {
  it('connect two nodes and then disconnect', () => {
    cy.createNode('Node 1');
    cy.createNode('Node 2', { position: { x: 200 } });

    cy.getNodeByTestId('Node 1')
      .trigger('mousedown', { button: 2 });

    cy.getByTestId(getComponentTestId('ContextMenu', 'Item', 'AddChild'))
      .click();
    cy.getNodeByTestId('Node 2')
      .click();
    cy.getByTestId(getComponentTestId('Arrow'))
      .should('have.length', 1)
      .trigger('mousedown', { button: 2 });

    cy.getByTestId(getComponentTestId('ContextMenu', 'Item', 'RemoveLink'))
      .click();
    cy.getByTestId(getComponentTestId('Arrow'))
      .should('have.length', 0);
  });
});
