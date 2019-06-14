<template>
  <section id="timeline">
      <div class="col1">
        <div class="profile">
          <div class="userDisplay">
            <div class="postPhotoContainer">
              <div v-if="userProfile.profilePic">
                <img :src="userProfile.profilePic" alt="" style="height: 100%; width: 100%; object-fit: cover" >
              </div>
              <div v-else>
                <img src="../assets/images/default.png" alt="" style="height: 100%; width: 100%; object-fit: cover">
              </div>
            </div>
            <div style="margin-left: 8px;">
              <span class="displayName">{{userProfile.displayName}}</span>
              <p>{{'@' + userProfile.handle}}</p>
            </div>
          </div>
          <div class="create-post">
            
            <form @submit.prevent>
                <chattbox v-model="post.content"></chattbox>
                <br>
                <div v-if="post.tweetPic" style="max-width:260px; max-height: 160px; overflow: hidden;">
                  <img :src="post.tweetPic" alt="image to upload" style="height: auto; width: 100%; object-fit: cover; border-radius: 4px; border: 1px solid #657787;">
                </div>
              <input
                type="file"
                accept="image/*"
                :multiple="false"
                @change="detectFiles($event)"
                ref="tweetImage"
                style="display: none"
              >
        
              <div class="postButtons">
                <div class="photoButtonWrapper" @click="$refs.tweetImage.click()">
                  <i class="fas fa-camera-retro"></i>
                </div>
                <button @click="createPost" :disabled="post.content == '' || post.content.length > 280" class="button">Chatt</button>
              </div>
            </form>
          </div>
        <div v-show="progressUpload" class="progressBar" :style="{ width: progressUpload + '%'}">{{ progressUpload }}</div>
        </div>
      </div>

      <!-- TimeLine -->

      <div class="col2">

        <!-- Show new Posts button -->

        <transition class="fade">
          <div v-if="hiddenPosts.length" @click="showNewPosts" class="hidden-posts">
            <p>
              <i class="fas fa-long-arrow-alt-up"></i> See new Chats
            </p>
          </div>
        </transition>

        <!-- Posts List -->

        <div v-if="posts.length">
          <div :key="post.id" v-for="post in posts" class="post">

            <div class="flexWrap">
              <div class="profilePicWrapper">
                <router-link :to="{name: 'UserProfile', params: {handle: post.user.handle}}">
                  
                  <div v-if="post.user.profilePic !== null" class="profilePhotoContainer">
                    <img
                      :src="post.user.profilePic"
                      style="height: 100%; width: 100%; object-fit: cover"
                    >
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
                      <router-link :to="{name: 'UserProfile', params: {handle: post.user.handle}}">
                        <span class="displayName">
                          {{post.user.displayName}}
                          <p>{{'@' + post.user.handle}}</p> ・
                          <p class="timeAgo">{{post.createdOn | formatDate }}</p>
                        </span>
                      </router-link>
                      <div class="deletePost" v-if="currentUser.uid === post.userId">
                        <a @click="deletePost(post)">
                          <i class="fas fa-times-circle"></i>
                        </a>
                      </div>
                    </div>
                    <router-link :to="{name: 'ViewPost', params: {handle: `${post.user.handle}`, postId: `${post.id}`}}" style="">
                        <div class="postText">{{post.content}}</div>
                    </router-link>
                  </div>

                    
                  <div v-if="post.tweetPic" class="postImage">
                    <a @click="openImagePanePopup(post)">
                      <img :src="post.tweetPic" alt>
                    </a>
                  </div>

                </div>

                <div class="bottomButton">
                  <ul>
                    <li>
                      <a @click="addPostCommentPopup(post)">
                        <i class="fas fa-comment"></i>
                        {{post.comments}}
                      </a>
                    </li>
                    <li>
                      <a @click="likePost(post.id, post.likes)">
                        <i class="fas fa-heart"></i>
                        {{post.likes}}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
        </div>
        <div v-else>
          <p class="no-results">There are currently no posts</p>
        </div>

        <div v-if="showCommentPopup" class="p-modal">
          <div class="p-container">
          <div class="close__pane">
            <div class="close__button">
              <a @click="closePostCommentPopup">
                <i class="far fa-times-circle"></i>
              </a>
            </div>

            <div class="close__button-reply">
              <button @click="$refs.popUpReply.click()" :disabled="comment.content === ''" class="button">Reply</button>
            </div>

          </div>
            <div class="post">

            <AvatarDisplay
              :userHandle="postPopup.user.handle"
              :userDisplay="postPopup.user.displayName"
              :userProfilePic="postPopup.user.profilePic"
              :userContent="postPopup.content"
              :userPostPhoto="postPopup.tweetPic"
              :userCreated="postPopup.createdOn"
            />

            <form @submit.prevent class="postPopup">
              <textarea
                cols="30"
                rows="10"
                v-model="comment.content"
                placeholder="What's your reply?"
              ></textarea>
              <button @click="addComment" :disabled="comment.content === ''" class="button" ref="popUpReply" style="display: none;"></button>
            </form>
          </div>
          </div>
        </div>

        <div v-if="showImagePanePopup" class="p-modal">
          <ImagePanePopup
            :tweetPic="postPopup.tweetPic"
            :close="closeImagePanePopup"
            :imageCaption="postPopup.content"
          />
        </div>

      <!-- end of -->
      </div>   
  </section>
</template>

<script>
import { mapState } from "vuex";
import moment from "moment";

import AvatarDisplay from './AvatarDisplay'
import ImagePanePopup from './ImagePanePopup'
import Chattbox from './ChattBox';


const fb = require("../FirebaseConfig.js");

export default {
  name: `Timeline`, //OMG I just discovered $options.name for easier CSS naming
  components: {
    AvatarDisplay,
    ImagePanePopup,
    Chattbox
  },
  
  data() {
    return {
      post: {
        content: "",
        tweetPic: null,
        image: null
      },
      comment: {
        postCommentCount: 0,
        postId: "",
        userId: "",
        content: ""
      },
      showCommentPopup: false,
      showImagePanePopup: false,
      progressUpload: 0,
      postPopup: {},
      err_message: ""
    };
  },
  computed: {
    ...mapState(["userProfile", "currentUser", "posts", "hiddenPosts"])
  },
  methods: {
    createPost() {
        const {handle, displayName, profilePic, location} = this.userProfile
        const {tweetPic, content, image} = this.post
        this.$store.dispatch('ADD_POST', {
          userId: this.currentUser.uid,
          content,
          image,
          likes: 0,
          comments: 0,
          createdOn: new Date(),
          user: {handle, displayName, profilePic, location}
        })
        this.post.content = "";
        this.post.tweetPic = null;
        this.post.image = null
    },
    showNewPosts() {
      const updatedPosts = this.hiddenPosts.concat(this.posts);
      this.$store.commit("setHiddenPosts", null);
      this.$store.commit("setPosts", updatedPosts);
    },
    closePostCommentPopup() {
      this.comment.postId = "";
      this.comment.userId = "";
      this.comment.content = "";
      this.showCommentPopup = false;
    },
    addPostCommentPopup(post) {
      this.showCommentPopup = true;
      this.postPopup = post;
      this.comment.postId = post.id;
      this.comment.userId = post.userId;
      this.comment.postCommentCount = post.comments;  
    },
    openImagePanePopup(post){
      this.showImagePanePopup = true;
      this.postPopup = post;
    },
    closeImagePanePopup() {
      this.showImagePanePopup = false;
    },
    addComment() {
      const {postId, postCommentCount, content} = this.comment
      const {handle, displayName, profilePic} = this.userProfile
      console.log(this.comment, this.userProfile)
      this.$store.dispatch('SAVE_COMMENT', {
        userId: this.currentUser.uid,
        postId: postId,
        postComment: postCommentCount,
        content: content,
        createdOn: new Date().toISOString(),
        user: {handle, displayName, profilePic}
      }).then(() => {
          this.closePostCommentPopup();
        });
    },
    likePost(postId, likes) {
      const docId = `${this.currentUser.uid}_${postId}`;
      this.$store.dispatch('ADD_LIKE', {
        docId, postId, likes
      })
    },
    deletePost(post) {
      this.$store.dispatch('DELETE_POST', post.id)
    },
    detectFiles(e) {
      let fileList = e.target.files || e.dataTransfer.files;
      let fileName = fileList[0].name;
      if (fileName.lastIndexOf('.') <= 0) {
        this.err_message = "File type is not valid"
      }

      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.post.tweetPic = fileReader.result;
      })
      fileReader.readAsDataURL(fileList[0])
      this.post.image = fileList[0]

      // Array.from(Array(fileList.length).keys()).map(x => {
      //   this.upload(fileList[x]);
      // });
    },
    // upload(file) {
    //   const randomHex = Math.random()
    //     .toString(17)
    //     .slice(2, 14);
      
    //   const preFix = Math.random()
    //     .toString(18)
    //     .slice(2,5)

    //   const timeStamp = moment(new Date()).format('YYYY')

    //   this.uploading = true;
    //   this.uploadTask = fb.storage
    //     .child(
    //       `${this.currentUser.uid}` +
    //         "/tweet_images/" + `${timeStamp}` + "/" +
    //         `${preFix}${randomHex}`
    //     )
    //     .put(file);
    // }
  },
  watch: {
    uploadTask: function() {
      this.uploadTask.on(
        "state_changed",
        sp => {
          this.progressUpload = Math.floor(
            (sp.bytesTransferred / sp.totalBytes) * 100
          );
          console.log(this.progressUpload);
        },
        null,
        () => {
          this.uploadTask.snapshot.ref.getDownloadURL().then(tweetPic => {
            this.post.tweetPic = tweetPic;
            this.uploadEnd = true;
            console.log(tweetPic);
            // this.$store.dispatch('PostTweetPhoto', {profilePic: this.profilePic !== '' ? this.profilePic : this.userProfile.profilePic})
            setTimeout(() => {
              this.uploadEnd = false;
            }, 2500);
          });
        }
      );
    }
  },
  filters: {
    formatDate(val) {
      if (!val) return "-";
      let date = val.toDate();
      return moment(date).fromNow();
    }
  }
};
</script>

<style lang="scss">
.photoButtonWrapper {
  .fas {
    color: white;
  }
}
.progressBar {
  margin: 10px 0;
  background: #179bb5;
}

.close__pane {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin: 1rem;
}

.p-modal {
  .p-container {
    .post {
      padding: 0;
      border-bottom: none !important;
    }
  }
}

.profile {
  .userDisplay {
    display: flex;
    align-items: flex-end;
    margin-bottom: 10px;
  }
  .postPhotoContainer {
      max-height: 40px;
      max-width: 40px;
  }
}



</style>
