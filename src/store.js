import Vue from "vue";
import Vuex from "vuex";

const fb = require("./FirebaseConfig");

Vue.use(Vuex);

fb.auth.onAuthStateChanged(user => {
  if (user) {
    store.commit("setCurrentUser", user);
    store.dispatch("fetchUserProfile");
  }
});

export const store = new Vuex.Store({
  state: {
    currentUser: null,
    userProfile: {}
  },
  mutations: {
    setCurrentUser(state, value) {
      state.currentUser = value;
    },
    setUserProfile(state, value) {
      state.userProfile = value;
    }
  },
  actions: {
    fetchUserProfile({ commit, state }) {
      fb.userCollection
        .doc(state.currentUser.uid)
        .get()
        .then(res => {
          commit("setUserProfile", res.data());
        })
        // eslint-disable-next-line no-console
        .catch(err => console.log(err));
    },
    clearData({ commit }) {
      commit("setCurrentUser", null);
      commit("setUserProfile", {});
    }
  }
});
