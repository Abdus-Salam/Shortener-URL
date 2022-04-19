import store from "../store";
import axios from "axios";
store.subscribe(mutation => {
  //console.log(mutation.type);
  switch (mutation.type) {
    case "Auth/SET_TOKEN":
      if (mutation.payload) {
        axios.defaults.headers.common["Authorization"] =
          "Bearer " + mutation.payload;
        // now store data in localStorage in browser
        //after refresh your web page token in store still in localstorage
        localStorage.setItem("token", mutation.payload);
      } else {
        axios.defaults.headers.common["Authorization"] = null;
        //set the null of localstorage value
        localStorage.removeItem("token");
      }
      break;
  }
});
