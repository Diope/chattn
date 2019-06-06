<template>
    <div class="flexWrap">
          <div class="profilePicWrapper">
            <router-link :to="`/${userHandle}`">
              <div v-if="userProfilePic" class="profilePhotoContainer">
                <img :src="userProfilePic" style="height: 100%; width: 100%; object-fit: cover">
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
                  <router-link :to="`/${userHandle}`">
                    <span class="displayName">
                      {{userDisplay}}
                      <p>{{'@' + userHandle}}</p> ・ 
                      <p class="timeAgo">{{userCreated | formatDate }}</p>
                    </span>
                  </router-link>
                </div>

                <div class="postText">{{userContent}}</div>
              </div>

              <div v-show="userPostPhoto" class="postImage">
                  <img :src="userPostPhoto" alt>
              </div>
            </div>

            <div v-show="likes !== undefined" class="bottomButton">
              <ul>
                <li>
                  <a>
                    <p>
                      <i class="fas fa-comment"></i>
                      {{postCount}}
                    </p>
                  </a>
                </li>
                <li>
                  <p>
                      <a @click="likePost(postId, likes)">
                      <i class="fas fa-heart"></i>
                      {{likes}}
                    </a>
                  </p>
                </li>
              </ul>
            </div>

          </div>
        </div>
</template>

<script>
import moment from 'moment';
import { mapState, mapActions } from 'vuex';
const fb = require('../FirebaseConfig')
export default {

  computed: {
    ...mapState(['currentUser'])
  },
  props: [
      "postCount",
      "userHandle",
      "userDisplay",
      "userContent",
      "userProfilePic",
      "userCreated",
      "userPostPhoto",
      "postId",
      "likes"
  ],
  filters: {
    formatDate(val) {
      if (!val) return "-";
      let date = val.toDate();
      return moment(date).fromNow();
    }
  },
  methods: {
    // ...mapActions(
    //   {likePost: 'likePost'}
    // ),

    likePost(postId, likes) {
      const docId = `${this.currentUser.uid}_${postId}`;
      this.$store.dispatch('ADD_LIKE', {
        docId, postId, likes
      })
    }
  }
  

}
</script>
