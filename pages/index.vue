<template>
  <main class="my-8">
    <search-bar @search="onTermChanged" />
    <div v-if="errorMessage === ''" class="container mx-auto px-6">
      <h3 class="text-gray-700 text-2xl font-medium">Wrist Watch</h3>
      <span
        class="mt-3 text-sm text-gray-500"
        data-testid="product-total-quantity"
        >{{ quantityLabel }}</span
      >
      <div
        class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6"
      >
        <product-card
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
          data-testid="product-card"
        />
      </div>
    </div>
    <h3 v-else class="text-center text-2xl">{{ errorMessage }}</h3>
  </main>
</template>

<script>
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
export default {
  components: { ProductCard, SearchBar },
  data() {
    return {
      products: [],
      errorMessage: '',
      term: '',
    };
  },
  computed: {
    filteredProducts() {
      return this.products.filter((product) =>
        product.title.includes(this.term)
      );
    },
    quantityLabel() {
      const quantity = this.filteredProducts.length;
      return quantity === 1 ? `${quantity} Product` : `${quantity} Products`;
    },
  },
  async created() {
    try {
      const { data } = await this.$axios.get('/api/products');
      this.products = data.products;
    } catch (error) {
      this.errorMessage = 'Problemas ao carregar a lista';
    }
  },
  methods: {
    onTermChanged({ term }) {
      this.term = term;
    },
  },
};
</script>
