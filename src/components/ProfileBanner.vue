<template>
    <div 
        v-if="userProfile.profileBanner"
        :class="`${$options.name}__container`"
    >
        <div v-show="uploadEnd === true" class="progressBar" :style="{ width: progressUpload + '%'}" />
        <div 
            class="addIconWrapper"
            @click="$refs.profileBannerButton.click()"
        >
            <svg viewBox="0 0 24 24" :class="`${$options.name}__addIcon`"><g><path d="M19.708 22H4.292C3.028 22 2 20.972 2 19.708V7.375C2 6.11 3.028 5.083 4.292 5.083h2.146C7.633 3.17 9.722 2 12 2c2.277 0 4.367 1.17 5.562 3.083h2.146C20.972 5.083 22 6.11 22 7.375v12.333C22 20.972 20.972 22 19.708 22zM4.292 6.583c-.437 0-.792.355-.792.792v12.333c0 .437.355.792.792.792h15.416c.437 0 .792-.355.792-.792V7.375c0-.437-.355-.792-.792-.792h-2.45c-.317.05-.632-.095-.782-.382-.88-1.665-2.594-2.7-4.476-2.7-1.883 0-3.598 1.035-4.476 2.702-.16.302-.502.46-.833.38H4.293z"></path><path d="M12 8.167c-2.68 0-4.86 2.18-4.86 4.86s2.18 4.86 4.86 4.86 4.86-2.18 4.86-4.86-2.18-4.86-4.86-4.86zm2 5.583h-1.25V15c0 .414-.336.75-.75.75s-.75-.336-.75-.75v-1.25H10c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h1.25V11c0-.414.336-.75.75-.75s.75.336.75.75v1.25H14c.414 0 .75.336.75.75s-.336.75-.75.75z"></path></g></svg>
        </div>
        <div 
            class="removeIconWrapper"
            @click="removeBanner"
        >
            <svg viewBox="0 0 24 24" :class="`${$options.name}__removeIcon`"><g><path d="M13.414 12l5.793-5.793c.39-.39.39-1.023 0-1.414s-1.023-.39-1.414 0L12 10.586 6.207 4.793c-.39-.39-1.023-.39-1.414 0s-.39 1.023 0 1.414L10.586 12l-5.793 5.793c-.39.39-.39 1.023 0 1.414.195.195.45.293.707.293s.512-.098.707-.293L12 13.414l5.793 5.793c.195.195.45.293.707.293s.512-.098.707-.293c.39-.39.39-1.023 0-1.414L13.414 12z"></path></g></svg>
        </div>
        <img :src="userProfile.profileBanner" alt="" style="height: 100%; width: 100%; object-fit: cover">
        <input type="file" accept="image/*" :multiple="false" @change="detectFile($event)" ref="profileBannerButton" style="display: none;">
    </div>
    <div v-else
        :class="`${$options.name}__container`"
    >
        <div 
            class="addIconWrapper"
            @click="$refs.profileBannerButton.click()"
            style="left: 325px;"
        >
            <svg viewBox="0 0 24 24" :class="`${$options.name}__addIcon`"><g><path d="M19.708 22H4.292C3.028 22 2 20.972 2 19.708V7.375C2 6.11 3.028 5.083 4.292 5.083h2.146C7.633 3.17 9.722 2 12 2c2.277 0 4.367 1.17 5.562 3.083h2.146C20.972 5.083 22 6.11 22 7.375v12.333C22 20.972 20.972 22 19.708 22zM4.292 6.583c-.437 0-.792.355-.792.792v12.333c0 .437.355.792.792.792h15.416c.437 0 .792-.355.792-.792V7.375c0-.437-.355-.792-.792-.792h-2.45c-.317.05-.632-.095-.782-.382-.88-1.665-2.594-2.7-4.476-2.7-1.883 0-3.598 1.035-4.476 2.702-.16.302-.502.46-.833.38H4.293z"></path><path d="M12 8.167c-2.68 0-4.86 2.18-4.86 4.86s2.18 4.86 4.86 4.86 4.86-2.18 4.86-4.86-2.18-4.86-4.86-4.86zm2 5.583h-1.25V15c0 .414-.336.75-.75.75s-.75-.336-.75-.75v-1.25H10c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h1.25V11c0-.414.336-.75.75-.75s.75.336.75.75v1.25H14c.414 0 .75.336.75.75s-.336.75-.75.75z"></path></g></svg>
        </div>
        <input type="file" accept="image/*" :multiple="false" @change="detectFile($event)" ref="profileBannerButton" style="display: none;" >
    </div>
    
</template>

<script>
import {mapState} from 'vuex'
import moment from 'moment'

const fb = require('../FirebaseConfig');

export default {
    name: `ProfileBanner`,
    data() {
        return {
            uploadTask: '',
            profileBanner: null,
            uploadEnd: false,
            progressUpload: 0
        }
    },
    computed: {
        ...mapState(['userProfile'])
    },
    methods: {
        detectFile (e) {
            let fileList = e.target.files || e.dataTransfer.files
            Array.from(Array(fileList.length).keys()).map(x => {
                this.upload(fileList[x])
            })
        },
        upload (file) {
            const randomHex = Math.random()
                .toString(17)
                .slice(2, 14);
      
            const preFix = Math.random()
                .toString(18)
                .slice(2,5)

            const timeStamp = moment(new Date()).format('YYYY')

            this.uploading = true;
            this.uploadTask = fb.storage
                .child(
                    `${this.userProfile.userId}` +"/profile_picture/profile_banner/" + `${preFix}${randomHex}`
                ).put(file);
        },
        removeBanner () {
            fb.userCollection
                .doc(this.userProfile.userId)
                .update({profileBanner: null})
                .catch(err => {
                    console.log(err.message)
                })
        }
    },
    watch: {
        uploadTask: function () {
            this.uploadTask.on('state_changed', sp => {
                this.progressUpload = Math.floor(sp.bytesTransferred / sp.totalBytes * 100)
            },
            null,
            () => {
                this.uploadTask.snapshot.ref.getDownloadURL().then(profileBanner => {
                    this.profileBanner = profileBanner
                    this.uploadEnd = true
                    console.log(this.profileBanner, this.userProfile.userId)
                    this.$store.dispatch('updateProfileBanner', {profileBanner: profileBanner, user: this.userProfile.userId })
                    setTimeout(() => {
                        this.uploadEnd = false
                    }, 1150);
                })
            })
        }
    }
}
</script>

<style lang="scss">
    @import '../assets/scss/global';

    .ProfileBanner {
        
        &__container {
            height: 250px;
            position: relative;
            background-color: $primary;

            .progressBar {
                position: absolute;
                top: -10px;
                height: 5px;
                left: 0;
                background-color: #F62D73;
                z-index: 30;
            }

            .addIconWrapper {
                position: absolute;
                top: 100px;
                left: 250px;
                height: 50px;
                width: 50px;
                z-index: 30;
                background-color: rgba(0,0,0,0.40);
                padding: 10px;
                border-radius: 50%;
                cursor: pointer;
            }

            .removeIconWrapper {
                @extend .addIconWrapper;
                left: 400px;
            }


            img {
                filter: brightness(80%);
            }

        }
        &__addIcon {
            max-width: 100%;
            max-height: 100%;
            fill: rgba(255,255,255, 0.90);
        }

        &__removeIcon {
            max-width: 100%;
            max-height: 100%;
            fill: rgba(255,255,255, 0.90);
        }

        
    }

</style>
