<template>
    <div id="SinglePost" v-if="displayName !== undefined">

      <div class="post">
        <div class="flexWrap">
          <div class="profilePicWrapper">
            <router-link :to="`/${handle}`">
              <div v-if="profilePic !== null" class="profilePhotoContainer">
                <img :src="profilePic" style="height: 100%; width: 100%; object-fit: cover">
              </div>
              <div v-else class="profilePhotoContainer">
                <img
                  src="../assets/images/default.png"
                  style="height: 100%; width: 100%; object-fit: cover"
                >
              </div>
            </router-link>
          </div>

          <div class="postMain">
            <div class="postContainer">
              <div class="postContent">
                <div class="userDisplay">
                  <router-link :to="`/${handle}`">
                    <span class="displayName">
                      {{displayName}}
                      <p>{{'@' + handle}}</p> ・ 
                      <p class="timeAgo">{{createdOn | formatDate }}</p>
                    </span>
                  </router-link>
                </div>

                <div class="postText">{{content}}</div>
              </div>

              <div v-if="tweetPic !== null" class="postImage">
                <img :src="tweetPic" alt>
              </div>
            </div>
            <div class="bottomButton">
              <ul>
                <li>
                  <!-- <a @click="openComments(post)"> -->
                    <i class="fas fa-comment"></i>
                    {{postComments.length}}
                  <!-- </a> -->
                </li>
                <li>
                  <a @click="likePost(postId, likes)">
                    <i class="fas fa-heart"></i>
                    {{likes}}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
    </div>

    <div class="c-container">
      <form @submit.prevent>
        <textarea
          cols="30"
          rows="10"
          v-model="comment.content"
          placeholder="What's happening"
        ></textarea>
        <button @click="addComment" :disabled="comment.content === ''" class="button">Reply</button>
      </form>
    </div>
    <div v-show="postComments.length" class="comment_pane">
        <div :key="comment.id" v-for="comment in postComments" class="comments">
          <div class="comment__user-display">{{comment.displayName}} {{'@' + comment.handle}} ・ {{comment.createdOn}}</div>
          <div class="comment__user-text">{{comment.content}}</div>
        </div>
    </div>
  </div>
  <div v-else class="col1">
    <div style="text-align: center; padding: 5rem; background: white; margin-top: 2.5rem; width: 70%; margin: 5vh auto 0;">
      <h2>Sorry, that page doesn’t exist!</h2>
      <p>Why not try a search to find something else?</p>
    </div>
  </div>
  
</template>


<script>
import moment from "moment";
import { mapState, mapActions } from "vuex";
const fb = require("../FirebaseConfig");
export default {
  data() {
    return {
      postComments: [],
      comment: {
        postCommentCount: 0,
        postId: "",
        userId: "",
        content: ""
      },
    }
  },
  created() {
    this.fetchComments()
  },
  props: [
    "profilePic",
    "postId",
    "createdOn",
    "content",
    "tweetPic",
    "displayName",
    "userId",
    "handle",
    "likes",
    "commentCount"
  ],
  computed: {
    ...mapState(["currentUser"])
  },
  filters: {
    formatDate(val) {
      if (!val) return "-";
      let date = val.toDate();
      return moment(date).fromNow();
    }
  },
  methods: {
    fetchComments() {
      fb.commentsCollection
        .where("postId", "==", this.$props.postId).orderBy("createdOn", 'desc').onSnapshot(querySnapshot => {
          let commentArr = [];
          querySnapshot.forEach(doc => {
            let comment = doc.data()
            comment.id = doc.id
            commentArr.push(comment)
          })
          this.postComments = commentArr;
          console.log(this.postComments);
        })
    },
    likePost(postId, postLikes) {
      const docId = `${this.currentUser.uid}_${postId}`;

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
              userId: this.currentUser.uid
            })
            .then(() => {
              fb.postCollection.doc(postId).update({
                likes: postComments + 1
              });
            });
        })
        .catch(err => {
          console.log(err);
        });
    },
    addComment() {
      const {handle, displayName, postId} = this.$props
      const pId = postId;
      const postCommentCount = this.comment.postCommentCount = this.postComments.length

      fb.commentsCollection
        .add({
          postId,
          content: this.comment.content,
          user: {userId:this.currentUser.uid, handle, displayName},
          createdOn: new Date()
        })
        .then(doc => {
          fb.postCollection
            .doc(postId)
            .update({
              comments: postCommentCount + 1
            })
            .then(() => {
              this.comment.content = ''
            });
        })
        .catch(err => {
          console.log(err);
        });
    },
  }
};
</script>

<style lang="scss">

  
  
</style>
