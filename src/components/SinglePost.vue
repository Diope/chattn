<template>
    <div id="SinglePost" v-if="displayName !== undefined">

      <div class="post">
        <AvatarDisplay
          :userHandle="handle"
          :userDisplay="displayName"
          :userProfilePic="profilePic"
          :userCreated="createdOn"
          :userPostPhoto="tweetPic"
          :postCount="postComments.length"
          :postId="postId"
          :likes="likes"
          :userContent="content"
        >

        </AvatarDisplay>
        

    <div class="comment__container">
      <form @submit.prevent>
      <div class="comment__textarea">
        <textarea
          cols="30"
          rows="10"
          v-model="comment.content"
          placeholder="What's happening"
        ></textarea>
      </div>
        <button @click="addComment" :disabled="comment.content === ''" class="button comment__button">Reply</button>
      </form>
    </div>
    <div v-show="postComments.length" class="comment_pane">
        <div :key="comment.id" v-for="comment in postComments" class="comments">
          <AvatarDisplay
            :userProfilePic="comment.user.profilePic"
            :userHandle="comment.user.handle"
            :userDisplay="comment.user.displayName"
            :userCreated="comment.createdOn"
            :userContent="comment.content"
          ></AvatarDisplay>
          <!-- <div class="profilePicWrapper">
            <div v-if="comment.user.profilePic" class="profilePhotoContainer">
              <img :src="comment.user.profilePic" alt="" style="height: 100%; width: 100%; object-fit: cover">
            </div>
            <div v-else class="profilePhotoContainer">
              <img src="../assets/images/default.png" alt="" style="height: 100%; width: 100%; object-fit: cover">
            </div>
          </div>


          <span class="userDisplay">
            <router-link :to="`/${comment.user.handle}`">
              <span class="displayName">
                {{comment.user.displayName}} {{'@' + comment.user.handle}}
              </span> ・ {{comment.createdOn | formatDate}}
            </router-link>
          </span> -->
        </div>
    </div>
  </div>
    </div>


  <div v-else class="col1">
    <div style="text-align: center; padding: 5rem; background: white; margin-top: 2.5rem; width: 70%; margin: 5vh auto 0;">
      <h2>Sorry, that page doesn’t exist!</h2>
      <p><router-link to="/timeline"> Click here to return home</router-link></p>
    </div>
  </div>
  
</template>


<script>
import moment from "moment";
import { mapState, mapActions } from "vuex";
import AvatarDisplay from "./AvatarDisplay"
const fb = require("../FirebaseConfig");
export default {
  components: {
    AvatarDisplay
  },
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
    
    addComment() {
      const {handle, displayName, postId, profilePic} = this.$props
      const postCommentCount = this.comment.postCommentCount = this.postComments.length
      this.$store.dispatch('SAVE_COMMENT', {
        userId: this.currentUser.uid,
        postId: postId,
        content: this.comment.content,
        createdOn: new Date(),
        postComment: postCommentCount,
        user: {handle, displayName, profilePic}
      })
      this.comment.content = ''      
    },
  }
};
</script>

<style lang="scss">
  .comments {
    margin-bottom: 25px;
  }

  li .bottomButton .fas {
    font-size: 1.2rem;
  }

  
  
</style>
