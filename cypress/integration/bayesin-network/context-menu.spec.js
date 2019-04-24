import { getComponentTestId } from 'utils/test-utils';

describe('Context Menu', () => {
  describe('When the context is a network', () => {
    it('contains 1 option', () => {
      cy.get('svg').trigger('mousedown', { button: 2 });

      cy.getByTestId(getComponentTestId('ContextMenu'))
        .as('menu')
        .find('li')
        .should('have.length', 1);
      cy.get('@menu')
        .find('li')
        .first()
        .should('have.contain', 'Adicionar variável');
    });
  });

  describe('When the context is a node', () => {
    it('contains 4 option', () => {
      const optionsNames = [
        'Adicionar ligação',
        'Editar estados',
        'Editar probabilidades',
        'Remover variável',
      ];
      const nodeName = 'Node 1';

      cy.createNode(nodeName);
      cy.getNodeByTestId(nodeName).trigger('mousedown', { button: 2 });

      cy.getByTestId(getComponentTestId('ContextMenu'))
        .as('menu')
        .find('li')
        .should('have.length', 4);
      cy.get('@menu').find('li').each(($el, index) => {
        cy.wrap($el).should('have.contain', optionsNames[index]);
      });
    });
  });

  describe('When the context is a arrow', () => {
    it('contains 1 option', () => {
      const node1 = 'Node 1';
      const node2 = 'Node 2';

      cy.createNode(node1);
      cy.createNode(node2, { position: { x: 200 } });
      cy.connectTwoNodes(node1, node2);

      cy.getByTestId('arrow').trigger('mousedown', { button: 2 });

      cy.getByTestId(getComponentTestId('ContextMenu'))
        .as('menu')
        .find('li')
        .should('have.length', 1);
      cy.get('@menu')
        .find('li')
        .first()
        .should('have.contain', 'Remover ligação');
    });
  });
});
