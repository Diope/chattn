<template>
    <header>
        <section class="Nav">
            <div class="col1">
                <div :class="`${$options.name}__appTitle`">
                    <router-link to="/timeline" exact><div class="title">Chattn</div></router-link>
                </div>
                <!-- <div style="position: relative;"> -->
                    <div :class="`${$options.name}__userInfoWrapper`">
                        <div :class="`${$options.name}__userInfo`" @click="toggle">
                            <div :class="`${$options.name}__userInfo-avatar`" v-if="userProfile.profilePic">
                                <img :src="userProfile.profilePic" alt="avatar" style="height: 100%; width: 100%; object-fit: cover;">
                            </div>
                            <div :class="`${$options.name}__userInfo-avatar`" v-else>
                                <img src="../assets/images/default.png" alt="avatar" style="height: 100%; width: 100%; object-fit: cover;">
                            </div>

                            <div :class="`${$options.name}__userInfo-displayName`">
                                {{userProfile.displayName}} <i class="fas fa-angle-down"></i>
                            </div>
                        </div>
                    </div>
                    <div :class="`${$options.name}__dropDownContainer`" v-show="isOpen">
                        <div class="dropDown">

                            <div :class="`${$options.name}__dropDownTitle`">
                                <h4 class="header">Account Info</h4><div @click="hide"><i class="far fa-times-circle"></i></div>
                            </div>

                            <div :class="`${$options.name}__dropDownItemGroup`">

                                <div :class="`${$options.name}__dropDownUserProfile`">
                                    <div :class="`${$options.name}__dropDownUserProfile-avatar`">
                                        <img :src="userProfile.profilePic" :alt="`${userProfile.handle}'s Avatar'`" style="height: 100%; width: 100%; object-fit: cover;">
                                    </div>
                                    <h4 style="margin-top: 5px; margin-bottom: 0; font-size: 16px;">{{userProfile.displayName}}</h4>
                                    <p style="font-size: 14px;">@{{userProfile.handle}}</p>

                                    <div :class="`${$options.name}__dropDownItem-follows`" style="font-size: 14px; margin-top: 10px;">
                                        <div class="following"><span>344</span> Following</div> <div class="followers"><span>902</span> Followers</div>
                                    </div>
                                </div>

                            <div :class="`${$options.name}__siteNav`">
                                <div :class="`${$options.name}__dropDownItem`">
                                    <a :href="`${userProfile.handle}`" exact><i class="fas fa-user"></i> Profile</a>
                                </div>
                                <div :class="`${$options.name}__dropDownItem`">
                                    <router-link to="settings" exact><i class="fas fa-cog"></i> Settings</router-link>
                                </div>
                                <div :class="`${$options.name}__dropDownItem`">
                                    <a @click="logout"><i class="fas fa-sign-out-alt"></i> logout</a>
                                </div>
                            </div>

                            </div>

                        </div>
                    </div>
                <!-- </div> -->
            </div>
        </section>
    </header>
</template>

<script>
const fb = require('../FirebaseConfig.js')
import { mapState } from "vuex";
import ImagePanePopup from './ImagePanePopup'
export default {
    name: `Nav`,
    props: ['id'],
    data () {
        return {
            isOpen: false
        }
    },
    components: {
        ImagePanePopup
    },
    computed: {
        ...mapState(['userProfile'])
    },
    methods: {

        logout() {
            fb.auth.signOut().then(() => {
                this.$store.dispatch('clearData')
                this.$router.push('/login')
            })
            .catch((err) => {
                console.log(err)
            })
        },
        toggle: function() {
            this.isOpen = !this.isOpen;
        },
        show: function() {
            this.isOpen = true;
        },
        hide: function() {
            this.isOpen = false;
        }
    }
}
</script>

<style lang="scss">
    @import '../assets/scss/global';

header {
    border-bottom: 1px solid #e6ecf0;
}

.Nav {

    ul {
        margin: 0;
	    padding: 0;
	    list-style: none;
    }

    &__dropDownUserProfile-avatar {
        height: 48px;
        width: 48px;
        overflow: hidden;
        border-radius: 50%;
    }

    &__dropDownContainer {
        position: absolute;
        right: 0;
        top: 0;
        z-index: 1;
        width: 280px;
        height: 100vh;
        background: #fff;
        border-left: 1px solid #ddd;
        outline: 9999px solid rgba(0,0,0,0.5);
    }

    .dropDown {
        padding: 0;
    }

    &__dropDownTitle {
        h4.header {display: inline; margin-bottom: 0;}
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        padding: 22px 12px;
        border-bottom: 1px solid #dddddd;
    }

    &__dropDownItemGroup {
        margin: 20px 12px;
    }

    &__dropDownItem {
        padding: 14px 0;
    }

    &__dropDownItem-follows {
        display: flex;
        align-content: flex-start;
        justify-content: space-between;

        .followers {
            display: inline;
            margin-right: 15%;
        }

        .following {
            display: inline;
        }
    }

    &__siteNav {
        margin-top: 10px;
    }

    .col1 {
        align-items: center;
        display: flex;
        justify-content: space-between;
    }

    &__appTitle {
        display: inline-block;
    }

    &__userInfoWrapper {
        display: inline-block;
        cursor: pointer;
        :hover {
            background-color: darken($color: #ffffff, $amount: 7%);
            border-radius: 25px;
        }
    }

    &__userInfo {
        display: flex;
        max-width: 325px;
        justify-content: space-around;
        align-items: center;
        
    }

    &__userInfo-avatar {
        border-radius: 50%;
        overflow: hidden;
        height: 36px;
        width: 36px;
    }

    &__userInfo-displayName {
        margin: 0 10px;
    }

    &__dropDownWrapper {
        position: fixed;
        width: 300px;
        height: 400px;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: rgba($dark, 0.4);
        z-index: 40;
        display: flex;
        flex-wrap: wrap;
    }
}
</style>
