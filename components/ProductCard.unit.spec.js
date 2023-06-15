import { mount } from '@vue/test-utils';
import { CartManager } from '../managers/CartManager';
import ProductCard from '@/components/ProductCard';
import { makeServer } from '@/miragejs/server';

let server;

const mountProductCard = () => {
  const product = server.create('product', {
    title: 'Relogio Bonito',
    price: '23.00',
    image:
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-1.2.1&auto=format&fit=crop&w=689&q=80',
  });

  const cartManager = new CartManager();

  const wrapper = mount(ProductCard, {
    propsData: {
      product,
    },
    mocks: {
      $cart: cartManager,
    },
  });

  return {
    wrapper,
    product,
    cartManager,
  };
};

describe('Product Card - unit', () => {
  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });
  afterEach(() => {
    server.shutdown();
  });

  it('should match snapshot', () => {
    const { wrapper } = mountProductCard();
    expect(wrapper.element).toMatchSnapshot();
  });

  it('should mount the component', () => {
    const { wrapper } = mountProductCard();
    expect(wrapper.vm).toBeDefined();
    expect(wrapper.text()).toContain('Relogio Bonito');
    expect(wrapper.text()).toContain('$23.00');
  });

  it('should add item to cart when clicking on add button', async () => {
    const { wrapper, cartManager, product } = mountProductCard();
    const spyOpen = jest.spyOn(cartManager, 'open');
    const spyAddProduct = jest.spyOn(cartManager, 'addProduct');
    await wrapper.find('button').trigger('click');

    expect(spyOpen).toHaveBeenCalledTimes(1);
    expect(spyAddProduct).toHaveBeenCalledTimes(1);
    expect(spyAddProduct).toHaveBeenCalledWith(product);
  });
});
