<template>
    <div class="flexWrap">
          <div class="profilePicWrapper">
            <router-link :to="`/${userHandle}`">
              <div v-if="userProfilePic !== null || userProfilePic === ''" class="profilePhotoContainer">
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

              <div v-show="userPostPhoto !== undefined && userPostPhoto !== null" class="postImage">
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
export default {
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

}
</script>
