<template>
  <div>
    <v-card class="mx-auto" max-width="500">
      <v-toolbar color="indigo" dark flat>
        <v-btn icon dark @click="closeDialog()">
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <v-toolbar-title class="title font-weight-light"
          >Owner - {{ name }} Information</v-toolbar-title
        >
      </v-toolbar>
      <v-card-title>
        <v-icon large left>person</v-icon>
        <span class="title font-weight-light">{{ name }}</span>
      </v-card-title>

      <v-card-title>
        <v-icon large left>phone_iphone</v-icon>
        <span class="title font-weight-light">{{ mobile_no }}</span>
      </v-card-title>

      <v-card-title>
        <v-icon large left>email</v-icon>
        <span class="title font-weight-light">{{ email }}</span>
      </v-card-title>

      <v-card-title>
        <v-icon large left>house</v-icon>
        <span class="title font-weight-light">{{ farm_name }}</span>
      </v-card-title>

      <v-card-title>
        <v-icon large left>location_on</v-icon>
        <span class="title font-weight-light">{{ address }}</span>
      </v-card-title>
    </v-card>
  </div>
</template>

<script>
export default {
  props: ["name", "mobile_no", "email", "farm_name", "address"],

  methods: {
    closeDialog() {
      this.$emit("close-dialog");
    },
  },
};
</script>