<template>
    <div id="dashboard">
        <section>
            <div class="col1">
                <div class="profile">
                    <div class="userDisplay"><span class="displayName">{{userProfile.displayName}}</span><p>{{'@' + userProfile.handle}}</p></div>
                    <div class="create-post">
                        <p>New Post</p>
                        <form @submit.prevent>
                            <textarea v-model.trim="post.content" cols="30" rows="10"></textarea>
                            <button @click="createPost" :disabled="post.content == ''" class="button">Chatt</button>
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
                        <div class="userDisplay"><span class="displayName">{{post.displayName}}</span><p>{{'@' + post.handle}}</p></div>
                        <span>{{post.createdOn | formatDate }}</span>
                        <p>{{post.content }}</p>
                        <ul>
                            <li><a><i class="fas fa-comment"></i> {{post.comments}}</a></li>
                            <li><a><i class="fas fa-heart"></i> {{post.likes}}</a></li>
                            <li><a>View full post</a></li>
                        </ul>
                    </div>
                </div>
                <div v-else>
                    <p class="no-results">There are currently no posts</p>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import {DateTime} from 'luxon'
    import moment from 'moment'
    const fb = require('../FirebaseConfig.js')

    export default {
        data() {
            return {
                post: {
                    content: ''
                }
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
                    likes: 0,
                    createdOn: new Date()
                }).then(ref => {
                    this.post.content = ''
                }).catch(err => {
                    console.log(err)
                })
            },
            showNewPosts() {
                const updatedPosts = this.hiddenPosts.concat(this.posts)
                this.$store.commit('setHiddenPosts', null)
                this.$store.commit('setPosts', updatedPosts)
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

<style>

</style>
