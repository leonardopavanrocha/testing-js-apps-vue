import axios from 'axios';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import ProductList from '.';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import { makeServer } from '@/miragejs/server';

jest.mock('axios', () => ({
  get: jest.fn(),
}));

let server;

const getProducts = (qty = 10, additionalProducts = []) => {
  return [
    ...server.createList('product', qty),
    ...additionalProducts.map((product) => server.create('product', product)),
  ];
};

const mountProductList = async (
  qty,
  additionalProducts = [],
  shouldReject = false
) => {
  const products = getProducts(qty, additionalProducts);
  if (shouldReject) {
    axios.get.mockReturnValue(Promise.reject(new Error('error')));
  } else {
    axios.get.mockReturnValue({ data: { products } });
  }

  const wrapper = mount(ProductList, {
    mocks: {
      $axios: axios,
    },
  });
  await nextTick();
  return { wrapper, products };
};

describe('Product List - Integration', () => {
  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });
  afterEach(() => {
    server.shutdown();
    jest.clearAllMocks();
  });
  it('should mount the component', async () => {
    const { wrapper } = await mountProductList();
    expect(wrapper.vm).toBeDefined();
  });
  it('should mount the Search component', async () => {
    const { wrapper } = await mountProductList();
    expect(wrapper.findComponent(SearchBar)).toBeDefined();
  });

  it('should call axios get when mounting the component', async () => {
    await mountProductList();

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith('/api/products');
  });

  it('should mount the ProductCard component 10 times', async () => {
    const { wrapper } = await mountProductList();
    const cards = wrapper.findAllComponents(ProductCard);
    expect(cards).toHaveLength(10);
  });

  it('should show an error message when the request fails', async () => {
    const { wrapper } = await mountProductList(10, [], true);
    expect(wrapper.text()).toContain('Problemas ao carregar a lista');
  });

  it('should filter list when search bar contains a value', async () => {
    const title = 'My Product';
    const { wrapper } = await mountProductList(10, [{ title }]);

    const searchComponent = wrapper.findComponent(SearchBar);

    searchComponent.find('input[type="text"]').setValue(title);
    await searchComponent.find('form').trigger('submit');
    await nextTick();
    expect(wrapper.vm.term).toEqual(title);
    expect(wrapper.findAllComponents(ProductCard)).toHaveLength(1);

    searchComponent.find('input[type="text"]').setValue('');
    await nextTick();
    expect(wrapper.vm.term).toEqual('');
    expect(wrapper.findAllComponents(ProductCard)).toHaveLength(11);
  });
});
