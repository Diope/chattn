<template>
    <section :class="`${$options.name}`">
        <div class="col1">
            <div :class="`${$options.name}__header`">
                <h5>Bookmarks</h5>
                <span class="userhandle">@{{userProfile.handle}}</span>
            </div>
            <div class="book-body">
                <div v-if="userBookmarks.length">
                    <div :key="post.id" v-for="post in userBookmarks" class="post">

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
                          <p class="timeAgo">{{post.createdOn | FormatDate }}</p>
                        </span>
                      </router-link>
                      <!-- <div class="deletePost" v-if="currentUser.uid === post.userId">
                        <a @click="openDeleteConfirmPane(post)">
                          <i class="fas fa-times"></i>
                        </a>
                      </div> -->
                    </div>
                    <router-link :to="{name: 'ViewPost', params: {handle: `${post.user.handle}`, postId: `${post.id}`}}" style="">
                        <div class="postText">{{post.content}}</div>
                    </router-link>
                  </div>

                    
                  <div v-if="post.tweetPic" class="postImage">
                    <a @click="openImagePanePopup(post)">
                      <img class="lozad" :src="post.tweetPic" alt>
                    </a>
                  </div>

                </div>

                <div class="bottomButton">
                  <ul>
                    <!-- <li>
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
                    </li> -->
                    <li>
                      <a @click="removeBookmark(post)">
                        <i class="fas fa-bookmark"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
        </div>
        <div v-else style="text-align: center;">
          <p class="no-results">You have no bookmarks.</p>
        </div>
            </div>
        </div>
    </section>
</template>

<script>
import {mapState} from 'vuex'
import moment from 'moment'
import { currentUser } from '../FirebaseConfig';
const fb = require('../FirebaseConfig.js')
export default {
    name: 'Bookmarks',
    data() {
        return {
            userBookmarks: []
        }
    },
    created() {
        this.findUserBookmarks();
    },
    watch: {

    },
    computed: {
        ...mapState(["currentUser", "userProfile"])
    },
    methods: {
        findUserBookmarks() {
            let user = this.currentUser.uid;
            fb.userCollection
                .doc(user)
                .collection("bookmarks")
                .get()
                .then((docs) => {
                    let bookmarkArr = [];
                    // let sortedBooks = bookmarkArr.sort((a, b) => {
                    //   const dateHigh = a.createdOn
                    //   const dateLow = b.createdOn

                    //   let comparison = 0;
                    //   if (dateHigh > dateLow) {
                    //     comparison = 1;
                    //   } else if (dateHigh < dateLow) {
                    //     comparison = -1;
                    //   }
                    //   return comparison;
                    // })
                    docs.forEach((doc) => {
                        const post = doc.data();
                        post.id = doc.id;
                        bookmarkArr.push(post)
                    })
                    this.userBookmarks = bookmarkArr.reverse();
                    console.log("bookmark function clog", bookmarkArr)
                }).catch((err) => {
                    console.log(err)
                })
        },
        removeBookmark(post){
          const bookmarkOwnerId = this.currentUser.uid;
          const postId = post.id;
          this.$store.dispatch("REMOVE_BOOKMARK", {post, bookmarkOwnerId})
          const hela = this.userBookmarks.filter((bookmarks) => {
            return bookmarks.postId !== postId;
          })
          this.userBookmarks = hela; // Mutating the original array...I feel this is a TERRIBLE idea. But for the time being it works. 
        }
    }
}
</script>

<style lang="scss">
.Bookmarks {
    padding-top: 72px;
    &__header {
        background-color: white;
        padding: 10px 10px;
        span.userhandle {
            font-size: 0.8rem;
        }

        h5 {
            margin: 0;
        }
    }
}
</style>
