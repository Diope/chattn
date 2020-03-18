import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Vuelidate from "vuelidate";

import { store } from "./store";
import { sync } from "vuex-router-sync";
import "./assets/scss/main.scss";
import moment from "moment";
import './registerServiceWorker';
const fb = require("./FirebaseConfig.js");

Vue.config.productionTip = false;

Vue.filter("FormatDate", function(val) {
  if (!val) return "";
  let date = moment(val).toDate();
  return moment(date).fromNow();
});

let app;
Vue.use(Vuelidate);
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
