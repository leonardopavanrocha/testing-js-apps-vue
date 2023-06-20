// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('getByTestId', (selector) => {
  return cy.get(`[data-testid='${selector}']`);
});

Cypress.Commands.add('addToCart', (mode) => {
  const click = (index) => {
    cy.get('@ProductCardList').eq(index).find('button').click({ force: true });
  };

  cy.getByTestId('product-card').as('ProductCardList');
  if (Array.isArray(mode)) {
    for (const index of mode) {
      click(index);
    }
  } else if (typeof mode === 'number') {
    click(mode);
  } else if (typeof mode === 'string' && mode === 'all') {
    cy.get('@ProductCardList')
      .find('button')
      .click({ force: true, multiple: true });
  } else {
    throw new Error('Invalid mode');
  }
});
