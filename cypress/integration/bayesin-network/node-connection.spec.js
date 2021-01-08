import { getComponentTestId } from '@utils/test-utils';

describe('Node Connection', () => {
  it('connect two nodes and then disconnect', () => {
    cy.createNode('Node 1');
    cy.createNode('Node 2', { position: { x: 200 } });

    cy.getNodeByTestId('Node 1')
      .trigger('contextmenu');

    cy.getByTestId(getComponentTestId('ContextMenuItems', 'AddChild'))
      .click();
    cy.get('svg').trigger('mousemove', { x: 200, y: 1 }).click();
    cy.getByTestId(getComponentTestId('Arrow'))
      .should('have.length', 1)
      .trigger('contextmenu');

    cy.getByTestId(getComponentTestId('ContextMenuItems', 'RemoveLink'))
      .click();
    cy.getByTestId(getComponentTestId('Arrow'))
      .should('have.length', 0);
  });
});
