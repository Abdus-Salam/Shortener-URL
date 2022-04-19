<template>
  <v-container>
    <v-card class="pa-7" :elevation="6" width="400px" style="margin: 0 auto">
      <v-alert
        type="error"
        v-if="validationErrorFlag"
        color="error"
        border="left"
        dismissible
        dense
        >* Please fill the required field.</v-alert
      >
      <v-form @submit.prevent="authenticate" ref="loginForm">
        <v-text-field
          v-model="editedItem.email_address"
          label="Mobile number or email address *"
          :rules="[v => !!v || 'The field is required.']"
          required
          outlined
          dense
          filled
          autocomplete="off"
        ></v-text-field>

        <v-text-field
          v-model="editedItem.password"
          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="[passwordRules.required]"
          :type="show1 ? 'text' : 'password'"
          name="password"
          label="Password *"
          counter
          @click:append="show1 = !show1"
          outlined
          dense
          filled
          autocomplete="off"
        ></v-text-field>

        <div class="text-md-center">
          <v-btn
            class="text-capitalize"
            color="primary"
            type="submit"
            @click="login()"
            ><h2>Log In</h2></v-btn
          >
        </div>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      endpoints: "/login",
      backendValidationErrorFlag: false,
      validationErrorFlag: false,
      show1: false,
      passwordRules: {
        required: value => !!value || "Password field is required.",
      },

      editedItem: {
        email_address: "admin@gmail.com",
        password: "Bangla71",
      },
    };
  },

  created() {
    setTimeout(() => {
      this.backendValidationErrorFlag = false;
    }, 5000);

    setTimeout(() => {
      this.validationErrorFlag = false;
    }, 10000);
  },

  methods: {
    login() {
      this.$refs.loginForm.validate();
    },

    ...mapActions({
      // comes from auth.ts / signIn
      signInMethod: "Auth/signIn",
    }),

    authenticate() {
      if (this.$refs.loginForm.validate()) {
        this.signInMethod(this.editedItem)
          .then(() => {
            this.$router.replace({ name: "Home" });
          })
          .catch(() => {
            this.snackbar = true;
          });
      }
    },
  },
};
</script>

<style scoped>
.menuBtnColor > span > a {
  color: #fff !important;
  text-decoration: none;
}
</style>
