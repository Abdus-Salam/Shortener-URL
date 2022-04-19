<template>
  <v-app
    id="inspire"
    style="font-family: Helvetica Neue, Helvetica, Arial, sans-serif !important"
  >
    <template v-if="authenticated">
      <v-navigation-drawer
        v-model="drawer"
        app
        clipped
        style="width: 270px !important"
      >
        <v-list dense style="padding: 3px 0px">
          <template v-for="item in items">
            <!-- v-model="item.model" -->
            <v-list-group
              v-if="item.children"
              :key="item.title"
              :prepend-icon="item.model ? item.icon : item.icon2"
              :append-icon="item.icon3"
              active-class="highlighted"
              :class="item.path === $route.path ? 'highlighted' : ''"
              class="menu_link"
              :value="expandCollapse(item.children, $route.path)"
            >
              <v-list-item slot="activator" :to="item.route" style="padding: 0">
                <v-list-item-content>
                  <v-list-item-title class="menu_list_item_title">{{
                    item.title
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <template v-for="(child, i) in item.children">
                <v-list-item
                  v-if="child.access"
                  :key="i"
                  :to="child.route"
                  link
                  active-class="highlighted"
                  :class="item.path === $route.path ? 'highlighted' : ''"
                  class="menu_link"
                >
                  <v-list-item-icon
                    v-if="child.icon"
                    style="padding-left: 20px"
                  >
                    <v-icon>{{ child.icon }}</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title class="menu_list_item_title">
                      {{ child.title }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-list-group>
            <v-list-item
              v-else-if="item.access"
              link
              :key="item.title"
              :to="item.route"
              active-class="highlighted"
              :class="item.path === $route.path ? 'highlighted' : ''"
              class="menu_link"
            >
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title class="menu_list_item_title">{{
                  item.title
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
      </v-navigation-drawer>
    </template>

    <v-app-bar color="siteColor" dark app clipped-left height="60px">
      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
        text
        v-if="authenticated"
      ></v-app-bar-nav-icon>
      <v-toolbar-title class="siteName"
        >Laravel - VueJS URLs Shortener</v-toolbar-title
      >
      <v-spacer></v-spacer>

      <v-toolbar-items>
        <v-btn
          text
          v-if="authenticated"
          @click.prevent="signOut"
          class="text-capitalize"
        >
          <v-icon>person</v-icon> {{ user.first_name }} {{ user.last_name }}
        </v-btn>
        <v-btn text to="/login" v-else class="loginText">Login</v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-main>
      <div class="pa-md-5">
        <router-view></router-view>
      </div>
    </v-main>

    <v-footer app color="siteColor white--text">
      <v-flex class="text-center">
        <span style="color:white">
          Copyright @{{ new Date().toISOString().substr(0, 4) }}.
        </span>
      </v-flex>
    </v-footer>
  </v-app>
</template>

<style scoped>
.menu_link:hover {
  text-decoration: none !important;
}
.menu_link a {
  color: #383737;
}

.menu_list_item_title {
  font-size: 15px !important;
}
.highlighted {
  color: #0055a9 !important;
}

/* For Mobile */
@media screen and (max-width: 480px) {
  .siteName {
    font-size: 12px;
    padding-left: 10px;
  }

  .loginText {
    font-size: 12px;
  }
}

/* For Tablets */
@media screen and (min-width: 481px) and (max-width: 780px) {
  .siteName {
    font-size: 20px;
  }
}
</style>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      drawer: true,
      fullscreen: false,
      items: [
        {
          title: "Dashboard",
          icon: "mdi-home",
          route: "/",
          name: "dashboard",
          access: true,
        },

        {
          title: "Products",
          icon: "mdi-blur",
          route: "/products",
          name: "product",
          access: true,
        },
      ],
    };
  },

  mounted() {
    //
  },

  computed: {
    ...mapGetters({
      authenticated: "Auth/authenticated",
      user: "Auth/user",
    }),
  },

  methods: {
    ...mapActions({
      signOutAction: "Auth/signOut",
    }),

    signOut() {
      this.signOutAction().then(() => {
        this.$router.replace({ name: "login" }); // need default home page
      });
    },

    expandCollapse(currentSetOfRoute, currentRoute) {
      let flag = false;
      for (let i = 0; i < currentSetOfRoute.length; i++) {
        const route = currentSetOfRoute[i].route;
        if (route == currentRoute) {
          flag = true;
        }
      }

      return flag;
    },
  },
};
</script>

<style scoped></style>
