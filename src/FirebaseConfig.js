// Flashbacks to the hour plus I spent setting this up for my Ledgr project only to realize dyslexia was the culprit.

import firebase from "firebase";
import "firebase/firebase";

var firebaseConfig = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_DATABASE_URL,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_APP_ID
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Utilities
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage().ref();
const currentUser = auth.currentUser;

// Collections
const userCollection = db.collection("users");
const postCollection = db.collection("posts");
const likesCollection = db.collection("likes");
const commentsCollection = db.collection("comments");
const bookmarksCollection = db.collection("bookmarks");

export {
  db,
  auth,
  storage,
  currentUser,
  userCollection,
  postCollection,
  likesCollection,
  commentsCollection,
  bookmarksCollection
};
