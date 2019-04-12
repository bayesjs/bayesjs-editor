const HOME_PAGE = 'http://localhost:8080/';

Cypress.Commands.add('visitHome', () => {
  cy.visit(HOME_PAGE);
});

Cypress.Commands.add('getByTestId', (selector, options) => {
  cy.get(`[data-testid='${selector}']`, options);
});

Cypress.Commands.add('findByTestId', { prevSubject: true }, (subject, selector) => subject.find(`[data-testid=${selector}]`));
