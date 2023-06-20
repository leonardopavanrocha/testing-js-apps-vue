/// <reference types="cypress" />

import { makeServer } from '../../miragejs/server';

describe('Store', () => {
  let server;
  const g = cy.get;
  const gid = cy.getByTestId;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should display the store', () => {
    server.createList('product', 10);
    cy.visit('/');
    g('body').contains('Brand');
    g('body').contains('Wrist Watch');
  });

  describe('Store -> search for products', () => {
    it('should type in the search field', () => {
      cy.visit('/');

      g("input[type='search']").type('Air Jordan');
      g("input[type='search']").should('have.value', 'Air Jordan');
    });

    it('should filter products based on search term - return 1 product', () => {
      server.create('product', {
        title: 'Air Jordan',
      });
      server.createList('product', 10);

      cy.visit('/');

      g("input[type='search']").type('Air Jordan');
      gid('search-form').submit();

      gid('product-card').should('have.length', 1);
    });

    it('should filter products based on search term - return 0 products', () => {
      server.createList('product', 10);

      cy.visit('/');

      g("input[type='search']").type('Air Jordan');
      gid('search-form').submit();

      gid('product-card').should('have.length', 0);
      g('body').contains('0 Products');
    });
  });

  describe('Store -> Product list', () => {
    it('should display "0 products" when no product is returned', () => {
      cy.visit('/');

      gid('product-card').should('have.length', 0);
      gid('product-total-quantity').contains('0 Products');
    });

    it('should display "1 product" when 1 product is returned', () => {
      server.createList('product', 1);
      cy.visit('/');

      gid('product-card').should('have.length', 1);
      gid('product-total-quantity').contains('1 Product');
    });

    it('should display "10 products" when 10 products is returned', () => {
      server.createList('product', 10);
      cy.visit('/');

      gid('product-card').should('have.length', 10);
      gid('product-total-quantity').contains('10 Products');
    });
  });

  describe('Store -> Shopping Cart', () => {
    const quantity = 10;
    beforeEach(() => {
      server.createList('product', quantity);
      cy.visit('/');
    });
    it('should not display cart when page first loads', () => {
      gid('shopping-cart').should('have.class', 'hidden');
    });

    it.only("should not display 'clear cart' button when cart is empty", () => {
      g('button#toggle-cart').click();
      gid('clear-cart-button').should('not.exist');
    });

    it('should toggle cart when button is clicked', () => {
      gid('shopping-cart').should('have.class', 'hidden');
      g('button#toggle-cart').click();
      gid('shopping-cart').should('not.have.class', 'hidden');
      g('button#close-button').click();
      gid('shopping-cart').should('have.class', 'hidden');
    });

    it('should display "Cart is empty" when there are no products in cart', () => {
      g('button#toggle-cart').click();
      gid('shopping-cart').contains('Cart is empty');
    });

    it('should open cart when add to cart button is clicked', () => {
      cy.addToCart({ index: 0 });
      gid('shopping-cart').should('not.have.class', 'hidden');
    });

    it('should add item to cart when add to cart button is clicked', () => {
      cy.addToCart({ index: 0 });
      gid('cart-item').should('have.length', 1);
    });

    it('should add 3 products to the cart', () => {
      cy.addToCart({ indices: [1, 3, 5] });
      gid('cart-item').should('have.length', 3);
    });

    it('should add all products to the cart', () => {
      cy.addToCart({ indices: 'all' });
      gid('cart-item').should('have.length', quantity);
    });

    it('should remove product from cart', () => {
      cy.addToCart({ index: 2 });
      gid('cart-item').as('cartItems');
      g('@cartItems').should('have.length', 1);
      g('@cartItems').first().find('[data-testid="remove-button"]').click();
      g('@cartItems').should('have.length', 0);
    });

    it('should clear cart when clear cart button is clicked', () => {
      cy.addToCart({ indices: [1, 2, 3] });
      gid('cart-item').should('have.length', 3);
      gid('clear-cart-button').click();
      gid('cart-item').should('have.length', 0);
    });
  });
});
