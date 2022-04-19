import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import axios from "axios";
require("./store/subscriber");

Vue.config.productionTip = false;
axios.defaults.baseURL = "http://127.0.0.1:8000/api/auth";

// use token of localstorage for re authenticate
// refresh my web page authenticate successfull
store.dispatch("Auth/attempt", localStorage.getItem("token")).then(() => {
  new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
  }).$mount("#app");
});
