import { mount } from '@vue/test-utils';
import { makeServer } from '../miragejs/server';
import { CartManager } from '../managers/CartManager';
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

  const mountCart = (additionalProps = {}) => {
    const items = server.createList('product', 2);
    const cartManager = new CartManager();
    const wrapper = mount(ShoppingCart, {
      propsData: {
        items,
        ...additionalProps,
      },
      mocks: {
        $cart: cartManager,
      },
    });
    return { wrapper, products: items, cartManager };
  };

  it('should mount the component', () => {
    const { wrapper } = mountCart();
    expect(wrapper.vm).toBeDefined();
  });

  it('should emit close event when button is clicked', async () => {
    const { wrapper } = mountCart();
    const button = wrapper.find('button#close-button');

    await button.trigger('click');

    expect(wrapper.emitted().close).toBeTruthy();
    expect(wrapper.emitted().close).toHaveLength(1);
  });

  it('should hide the cart when prop isOpen is false', () => {
    const { wrapper } = mountCart();

    expect(wrapper.classes()).toContain('hidden');
  });

  it('should show the cart when prop isOpen is true', () => {
    const { wrapper } = mountCart({
      isOpen: true,
    });

    expect(wrapper.classes()).not.toContain('hidden');
  });

  it('should display "Cart is empty" when no products are in the cart', () => {
    const { wrapper } = mountCart({
      isOpen: true,
      items: [],
    });

    expect(wrapper.text()).toContain('Cart is empty');
  });

  it('should display 2 instances of CartItem when 2 products are given', () => {
    const { wrapper } = mountCart({
      isOpen: true,
    });
    expect(wrapper.findAllComponents(CartItem)).toHaveLength(2);
  });

  it('should show a button to clear cart', () => {
    const { wrapper } = mountCart();
    const removeButton = wrapper.find('[data-testid="clear-cart-button"]');
    expect(removeButton.exists()).toBe(true);
  });

  it('should clear cart when clear cart button is clicked', async () => {
    const { wrapper, cartManager } = mountCart();
    const removeButton = wrapper.find('[data-testid="clear-cart-button"]');
    const spy = jest.spyOn(cartManager, 'clearProducts');
    await removeButton.trigger('click');
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
