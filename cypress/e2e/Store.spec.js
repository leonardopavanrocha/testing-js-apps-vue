/// <reference types="cypress" />

import { makeServer } from '../../miragejs/server';

describe('Store', () => {
  let server;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should display the store', () => {
    server.createList('product', 10);
    cy.visit('http://localhost:3000');
    cy.get('body').contains('Brand');
    cy.get('body').contains('Wrist Watch');
  });

  describe('Store -> search for products', () => {
    it('should type in the search field', () => {
      cy.visit('http://localhost:3000');

      cy.get("input[type='search']").type('Air Jordan');
      cy.get("input[type='search']").should('have.value', 'Air Jordan');
    });

    it('should filter products based on search term - return 1 product', () => {
      server.create('product', {
        title: 'Air Jordan',
      });
      server.createList('product', 10);

      cy.visit('http://localhost:3000');

      cy.get("input[type='search']").type('Air Jordan');
      cy.get("[data-testid='search-form']").submit();

      cy.get("[data-testid='product-card']").should('have.length', 1);
    });

    it('should filter products based on search term - return 0 products', () => {
      server.createList('product', 10);

      cy.visit('http://localhost:3000');

      cy.get("input[type='search']").type('Air Jordan');
      cy.get("[data-testid='search-form']").submit();

      cy.get("[data-testid='product-card']").should('have.length', 0);
      cy.get('body').contains('0 Products');
    });
  });
});
