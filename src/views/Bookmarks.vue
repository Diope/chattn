<template>
    <section :class="`${$options.name}`">
        <div class="col1">
            <div :class="`${$options.name}__header`">
                <p>Bookmarks</p>
                <p>@{{file.handle}}</p>
            </div>
            <div class="book-body">
                <div v-if="this.userBookmarks.length">
                    <div :key="post.id" v-for="post in userBookmarks" class="post">

                        <div class="flexWrap">
                            <div class="profilePicWrapper">
                                <router-link :to="{name: 'file', params: {handle: post.user.handle}}">
                  
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
                      <router-link :to="{name: 'file', params: {handle: post.user.handle}}">
                        <span class="displayName">
                          {{post.user.displayName}}
                          <p>{{'@' + post.user.handle}}</p> ・
                          <p class="timeAgo">{{post.createdOn | formatDate }}</p>
                        </span>
                      </router-link>
                      <div class="deletePost" v-if="currentUser.uid === post.userId">
                        <a @click="openDeleteConfirmPane(post)">
                          <i class="fas fa-times"></i>
                        </a>
                      </div>
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
                    <li>
                      <a @click="bookmarkPost(post.id)">
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
    computed: {
        ...mapState(["currentUser", "file"])
    },
    methods: {
        findUserBookmarks() {
            let user = this.currentUser.uid;
            fb.bookmarksCollection
                .where("userId", "==", user)
                .get()
                .then((docs) => {
                    let bookmarkArr = [];
                    docs.forEach((doc) => {
                        fb.postCollection.doc(doc.id).get().then((doc) => {
                            const post = doc.data();
                            post.id = doc.id;
                            bookmarkArr.push(post)
                        })
                    })
                    this.userBookmarks = bookmarkArr;
                    console.log(bookmarkArr)
                }).catch((err) => {
                    console.log(err)
                })
        }
    }
}
</script>

<style lang="scss">
.Bookmarks {
    padding-top: 72px;
    &__header {
        text-align: center;
        background-color: white;
        padding: 10px 0;

        h3 {
            margin: 0;
        }
    }
}
</style>
