import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import Auth from "./auth";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    products: [],
  },

  getters: {
    getProducts(state) {
      return state.products;
    },
  },
  mutations: {
    DB_LOAD_PRODUCT(state, payload) {
      state.products = payload.data;
    },
   
  },
  actions: {
    fetchProducts({ commit }) {
      axios.get("/products").then(response => {
        commit("DB_LOAD_PRODUCT", response.data);
      });
    },
  },
  modules: {
    Auth
  }
});
