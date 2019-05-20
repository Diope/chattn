import Vue from "vue";
import Router from "vue-router";
import firebase from "firebase";
const fb = require("./FirebaseConfig");

import Dashboard from "./components/Dashboard.vue";
import Login from "./components/Login.vue";
import Settings from "./components/Settings.vue";
import UserProfile from "./components/UserProfile.vue";
import PageNotFound from "./components/PageNotFound.vue";

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "*",
      name: PageNotFound,
      component: PageNotFound
    },
    {
      path: "/",
      component: Dashboard,
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
      path: "/dashboard",
      name: "Dashboard",
      component: Dashboard,
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
      path: "/u/:id",
      name: "UserProfile",
      component: UserProfile,
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
