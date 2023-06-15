import { mount } from '@vue/test-utils';
import { CartManager } from '../managers/CartManager';
import DefaultLayout from './default';
import ShoppingCart from '@/components/ShoppingCart';

describe('Default Layout', () => {
  const mountLayout = () => {
    const wrapper = mount(DefaultLayout, {
      mocks: {
        $cart: new CartManager(),
      },
      stubs: {
        Nuxt: true,
      },
    });
    return { wrapper };
  };
  it('should mount Cart', () => {
    const { wrapper } = mountLayout();

    expect(wrapper.findComponent(ShoppingCart)).toBeTruthy();
  });

  it('should toggle cart visibility', async () => {
    const { wrapper } = mountLayout();
    const button = wrapper.find('#toggle-cart');
    await button.trigger('click');

    expect(wrapper.vm.$cart.getState().open).toBe(true);

    await button.trigger('click');
    expect(wrapper.vm.$cart.getState().open).toBe(false);
  });
});
