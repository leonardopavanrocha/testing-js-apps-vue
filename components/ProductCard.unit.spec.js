import { mount } from '@vue/test-utils';
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

  return {
    wrapper: mount(ProductCard, {
      propsData: {
        product,
      },
    }),
    product,
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
  it('should emit event when add to cart button is clicked', async () => {
    const { wrapper, product } = mountProductCard();
    await wrapper.find('button').trigger('click');

    expect(wrapper.emitted().addToCart).toBeTruthy();
    expect(wrapper.emitted().addToCart.length).toBe(1);
    expect(wrapper.emitted().addToCart[0]).toEqual([{ product }]);
  });
});
