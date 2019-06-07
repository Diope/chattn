// Flashbacks to the hour plus I spent setting this up for my Ledgr project only to realize dyslexia was the culprit.

import firebase from "firebase";
import "firebase/firebase";

var firebaseConfig = {
  apiKey: " ",
  authDomain: " ",
  databaseURL: " ",
  projectId: " ",
  storageBucket: " ",
  messagingSenderId: " ",
  appId: " "
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

export {
  db,
  auth,
  storage,
  currentUser,
  userCollection,
  postCollection,
  likesCollection,
  commentsCollection
};
