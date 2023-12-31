import Vue from 'vue';

export default {
  install: (Vue) => {
    /* istanbul ignore next */
    Vue.prototype.$cart = new CartManager();
  },
};

const initialState = {
  open: false,
  items: [],
};

export class CartManager {
  state;

  constructor() {
    this.state = Vue.observable(initialState);
  }

  getState() {
    return this.state;
  }

  open() {
    this.state.open = true;
    return this.getState();
  }

  close() {
    this.state.open = false;
    return this.getState();
  }

  isProductInCart(product) {
    return Boolean(this.state.items.find(({ id }) => id === product.id));
  }

  addProduct(product) {
    if (!this.isProductInCart(product)) {
      this.state.items.push(product);
    }

    return this.getState();
  }

  removeProduct(productId) {
    this.state.items = this.state.items.filter(({ id }) => id !== productId);
    return this.getState();
  }

  clearProducts() {
    this.state.items = [];
    return this.getState();
  }

  resetCart() {
    this.clearProducts();
    this.close();
    return this.getState();
  }

  hasProducts() {
    return Boolean(this.state.items.length);
  }
}
