import axios from "axios";
export default {
  namespaced: true, // otherwise got unkown type
  state: {
    token: null,
    user: null
  },

  getters: {
    authenticated(state) {
      return state.token && state.user;
    },

    user(state) {
      return state.user;
    }
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
    },

    SET_USER(state, data) {
      state.user = data;
    }
  },
  actions: {
    async signIn({ dispatch }, credentials) {
      const response = await axios.post("/login", credentials);
      return dispatch("attempt", response.data);
    },

    async signUp({ dispatch }, credentials) {
      const response = await axios.post("/register", credentials);
      return dispatch("attempt", response.data);
    },

    async attempt({ commit, state }, token) {
      // get token
      if (token) {
        commit("SET_TOKEN", token); // actions in mutations
      }
      if (!state.token) {
        return;
      }

      // set user information
      try {
        // const response = await axios.get("auth/profile", {
        //     headers: {
        //         Authorization: "Bearer " + token
        //     }
        // });
        //we need here Authorization token. But we will capture it throw axios headers global variable subscriber.js
        const response = await axios.get("/me");
        commit("SET_USER", response.data);
      } catch (e) {
        commit("SET_TOKEN", null);
        commit("SET_USER", null);
      }
    },

    signOut({ commit }) {
      return axios.post("/logout").then(() => {
        commit("SET_TOKEN", null);
        commit("SET_USER", null);
      });
    }
  }
};
