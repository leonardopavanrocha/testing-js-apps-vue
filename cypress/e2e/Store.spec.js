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
    cy.visit('/');
    cy.get('body').contains('Brand');
    cy.get('body').contains('Wrist Watch');
  });

  describe('Store -> search for products', () => {
    it('should type in the search field', () => {
      cy.visit('/');

      cy.get("input[type='search']").type('Air Jordan');
      cy.get("input[type='search']").should('have.value', 'Air Jordan');
    });

    it('should filter products based on search term - return 1 product', () => {
      server.create('product', {
        title: 'Air Jordan',
      });
      server.createList('product', 10);

      cy.visit('/');

      cy.get("input[type='search']").type('Air Jordan');
      cy.get("[data-testid='search-form']").submit();

      cy.get("[data-testid='product-card']").should('have.length', 1);
    });

    it('should filter products based on search term - return 0 products', () => {
      server.createList('product', 10);

      cy.visit('/');

      cy.get("input[type='search']").type('Air Jordan');
      cy.get("[data-testid='search-form']").submit();

      cy.get("[data-testid='product-card']").should('have.length', 0);
      cy.get('body').contains('0 Products');
    });
  });

  describe('Store -> Product list', () => {
    it('should display "0 products" when no product is returned', () => {
      cy.visit('/');

      cy.get("[data-testid='product-card']").should('have.length', 0);
      cy.get('[data-testid="product-total-quantity"]').contains('0 Products');
    });

    it('should display "1 product" when 1 product is returned', () => {
      server.createList('product', 1);
      cy.visit('/');

      cy.get("[data-testid='product-card']").should('have.length', 1);
      cy.get('[data-testid="product-total-quantity"]').contains('1 Product');
    });

    it('should display "10 products" when 10 products is returned', () => {
      server.createList('product', 10);
      cy.visit('/');

      cy.get("[data-testid='product-card']").should('have.length', 10);
      cy.get('[data-testid="product-total-quantity"]').contains('10 Products');
    });
  });
});
