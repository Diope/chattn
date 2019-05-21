<template>
    <section id="settings">
            <div class="userProfilee">
    
                <div class="profile__info-pane">
                    <div class="profile_spaceBetween">
                        <div class="profile__info-pane-profilePic">
                            <img :src="requestedUser.profilePic" style="height: 100%; width: 100%; object-fit: cover">
                        </div>
                        <div v-show="currentUser.uid === requestedUser.userId">
                           <router-link to="/settings"><button class="button">Edit profile</button></router-link>
                        </div>
                    </div>
                    <h3>{{requestedUser.displayName}}</h3>
                    <span>{{'@' + requestedUser.handle}}</span>
                    <div class="userBio">{{requestedUser.bio}}</div>
                    <div class="userMeta">
                        <p class="metaItem"><i class="fas fa-map-marker-alt"></i> {{requestedUser.location}}</p>
                        <p class="metaItem"><i class="fas fa-link"></i> <a :href="`${requestedUser.website}`"> {{requestedUser.website}}</a></p>
                        <p class="metaItem"><i class="fas fa-birthday-cake"></i> {{requestedUser.birth | birthDate}}</p>
                        <p class="metaItem"><i class="fas fa-calendar-alt"></i> {{requestedUser.createdOn | joinDate}}</p>
                    </div>
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
        ...mapState(['requestedUser', 'currentUser'])
    },
    methods: {
        fetchUser() {
            let userId = this.$route.params.id
            fb.userCollection.doc(userId).get().then(res => {
                if (res.empty) {
                    this.$router.go('/dashboard')
                }
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
                    // console.log(this.userPosts)

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
            },
            birthDate(val) {
                return moment(val).format("Born MMMM Do, YYYY")
            },
            joinDate(val) {
                return moment(val).format("LL")
            }
        }
    
}
</script>

<style lang="scss">
    @import '../assets/scss/global';
    .userProfilee {
        width: 50%;
        margin: 5vh auto 0;
        background: white;

        .profile__info-pane {
            padding: 2rem;
            border-bottom: 1px solid $light;
    
            h3 {
                margin-bottom: 0;
            }

            .profile_spaceBetween {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .profile__info-pane-profilePic {
                height: 150px;
                width: 150px;
                border: 1px solid black;
                border-radius: 50%;
                overflow: hidden;
                margin-bottom: 0.8rem;
            }

            .userBio {
                padding: 0.8rem 0;
            }

            .userMeta {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                width: 93%;
                
                .metaItem {
                    margin: 0 auto 0 0;
                    font-size: 0.9rem;
                    color: lighten($dark, 17%);
                }
    
            }
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


