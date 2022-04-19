<template>
  <div>
    <v-snackbar
      v-model="snackbar"
      :color="color"
      :multi-line="mode === 'multi-line'"
      :timeout="timeout"
      :top="true"
      :vertical="mode === 'vertical'"
    >
      {{ snackbarText }}
      <v-btn text @click="snackbar = false" style="color:white;">Close</v-btn>
    </v-snackbar>
    <v-data-table
      :headers="headers"
      :items="itemsWithSno"
      :server-items-length="totalItems"
      :options.sync="pagination"
      :loading="loading"
      class="elevation-4"
      :footer-props="{
        itemsPerPageOptions: [10, 20, 30, 50, 100, -1],
      }"
      :items-per-page="10"
      @page-count="pageCount = $event"
      hide-default-footer
    >
      <template v-slot:[`item.status_to_string`]="{ item }">
        <v-chip color="green" text-color="white" v-if="item.status == 1">
          {{ item.status_to_string }}
        </v-chip>
        <v-chip color="red" text-color="white" v-if="item.status == 0">
          {{ item.status_to_string }}
        </v-chip>
      </template>

      <template v-slot:[`item.fulluser`]="{ item }">
        <span>{{ item.user_type }} ({{ item.user_name }}) </span>
      </template>

      <!-- table top header -->
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-card color="red" class="elevation-6 pa-2 mr-4 mb-10 ml-0">
            <v-icon dark style="font-size: 48px">mdi-blur</v-icon>
          </v-card>
          <h4 class="siteDataTableHeading">All Items</h4>
          <v-spacer></v-spacer>
          <v-btn class="mx-2" fab dark color="siteColor" @click="dialog = true">
            <v-icon dark>mdi-plus</v-icon>
          </v-btn>
          <!-- dialog -->
          <v-dialog v-model="dialog" max-width="600px">
            <v-card>
              <v-card-title class="headline grey lighten-2 mb-2" primary-title
                >Create New Shortener URL</v-card-title
              >
              <v-card-text>
                <v-form ref="form">
                  <v-text-field
                    v-model="editedItem.original_url"
                    :rules="[v => !!v || 'Title field is required']"
                    label="Enter Valid URL *"
                    required
                    outlined
                    dense
                    autocomplete="off"
                    @change="createShortenerUrl()"
                  ></v-text-field>
                  <v-text-field
                    v-model="editedItem.hash"
                    label="Hash"
                    required
                    outlined
                    dense
                    autocomplete="off"
                    readonly
                    disabled
                  ></v-text-field>
                  * Enter the valid url and mouse cursor move to generate shortener url. <br>
                  * Click submit button for saving data to DB
                </v-form>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" class="my-2" @click="close">Close</v-btn>
                <v-btn color="primary" class="my-2" @click="save" :disabled="isComplete">Submit</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- ./dialog -->
        </v-toolbar>
      </template>
      <!-- ./ table top header -->
    </v-data-table>
  </div>
</template>

<style scoped>
.v-pagination__item {
  display: none;
}
.v-pagination__more {
  display: none;
}
</style>
<script>
import axios from "axios";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      endpoints: "/urls/",
      snackbar: false,
      color: "#ff0000",
      mode: "",
      timeout: 5000,
      snackbarText: "Unauthorized",
      dialog: false,
      loading: true,
      totalItems: 0,
      pageCount: 0,
      items: [],
      pagination: {}, // options for combined object for pagination
      headers: [
        { text: "Shortener", value: "shortener_url" },
        { text: "Redirect URL", value: "original_url" },
      ],

      previewImages: "",

      editedIndex: -1,
      editedItem: {
        id: "",
        original_url: "",
        hash: "",
      },
      defaultItem: {
        id: "",
        original_url: "",
        hash: "",
      },
    };
  },


  

  computed: {
    isComplete () {
      if(this.editedItem.hash == ''){
          return true;
      }else{
          return false;
      }
    },

    itemsWithSno() {
      return this.items.map((d, index) => ({ ...d, sno: index + 1 }));
    },
    ...mapGetters({
      authenticated: "Auth/authenticated",
      user: "Auth/user",
    }),
  },

  watch: {
    pagination: {
      handler() {
        this.getDataFromApi().then(response => {
          this.items = response.items;
          this.totalItems = response.total;
        });
      },
      deep: true,
    },
  },

  methods: {

    createShortenerUrl(){
        const formData = new FormData();
        formData.append("_method", "post");
        formData.append("id", this.editedItem.id);
        formData.append("original_url", this.editedItem.original_url);
        formData.append("hash", this.editedItem.hash);

        axios
        .post("/createUrls", formData, {
            useCredentails: true,
        })
        .then((response) => {
            if(response.data.success == false){
                this.color = "red";
                this.snackbarText = "This shortener url already generated! Try again";
                this.snackbar = true;
            }else{
                this.editedItem.hash = response.data.data
            }
        })
        .catch(() => {
            //console.log(err);
        })
    },
    
    close() {
      this.dialog = false;
      this.$refs.form.reset();
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
      this.getDataFromApi().then(response => {
        this.items = response.items;
        this.totalItems = response.total;
      });
    },
    save() {
      const isValid = this.$refs.form.validate();
      if (isValid) {
        const formData = new FormData();
        formData.append("_method", "post");
        formData.append("id", this.editedItem.id);
        formData.append("original_url", this.editedItem.original_url);
        formData.append("hash", this.editedItem.hash);
        axios
        .post(this.endpoints, formData, {
            useCredentails: true,
        })
        .then(() => {
            this.color = "green";
            this.snackbarText = "New shortener url created successfully!";
            this.snackbar = true;
        })
        .catch(() => {
            //console.log(err);
        })
        .then(() => {
            this.close();
        })
      }
    },
   
    getDataFromApi() {
      this.loading = true;
      return new Promise(resolve => {
        const { sortBy, descending } = this.pagination;

        let items;
        let total;
        axios.get(this.endpoints).then(response => {
          // Authorization token is sends by axois headers
          items = response.data.data;
          total = response.data.totalRecords;

          if (this.pagination.sortBy) {
            items = items.sort((a, b) => {
              const sortA = a[sortBy];
              const sortB = b[sortBy];

              if (descending) {
                if (sortA < sortB) {
                  return 1;
                } else {
                  if (sortA > sortB) {
                    return -1;
                  }
                }

                return 0;
              } else {
                if (sortA < sortB) {
                  return -1;
                } else {
                  if (sortA > sortB) {
                    return 1;
                  }
                }
                return 0;
              }
            });
          } // sort by pagination

          // if (itemsPerPage > 0) {
          //   items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage);
          // }

          this.loading = false;
          resolve({
            items,
            total,
          });
        });
      });
    },
  },
};
</script>