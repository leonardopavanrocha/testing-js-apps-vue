import { CartManager } from '@/managers/CartManager';
import { makeServer } from '@/miragejs/server';

let server;
let manager;
describe('Cart Manager', () => {
  beforeEach(() => {
    server = makeServer({ environment: 'test' });
    manager = new CartManager();
  });
  afterEach(() => {
    server.shutdown();
  });

  it('should return the state', () => {
    const product = server.create('product');
    manager.addProduct(product);
    manager.open();

    const state = manager.getState();

    expect(state).toEqual({
      items: [product],
      open: true,
    });
  });
  it('should set cart to open', () => {
    const state = manager.open();

    expect(state.open).toBe(true);
  });

  it('should set cart to closed', () => {
    const state = manager.close();
    expect(state.open).toBe(false);
  });

  it('should add product to the cart only once', () => {
    const product = server.create('product');
    manager.addProduct(product);
    const state = manager.addProduct(product);

    expect(state.items).toHaveLength(1);
  });

  it('should remove product from the cart', () => {
    const product = server.create('product');
    manager.addProduct(product);
    const state = manager.removeProduct(product.id);

    expect(state.items).toHaveLength(0);
  });

  it('should clear products', () => {
    const products = server.createList('product', 2);
    products.forEach((product) => manager.addProduct(product));
    const state = manager.clearProducts();

    expect(state.items).toHaveLength(0);
  });

  it('should reset cart', () => {
    const products = server.createList('product', 2);
    products.forEach((product) => manager.addProduct(product));
    manager.open();
    const state = manager.resetCart();

    expect(state.items).toHaveLength(0);
    expect(state.open).toBe(false);
  });

  it('should return true if cart is not empty', () => {
    const product = server.create('product');
    manager.addProduct(product);
    expect(manager.hasProducts()).toBe(true);
  });

  it('should return true if product is already in the cart', () => {
    const product = server.create('product');
    manager.addProduct(product);
    expect(manager.isProductInCart(product)).toEqual(true);
  });
});
