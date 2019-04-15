import { getComponentTestId } from '../../../src/utils/test-utils';

describe('Node Probabilities', () => {
  const nodeName = 'Node 1';

  beforeEach(() => {
    cy.createNode(nodeName);
  });

  it('opens edit states by right click', () => {
    cy.getNodeByTestId(nodeName).trigger('mousedown', { button: 2 });
    cy.getByTestId(getComponentTestId('ContextMenu', 'Item', 'EditCpt')).click();

    cy.getByTestId(getComponentTestId('ModalBody', 'EditarTabelaDeProbabilidades', 'Node', 1))
      .should('exist');
  });

  it('edit states by click on right pane', () => {
    cy.getNodeByTestId(nodeName).click();
    cy.getByTestId(getComponentTestId('Button', 'EditProbabilities')).click();

    cy.getByTestId(getComponentTestId('ModalBody', 'EditarTabelaDeProbabilidades', 'Node', 1))
      .should('exist');
  });
});
