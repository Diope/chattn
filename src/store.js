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
    comments: [],
    hiddenPosts: [],
    requestedUser: {},
    userPosts: [],
    singlePostComments: {}
  },
  getters: {},
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
      commit("setPosts");
      commit("setRequestedProfile", {});
      commit("setUserPosts");
    },
    updateProfileBanner({ commit, state }, data) {
      const { profileBanner, user } = data;
      fb.userCollection
        .doc(user)
        .update({ profileBanner })
        .catch(err => {
          console.log(err.message);
        });
    },
    updateProfilePhoto({ commit, state }, data) {
      const { profilePic, profileBanner } = data;
      fb.userCollection
        .doc(state.currentUser.uid)
        .update({ profilePic })
        .then(user => {
          fb.postCollection
            .where("userId", "==", state.currentUser.uid)
            .get()
            .then(docs => {
              docs.forEach(doc => {
                fb.postCollection.doc(doc.id).update({
                  "user.profilePic": profilePic
                });
              });
            });
          fb.commentsCollection
            .where("userId", "==", state.currentUser.uid)
            .get()
            .then(docs => {
              docs.forEach(doc => {
                fb.commentsCollection.doc(doc.id).update({
                  user: { profilePic: profilePic }
                });
              });
            });
        })
        .catch(err => {
          console.log(err);
        });
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
                  "user.displayName": displayName,
                  "user.handle": handle,
                  "user.location": location
                });
              });
            });
          fb.commentsCollection
            .where("userId", "==", state.currentUser.uid)
            .get()
            .then(docs => {
              docs.forEach(doc => {
                fb.commentsCollection.doc(doc.id).update({
                  user: {
                    "user.displayName": displayName,
                    "user.handle": handle,
                    "user.location": location
                  }
                });
              });
            });
        })
        .catch(err => {
          console.log(err);
        });
    },
    SAVE_COMMENT: async ({ commit, state }, data) => {
      const { userId, postId, content, createdOn, postComment, user } = data;
      // const postId = this.comment.postId;
      // const postCommentCount = this.comment.postCommentCount;

      fb.commentsCollection
        .add({
          postId: postId,
          content: content,
          userId: userId,
          user: user,
          createdOn: createdOn
        })
        .then(doc => {
          fb.postCollection.doc(postId).update({
            comments: postComment + 1
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    ADD_POST: async ({ commit }, data) => {
      const {
        userId,
        content,
        tweetPic,
        likes,
        comments,
        createdOn,
        user
      } = data;
      fb.postCollection.add({
        userId,
        likes,
        content,
        comments,
        tweetPic,
        user,
        createdOn
      });
    },
    ADD_LIKE: async ({ commit, state }, data) => {
      const { docId, postId, likes } = data;
      fb.likesCollection
        .doc(docId)
        .get()
        .then(doc => {
          if (doc.exists) {
            return;
          }
          fb.likesCollection
            .doc(docId)
            .set({
              postId: postId,
              userId: state.currentUser.uid
            })
            .then(() => {
              fb.postCollection.doc(postId).update({
                likes: likes + 1
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
    setComments(state, value) {
      state.comments = value;
    },
    setRequestedProfile(state, value) {
      state.requestedUser = value;
    },
    setUserPosts(state, value) {
      state.userPosts = value;
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
