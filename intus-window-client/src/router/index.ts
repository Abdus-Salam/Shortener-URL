import Vue from "vue";
import store from "../store";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "@/components/Home.vue";
import Login from "@/components/Login.vue";
import ShorternerURL from "@/components/ShortenerUrls.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home
  },

  {
    path: "/login",
    name: "Login",
    component: Login
  },

  {
    path: "/urls",
    name: "ShorternerURL",
    component: ShorternerURL,
    beforeEnter: (to, from, next) => {
      document.title = "Shorterner URL";
      next();
    }
  }

  /* ./ end Settings part */

];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
