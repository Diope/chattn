import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { store } from "./store";
import { sync } from 'vuex-router-sync'

import "./assets/scss/main.scss";

const fb = require("./FirebaseConfig.js");

Vue.config.productionTip = false;

let app;

// eslint-disable-next-line no-unused-vars
fb.auth.onAuthStateChanged(user => {
  if (!app) {
    sync(store, router);
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount("#app");
  }
});
