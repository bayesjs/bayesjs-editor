import { getComponentTestId } from 'utils/test-utils';

describe('Node', () => {
  const nodeName = 'Node 1';

  beforeEach(() => {
    cy.createNode(nodeName);
  });

  it('Change name', () => {
    const newName = 'New Node Name';

    cy.getNodeByTestId(nodeName)
      .click();
    cy.getByTestId(getComponentTestId('PropertiesNode'))
      .find('#name')
      .clear()
      .type(`${newName}{enter}`)
      .blur();

    cy.getNodeByTestId(newName)
      .should('exist');
  });

  it('Change description', () => {
    const newDescription = 'Super long description';

    cy.getNodeByTestId(nodeName)
      .click();
    cy.getByTestId(getComponentTestId('PropertiesNode'))
      .find('#description')
      .clear()
      .type(`${newDescription}`);

    cy.get('svg')
      .click();
    cy.getNodeByTestId(nodeName)
      .click();

    cy.getByTestId(getComponentTestId('PropertiesNode'))
      .find('#description')
      .contains(newDescription);
  });

  it('Deletes a node', () => {
    cy.getNodeByTestId(nodeName).trigger('mousedown', { button: 2 });
    cy.getByTestId(getComponentTestId('ContextMenu', 'Item', 'RemoveNode'))
      .click();

    cy.getNodeByTestId(nodeName).should('not.exist');
  });
});
