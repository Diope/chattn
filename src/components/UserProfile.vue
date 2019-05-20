<template>
    <section id="settings">
            <div class="profile">
    
                <div class="profile__info-pane">
                    <h3>{{requestedUser.displayName}}</h3>
                    <span>{{'@' + requestedUser.handle}}</span>
                    <p>{{requestedUser.bio}}</p>
                    <p><i class="fas fa-birthday-cake"> </i>{{requestedUser.birth}}</p>
                    <p><i class="fas fa-map-marker-alt"> </i>{{requestedUser.location}}</p>
                    <p><i class="fas fa-link"> </i>{{requestedUser.website}}</p>
                </div>
                
                <div v-show="userPosts.length" class="profile__posts-pane">
                    <div :key="post.id" v-for="post in userPosts" class="profile__userPosts">
                        <div class="userDisplay">
                            <span class="displayName">{{post.displayName}}</span><p>{{'@' + post.handle}} ・ {{post.createdOn | formatDate}}</p>
                        </div>
                        <div>
                            {{post.content}}
                        </div>
                    </div>
                </div>
        </div>
    </section>
</template>

<script>
import {mapState} from 'vuex'
import moment from 'moment'
const fb = require('../FirebaseConfig.js')
export default {
    data() {
        return {
            userPosts: []
        }
    },
    created() {
        this.fetchUser()
        this.findUserPosts()
    },
    watch: {
        '$route': ['fetchUser', 'findUserPosts']
    },
    computed: {
        ...mapState(['requestedUser'])
    },
    methods: {
        fetchUser() {
            fb.userCollection.doc(this.$route.params.id).get().then(res => {
                this.$store.commit('setRequestedProfile', res.data())
            })
        },
        findUserPosts() {
            fb.postCollection.orderBy('createdOn', 'desc').where('userId', '==', this.$route.params.id).get().then(docs => {
                    let postsArr = []

                    docs.forEach(doc => {
                        const post = doc.data()
                        post.id = doc.id
                        postsArr.push(post)
                    })

                    this.userPosts = postsArr
                    console.log(this.userPosts)

                }).catch(err => {
                    console.log(err)
                })
    
        }
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
    @import '../assets/scss/global';
    .profile {
        max-width: 768px;
        margin: 5vh auto 0;
        background: white;

        .profile__info-pane {
            padding: 2rem;
            border-bottom: 1px solid $light;
        }

        .profile__userPosts {
            border: 1px solid #e6ecf0;
            border-bottom: 0;
            font-size: 14px;
            padding: 2rem;
            background: $white;

    
            &:hover {
                background: #f5f8fa;
            }

            &:last-of-type {
                border-bottom: 1px solid $light;
            }

            h5 {
                margin: 0 0 0.5rem;
            }
            span {
                display: inline-block;
                font-size: 1.2rem;
                margin-bottom: 0.5rem;
                color: $dark;
                padding-right: 4px;
            }
            p {
                font-size: 1rem;
                margin: 0;
                display: inline;
                color: lighten($dark, 15%) 
            }
            ul {
                list-style: none;
                margin: 1rem 0 0;
                padding: 0;

                li {
                    display: inline-block;
                    margin-right: 1rem;
                    font-size: 12px;
                }
        
            }

            
        }
    }
</style>


