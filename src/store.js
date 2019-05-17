/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import Vue from "vue";
import Vuex from "vuex";
import router from "./router";

const fb = require("./FirebaseConfig");

Vue.use(Vuex);

fb.auth.onAuthStateChanged(user => {
  if (user) {
    // user should be signed in
    store.commit("setCurrentUser", user);
    store.dispatch("fetchUserProfile");

    fb.userCollection.doc(user.uid).onSnapshot(doc => {
      store.commit("setUserProfile", doc.data());
    });

    // grab posts from post collection
    fb.postCollection.orderBy("createdOn", "desc").onSnapshot(posts => {
      let currentUserPosts;

      if (posts.docs.length) {
        // console.log(store.state.currentUser.uid);
        // console.log(posts.docChanges()[0].doc.data().userId);
        currentUserPosts =
          store.state.currentUser.uid ===
          posts.docChanges()[0].doc.data().userId
            ? true
            : false;
      }

      // add new posts to hiddenPost array after first load

      // console.log(posts.docChanges()[0].doc.data());
      // console.log(currentUserPosts);

      // console.log(
      //   posts.docChanges().length !== posts.size &&
      //     posts.docChanges()[0].type === "added" &&
      //     currentUserPosts
      // );

      // Okay so the idea is that the feed updates posts for the user but for other users they have to hit the "see new tweets" button just like on twitter.
      if (
        posts.docChanges().length !== posts.size &&
        posts.docChanges()[0].type === "added" &&
        !currentUserPosts
      ) {
        console.log("Yatta");

        let hidPost = posts.docChanges()[0].doc.data();
        hidPost.id = posts.docChanges()[0].doc.id;
        // console.log("hidPost data", hidPost, "hidPost id", hidPost.id);
        // const hiddenPost = posts.docChanges()[0].doc.data();
        // hiddenPost.id = posts.docChanges()[0].doc.id;
        store.commit("setHiddenPosts", hidPost);

        // store.commit("setHiddenPosts", hiddenPost);
      } else {
        const postsArray = [];

        posts.forEach(doc => {
          const post = doc.data();
          post.id = doc.id;
          postsArray.push(post);
        });
        store.commit("setPosts", postsArray);
      }
    });
  }
});

export const store = new Vuex.Store({
  state: {
    currentUser: null,
    userProfile: {},
    posts: [],
    hiddenPosts: [],
    requestedUser: "",
    returnedUser: {}
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
    findProfile({ commit, state }) {
      let user = router.currentRoute.params.id;

      fb.userCollection
        .doc(state.requestedUser)
        .get()
        .then(res => {
          commit("setRequestedProfile2", res.data());
        })
        .catch(err => console.log(err.message));
    },
    clearData({ commit }) {
      commit("setCurrentUser", null);
      commit("setUserProfile", {});
      commit("setPosts");
      commit("setRequestedProfile", {});
    },
    updateProfile({ commit, state }, data) {
      const { displayName, handle, location, bio, website, birth } = data;

      fb.userCollection
        .doc(state.currentUser.uid)
        .update({ displayName, handle, location, bio, website, birth })
        .then(user => {
          fb.postCollection
            .where("userId", "==", state.currentUser.uid)
            .get()
            .then(docs => {
              docs.forEach(doc => {
                fb.postCollection.doc(doc.id).update({
                  displayName: displayName,
                  handle: handle,
                  location: location
                });
              });
            });
          fb.commentsCollection
            .where("userId", "==", state.currentUser.uid)
            .get()
            .then(docs => {
              docs.forEach(doc => {
                fb.commentsCollection.doc(doc.id).update({
                  displayName: displayName,
                  handle: handle,
                  location: location
                });
              });
            });
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  mutations: {
    setCurrentUser(state, value) {
      state.currentUser = value;
    },
    setUserProfile(state, value) {
      state.userProfile = value;
    },
    setPosts(state, value) {
      state.posts = value;
    },
    setRequestedProfile(state, value) {
      state.requestedUser = value;
    },

    setHiddenPosts(state, value) {
      if (value) {
        // console.log((!state.hiddenPosts.some(post => post.id === value.id))
        if (!state.hiddenPosts.some(post => post.id === value.id)) {
          state.hiddenPosts.unshift(value);
        }
      } else {
        state.hiddenPosts = [];
      }
    }
  }
});
