import { mount } from '@vue/test-utils';
import { CartManager } from '../managers/CartManager';
import { makeServer } from '../miragejs/server';
import CartItem from '@/components/CartItem';

const mountCartItem = () => {
  const cartManager = new CartManager();
  const product = server.create('product', {
    title: 'Air Jordan 1',
    price: '119.00',
  });

  const wrapper = mount(CartItem, {
    propsData: {
      product,
    },
    mocks: {
      $cart: cartManager,
    },
  });

  return { wrapper, product, cartManager };
};

let server;
describe('CartItem - Unit', () => {
  beforeEach(() => {
    server = makeServer({ environment: 'dev' });
  });

  afterEach(() => {
    server.shutdown();
  });
  it('should mount the component', () => {
    const { wrapper } = mountCartItem();
    expect(wrapper.vm).toBeDefined();
  });

  it('should display product info', () => {
    const {
      wrapper,
      product: { title, price },
    } = mountCartItem();
    const content = wrapper.text();

    expect(content).toContain(title);
    expect(content).toContain(price);
  });

  it('should display quantity 1 when product is first displayed', () => {
    const { wrapper } = mountCartItem();

    const quantity = wrapper.find('#cart-quantity');
    expect(quantity.text()).toEqual('1');
  });

  it('should increase quantity when increase button is clicked', async () => {
    const { wrapper } = mountCartItem();

    const quantity = wrapper.find('#cart-quantity');
    const increaseButton = wrapper.find('#increase');

    await increaseButton.trigger('click');
    expect(quantity.text()).toEqual('2');

    await increaseButton.trigger('click');
    expect(quantity.text()).toEqual('3');

    await increaseButton.trigger('click');
    expect(quantity.text()).toEqual('4');
  });

  it('should decrease quantity when decrease button is clicked', async () => {
    const { wrapper } = mountCartItem();

    const quantity = wrapper.find('#cart-quantity');
    const decreaseButton = wrapper.find('#decrease');

    await decreaseButton.trigger('click');
    expect(quantity.text()).toEqual('0');

    await decreaseButton.trigger('click');

    expect(quantity.text()).toEqual('0');
  });

  it('should show a button to remove cart item from cart', () => {
    const { wrapper } = mountCartItem();
    const removeButton = wrapper.find('[data-testid="remove-button"]');
    expect(removeButton.exists()).toBe(true);
  });

  it('should remove product when delete button is clicked', async () => {
    const { wrapper, cartManager, product } = mountCartItem();
    const removeButton = wrapper.find('[data-testid="remove-button"]');
    const spy = jest.spyOn(cartManager, 'removeProduct');
    await removeButton.trigger('click');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(product.id);
  });
});
