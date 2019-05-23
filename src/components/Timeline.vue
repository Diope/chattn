<template>
    <div id="timeline">
        <section>
            <div class="col1">
                <div class="profile">
                    <div class="userDisplay"><span class="displayName">{{userProfile.displayName}}</span><p>{{'@' + userProfile.handle}}</p></div>
                    <div class="create-post">
                        <form @submit.prevent>
                            <textarea v-model.trim="post.content" cols="30" rows="10"></textarea>
                            <input type="file" accept="image/*" :multiple="false" @change="detectFiles($event)" ref="tweetImage" style="display: none">
                            <div class="postButtons">
                                <div class="photoButtonWrapper" @click="$refs.tweetImage.click()">
                                    <i class="fas fa-camera-retro"></i>
                                </div>
                                <button @click="createPost" :disabled="post.content == ''" class="button">Chatt</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="col2">
                <transition class="fade">
                    <div v-if="hiddenPosts.length" @click="showNewPosts" class="hidden-posts">
                        <p>
                           <i class="fas fa-long-arrow-alt-up"></i> See new Chats
                        </p>
                    </div>
                </transition>
                <div v-if="posts.length">
                    <div :key="post.id" v-for="post in posts" class="post" >
                        <div class="flexWrap">
                            <div class="profilePhotoContainer">
                                <img :src="post.profilePic" style="height: 100%; width: 100%; object-fit: cover" />
                            </div>
                            <div class="userDisplay">
                                <router-link :to="`/u/${post.userId}`">
                                    <span class="displayName">
                                        {{post.displayName}}
                                        <p>{{'@' + post.handle}}</p>
                                        ・ <p class="timeAgo">{{post.createdOn | formatDate }}</p>
                                    </span>
                                </router-link>
                            <div class="userPostContent">
                                <div class="postText" @click="viewPosts(post)">
                                    {{post.content}}
                                </div>
                                <div v-show="post.tweetPic !== ''" class="postImage">
                                    <img :src="post.tweetPic" alt="">
                                </div>
                                
                            </div>
                            <ul>
                                <li><a @click="openComments(post)"><i class="fas fa-comment"></i> {{post.comments}}</a></li>
                                <li><a @click="likePost(post.id, post.likes)"><i class="fas fa-heart"></i> {{post.likes}}</a></li>
                            </ul>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div v-else>
                    <p class="no-results">There are currently no posts</p>
                </div>
            </div>
        </section>
        <transition class="fade">
            <div v-if="showCommentPane" class="c-modal">
                <div class="c-container">
                    <a @click="closeCommentPane"><i class="fas fa-times"></i></a>
                    <p>Add a Comment</p>
                    <form @submit.prevent>
                        <textarea cols="30" rows="10" v-model="comment.content" placeholder="Chatt out your reply"></textarea>
                        <button @click="addComment" :disabled="comment.content === ''" class="button">Reply</button>
                    </form>
                </div>
            </div>
        </transition>
        <transition class="fade">
            <div v-if="showPostsPane" class="p-modal">
                <div class="p-container">
                    <a @click="closePostsPane" class="close">X</a>
                        <div class="post">
                            <div class="userDisplay"><span class="displayName">{{fullPost.displayName}}</span><p>{{'@' + fullPost.handle}}</p></div>
                            <span>{{fullPost.createdOn | formatDate}}</span>
                            <p>{{fullPost.content}}</p>
                            <ul>
                                <li><a>Comments: {{fullPost.comments}}</a></li>
                                <li><a>Likes: {{fullPost.likes}}</a></li>
                            </ul>
                        </div>
                        <div v-show="postComments.length" class="comments">
                            <div :key="comment.id" v-for="comment in postComments" class="comment">
                                <span class="displayname">{{comment.displayName}}</span><p>{{'@' + comment.handle}}</p>
                                <span>{{comment.createdOn | formatDate}}</span>
                                <p>{{comment.content}}</p>
                            </div>
                        </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import moment from 'moment'
    const fb = require('../FirebaseConfig.js')

    export default {
        data() {
            return {
                post: {
                    content: '',
                    tweetPic: ''
                },
                comment: {
                    postCommentCount: 0,
                    postId: '',
                    userId: '',
                    content: ''
                },
                showCommentPane: false,
                uploadTask: '',
                uploadEnd: false,
                showPostsPane: false,
                progressUpload: 0,
                fullPost: {},
                postComments: []
            }
        },
        methods: {
            createPost() {
                fb.postCollection.add({
                    userId: this.currentUser.uid,
                    displayName: this.userProfile.displayName,
                    handle: this.userProfile.handle,
                    content: this.post.content,
                    comments: 0,
                    profilePic: this.userProfile.profilePic,
                    tweetPic: this.post.tweetPic,
                    likes: 0,
                    createdOn: new Date()
                }).then(ref => {
                    this.post.content = ''
                    this.post.tweetPic = ''
                }).catch(err => {
                    console.log(err)
                })
            },
            showNewPosts() {
                const updatedPosts = this.hiddenPosts.concat(this.posts)
                this.$store.commit('setHiddenPosts', null)
                this.$store.commit('setPosts', updatedPosts)
            },
            openComments(post) {
                this.comment.postId = post.id
                this.comment.userId = post.userId
                this.comment.postCommentCount = post.comments
                this.showCommentPane = true;
            },
            closeCommentPane() {
                this.comment.postId = ''
                this.comment.userId = ''
                this.comment.content = ''
                this.showCommentPane = false;
            },
            addComment() {
                const postId = this.comment.postId
                const postCommentCount = this.comment.postCommentCount

                fb.commentsCollection.add({
                    postId: postId,
                    content: this.comment.content,
                    userId: this.currentUser.uid,
                    handle: this.userProfile.handle,
                    displayName: this.userProfile.displayName,
                    createdOn: new Date()
                }).then(doc => {
                    fb.postCollection.doc(postId).update({
                        comments: postCommentCount + 1
                    }).then(() => {
                        this.closeCommentPane()
                    })
                }).catch(err => {
                    console.log(err)
                })
            },
            viewPosts(post) {
                fb.commentsCollection.where('postId', '==', post.id).get().then(docs => {
                    let commentsArr = []

                    docs.forEach(doc => {
                        const comment = doc.data()
                        comment.id = doc.id
                        commentsArr.push(comment)
                    })

                    this.postComments = commentsArr
                    this.fullPost = post
                    this.showPostsPane = true
                }).catch(err => {
                    console.log(err)
                })
            },
            closePostsPane() {
                this.postComments = []
                this.showPostsPane = false
            },
            likePost(postId, postLikes) {
                const docId = `${this.currentUser.uid}_${postId}`

                fb.likesCollection.doc(docId).get().then(doc => {
                    if (doc.exists) {
                        return
                    }

                    fb.likesCollection.doc(docId).set({
                        postId: postId,
                        userId: this.currentUser.uid
                    }).then(() => {
                        fb.postCollection.doc(postId).update({
                            likes: postLikes + 1
                        })
                    })
                }).catch(err => {
                    console.log(err)
                })
            },
            detectFiles (e) {
                let fileList = e.target.files || e.dataTransfer.files
                Array.from(Array(fileList.length).keys()).map(x => {
                    this.upload(fileList[x])
                })
            },
            upload (file) {
                this.fileName = file.name
                this.uploading = true
                this.uploadTask = fb.storage.child(`${this.currentUser.uid}` +'/tweet_images/' + file.name).put(file)
            }
        
         },
        watch: {
            uploadTask: function () {
                this.uploadTask.on('state_changed', sp => {
                    this.progressUpload = Math.floor(sp.bytesTransferred / sp.totalBytes * 100)
                    console.log(this.progressUpload)
                },
                null,
                () => {
                    this.uploadTask.snapshot.ref.getDownloadURL().then(tweetPic => {
                        this.post.tweetPic = tweetPic
                        this.uploadEnd = true
                        console.log(tweetPic)
                        // this.$store.dispatch('PostTweetPhoto', {profilePic: this.profilePic !== '' ? this.profilePic : this.userProfile.profilePic})
                        setTimeout(() => {
                            this.uploadEnd = false
                        }, 2500);
                    })
                })
            }
        },
        computed: {
            ...mapState(['userProfile', 'currentUser', 'posts', 'hiddenPosts'])
        },
        filters: {
            formatDate(val){
                if (!val) return '-'
                let date = val.toDate()
                return moment(date).fromNow()
            }
        }
    }
</script>

<style lang="scss">
    .photoButtonWrapper {
        .fas {
            color: white;
        }
    }
    .postText {
        padding-bottom: 1rem;
    }
    .postImage {
        border-radius: 4px;
        border: 1px solid #657786;
    }

</style>
