describe('Context Menu', () => {
  describe('When the context is a network', () => {
    it('contains 1 option', () => {
      cy.get('svg').trigger('contextmenu');


      cy.get('.react-contextmenu:visible')
        .as('menu')
        .find('.react-contextmenu-item')
        .should('have.length', 1);
      cy.get('@menu')
        .find('.react-contextmenu-item')
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
      cy.getNodeByTestId(nodeName).trigger('contextmenu');

      cy.get('.react-contextmenu:visible')
        .as('menu')
        .find('.react-contextmenu-item')
        .should('have.length', 4);
      cy.get('@menu').find('.react-contextmenu-item').each(($el, index) => {
        cy.wrap($el).should('have.contain', optionsNames[index]);
      });
    });
  });

  describe('When the context is a arrow', () => {
    it('contains 1 option', () => {
      const node1 = 'Node 1';
      const node2Position = { x: 200, y: 1 };

      cy.createNode(node1);
      cy.createNode('Node 2', { position: node2Position });
      cy.connectTwoNodes(node1, node2Position);

      cy.getByTestId('arrow').trigger('contextmenu');

      cy.get('.react-contextmenu:visible')
        .as('menu')
        .find('.react-contextmenu-item')
        .should('have.length', 1);
      cy.get('@menu')
        .find('.react-contextmenu-item')
        .first()
        .should('have.contain', 'Remover ligação');
    });
  });
});
