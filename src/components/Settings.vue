<template>
    <section id="settings">
        <div class="col1">
            <h3>Settings</h3>

            <transition name="fade">
                <p v-if="showSuccess" class="success">Your profile has been updated</p>
            </transition>
            
            <form @submit.prevent>

                <div class="profilePicWrapper">
                    <label for="profilePic">Profile Picture</label>
                    <div class="profilePhotoContainer" @click="$refs.profilePicButton.click()">
                        <img :src="userProfile.profilePic" style="height: 100%; width: 100%; object-fit: cover"/>
                        <input type="file" accept="image/*" :multiple="false" @change="detectFiles($event)" ref="profilePicButton" style="display: none">
                    </div>
                    <transition name="fade">
                        <div v-if="uploadEnd" class="success"><p>Profile Picture has been uploaded</p></div>
                    </transition>
                </div>

                <label for="displayName">Display Name</label>
                <input type="text" v-model.trim="displayName" :placeholder="userProfile.displayName" id="displayName">

                <label for="handle">Chattn Handle</label>
                <input type="text" v-model.trim="handle" :placeholder="'@' + userProfile.handle" id="handle">

                <label for="location">Location</label>
                <input type="text" v-model.trim="location" :placeholder="userProfile.location" id="location">

                <label for="website">Website</label>
                <input type="url" v-model.trim="website" :placeholder="userProfile.website" id="website" >

                <label for="birth">Birth Date</label>
                <input type="date" v-model="birth" :placeholder="userProfile.birth" id="birth" >

                <label for="bio">About Me</label>
                <textarea v-model.trim="bio" :placeholder="userProfile.bio" id="bio" />

                <button @click="updateProfile" class="button">Update Profile</button>
            </form>
        </div>
    </section>
</template>

<script>
import {mapState} from 'vuex'
import { setTimeout } from 'timers';
const fb = require('../FirebaseConfig');

export default {
    data() {
        return {
            displayName: '',
            handle: '',
            location: '',
            bio: '',
            website: '',
            birth: '',
            showSuccess: false,
            uploadEnd: false,
            profilePic: '',
            progressUpload: 0,
            uploadTask: ''
        }
    },
    computed: {
        ...mapState(['userProfile'])
    },
    methods: {
        updateProfile() {
            this.$store.dispatch('updateProfile', {
                displayName: this.displayName !== '' ? this.displayName : this.userProfile.displayName,
                handle: this.handle !== '' ? this.handle : this.userProfile.handle,
                location: this.location !== '' ? this.location : this.userProfile.location,
                bio: this.bio !== '' ? this.bio : this.userProfile.bio,
                website: this.website !== '' ? this.website : this.userProfile.website,
                birth: this.birth !== '' ? this.birth : this.userProfile.birth,
                profilePic: this.profilePic !== '' ? this.profilePic : this.userProfile.profilePic
            })

            this.displayName = ''
            this.handle = ''
            this.location = ''
            this.bio = ''
            this.website = ''
            this.birth = ''
            this.profilePic = '',
            this.uploadTask = ''
            this.showSuccess = true

            setTimeout(() => {
                this.showSuccess = false
            }, 2500);
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
            this.uploadTask = fb.storage.child('profilePictures/' + `${this.userProfile.userId}/` + file.name).put(file)
        }
        
    },
    watch: {
        uploadTask: function () {
            this.uploadTask.on('state_changed', sp => {
                this.progressUpload = Math.floor(sp.bytesTransferred / sp.totalBytes * 100)
            },
            null,
            () => {
                this.uploadTask.snapshot.ref.getDownloadURL().then(profilePic => {
                    this.profilePic = profilePic
                    this.uploadEnd = true
                    // console.log(profilePic)
                    this.$store.dispatch('updateProfilePhoto', {profilePic: this.profilePic !== '' ? this.profilePic : this.userProfile.profilePic})
                    setTimeout(() => {
                        this.uploadEnd = false
                    }, 2500);
                })
            })
        }
    }
}
</script>

<style lang="scss">
    
    .progress-bar {
        margin: 10px 0;
    }
</style>

