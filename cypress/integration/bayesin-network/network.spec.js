import { getComponentTestId } from '@utils/test-utils';

describe('Network', () => {
  it('creates a new one', () => {
    cy.newNetwork('bn');

    cy.get(`[data-testid*=${getComponentTestId('GenericNode')}]`)
      .should('have.length', 0);
  });

  it('changes name', () => {
    const newName = 'My New Bayesina Network';

    cy.getByTestId(getComponentTestId('PropertiesNetwork'))
      .find('#name')
      .clear()
      .type(`${newName}{enter}`)
      .blur();

    cy.createNode('just to remove newtwork focus');
    cy.getNodeByTestId('just to remove newtwork focus').click();
    cy.get('svg').click();

    cy.getByTestId(getComponentTestId('PropertiesNetwork'))
      .find('#name')
      .should('have.value', newName);
  });

  it('changes description', () => {
    const newDescription = 'My new description';

    cy.getByTestId(getComponentTestId('PropertiesNetwork'))
      .find('#description')
      .clear()
      .type(`${newDescription}`)
      .blur();

    cy.createNode('just to remove newtwork focus').click();
    cy.get('svg').click();

    cy.getByTestId(getComponentTestId('PropertiesNetwork'))
      .find('#description')
      .should('have.value', newDescription);
  });

  it('changes width', () => {
    const newWidth = 1000;

    cy.getByTestId(getComponentTestId('PropertiesNetwork'))
      .find('#width')
      .clear()
      .type(`${newWidth}{enter}`);

    cy.get('svg').should('have.attr', 'width', newWidth.toString());
  });

  it('changes height', () => {
    const newHeiht = 1000;

    cy.getByTestId(getComponentTestId('PropertiesNetwork'))
      .find('#height')
      .clear()
      .type(`${newHeiht}{enter}`);

    cy.get('svg').should('have.attr', 'height', newHeiht.toString());
  });

  it('disable inference and enable again', () => {
    const nodeName = 'Node 1';

    cy.createNode(nodeName);
    cy.get('svg').click();

    cy.getNodeByTestId(nodeName)
      .findByTestId(getComponentTestId('NodeState', 'Sim'))
      .find('rect')
      .first()
      .should('have.attr', 'width', '37.5');

    cy.getByTestId(getComponentTestId('PropertiesNetwork'))
      .find('#inferenceEnabled')
      .should('be.checked')
      .uncheck()
      .should('not.be.checked');

    cy.getNodeByTestId(nodeName)
      .findByTestId(getComponentTestId('NodeState', 'Sim'))
      .find('rect')
      .first()
      .should('have.attr', 'width', '0');

    cy.getByTestId(getComponentTestId('PropertiesNetwork'))
      .find('#inferenceEnabled')
      .check()
      .should('be.checked');
  });
});
