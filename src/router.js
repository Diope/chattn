import Vue from "vue";
import Router from "vue-router";
import firebase from "firebase";
const fb = require("./FirebaseConfig");

import Timeline from "@/components/Timeline";
import Login from "@/components/Login";
import ViewPost from "@/components/ViewPost";
import Settings from "@/components/Settings";
import UserProfile from "@/components/UserProfile";
import PageNotFound from "@/components/PageNotFound";
// import Home from "@/components/Home";
// import SinglePost from "@/components/SinglePost";

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "*",
      name: "PageNotFound",
      component: PageNotFound
    },
    {
      path: "/",
      name: "Home",
      component: Timeline,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "/timeline",
      name: "Timeline",
      component: Timeline,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/settings",
      name: "Settings",
      component: Settings,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/:handle",
      name: "UserProfile",
      component: UserProfile,
      props: true,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/:handle/status/:postId",
      name: "ViewPost",
      component: ViewPost,
      meta: {
        requiresAuth: true
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth);
  const currentUser = firebase.auth().currentUser;
  // const requestedUser = router.currentRoute.params.handle;

  // fb.userCollection
  //   .where("handle", "==", requestedUser)
  //   .get()
  //   .then(res => {
  //     if (res.empty) {
  //       next("/dashboard");
  //     }
  //   });

  if (requiresAuth && !currentUser) {
    next("/login");
  } else if (requiresAuth && currentUser) {
    next();
  } else {
    next();
  }
});

export default router;
