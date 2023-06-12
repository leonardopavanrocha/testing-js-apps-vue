import { mount } from '@vue/test-utils';
import { makeServer } from '../miragejs/server';
import ShoppingCart from '@/components/ShoppingCart';
import CartItem from '@/components/CartItem';

let server;

describe('ShoppingCart - unit', () => {
  beforeEach(() => {
    server = makeServer({ environment: 'dev' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should mount the component', () => {
    const wrapper = mount(ShoppingCart);
    expect(wrapper.vm).toBeDefined();
  });

  it('should emit close event when button is clicked', async () => {
    const wrapper = mount(ShoppingCart);
    const button = wrapper.find('button#close-button');

    await button.trigger('click');

    expect(wrapper.emitted().close).toBeTruthy();
    expect(wrapper.emitted().close).toHaveLength(1);
  });

  it('should hide the cart when prop isOpen is false', () => {
    const wrapper = mount(ShoppingCart);

    expect(wrapper.classes()).toContain('hidden');
  });

  it('should show the cart when prop isOpen is true', () => {
    const wrapper = mount(ShoppingCart, {
      propsData: {
        isOpen: true,
      },
    });

    expect(wrapper.classes()).not.toContain('hidden');
  });

  it('should display "Cart is empty" when no products are in the cart', () => {
    const wrapper = mount(ShoppingCart, {
      propsData: {
        isOpen: true,
        items: [],
      },
    });

    expect(wrapper.text()).toContain('Cart is empty');
  });

  it('should display 2 instances of CartItem when 2 products are given', () => {
    const products = server.createList('product', 2);
    const wrapper = mount(ShoppingCart, {
      propsData: {
        isOpen: true,
        items: products,
      },
    });
    expect(wrapper.findAllComponents(CartItem)).toHaveLength(2);
  });
});
