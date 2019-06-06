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
    
                        <div v-if="userProfile.profilePic !== null" class="profilePhotoContainer" @click="$refs.profilePicButton.click()">
                            <img :src="userProfile.profilePic" style="height: 100%; width: 100%; object-fit: cover"/>
                            <input type="file" accept="image/*" :multiple="false" @change="detectFiles($event)" ref="profilePicButton" style="display: none">
                        </div>
                        <div v-else class="profilePhotoContainer" @click="$refs.profilePicButton.click()">
                            <img src="../assets/images/default.png" style="height: 100%; width: 100%; object-fit: cover" />
                            <input type="file" accept="image/*" :multiple="false" @change="detectFiles($event)" ref="profilePicButton" style="display: none">
                        </div>
                    <transition name="fade">
                        <div v-if="uploadEnd" class="success"><p>Profile Picture has been uploaded</p></div>
                    </transition>
                </div>

                <template v-if="$v.displayName.$error">
                    <span v-if="!$v.displayName.minLength" style="font-size: 12px; color: #FDB6C1;">The minimum length is 3 character</span>
                    <span v-if="!$v.displayName.maxLength" style="font-size: 12px; color: #FDB6C1;">The maximum length is 14 character</span>
                </template>
                <label for="displayName">Display Name</label>
                <input 
                    type="text" v-model.trim="displayName" 
                    :placeholder="userProfile.displayName" id="displayName" 
                    @blur="$v.displayName.$touch()" 
                    :style="!$v.displayName.minLength ? 'border-color: #FDB6C1' : 'border-color: #e6ecf0' && !$v.displayName.maxLength ? 'border-color: #FDB6C1' : 'border-color: #e6ecf0'"
                >

                <template v-if="$v.handle.$error">
                    <span v-if="!$v.handle.minLength" style="font-size: 12px; color: #FDB6C1;">The minimum length is 3 character</span>
                    <span v-if="!$v.handle.maxLength" style="font-size: 12px; color: #FDB6C1;">The maximum length is 14 character</span>
                </template>
                <label for="handle">Chattn Handle</label>
                <input 
                    type="text" 
                    v-model.trim="handle" 
                    :placeholder="'@' + userProfile.handle" 
                    id="handle" 
                    @blur="$v.handle.$touch()"  
                    :style="!$v.handle.minLength ? 'border-color: #FDB6C1' : 'border-color: #e6ecf0' &&!$v.handle.maxLength ? 'border-color: #FDB6C1' : 'border-color: #e6ecf0'"
                >

                <template v-if="$v.location.$error">
                    <span v-if="!$v.location.maxLength" style="font-size: 12px; color: #FDB6C1;">The maximum length is 30 characters</span>
                </template>
                <label for="location">Location</label>
                <input 
                    type="text" 
                    v-model.trim="location" 
                    :placeholder="userProfile.location" 
                    id="location" 
                    @blur="$v.location.$touch()" 
                    :style="!$v.location.maxLength ? 'border-color: #FDB6C1' : 'border-color: #e6ecf0'"
                >

                <template v-if="$v.website.$error">
                    <span v-if="!$v.website.url" style="font-size: 12px; color: #FDB6C1;">Must be a valid URL</span>
                </template>
                <label for="website">Website</label>
                <input 
                    type="url" 
                    v-model.trim="website" 
                    :placeholder="userProfile.website" 
                    id="website" 
                    @blur="$v.website.$touch()" 
                    :style="!$v.website.url ? 'border-color: #FDB6C1' : 'border-color: #e6ecf0'"
                >

                <label for="birth">Birth Date</label>
                <input type="date" v-model.number="birth" :placeholder="userProfile.birth" id="birth" >

                <template v-if="$v.bio.$error">
                    <span v-if="!$v.bio.maxLength" style="font-size: 12px; color: #FDB6C1;">The maximum length is 200 characters</span>
                </template>
                <label for="bio">About Me</label>
                <textarea 
                    v-model.trim="bio" 
                    :placeholder="userProfile.bio" 
                    id="bio" @blur="$v.bio.$touch()" 
                    :style="!$v.bio.maxLength ? 'border-color: #FDB6C1' : 'border-color: #e6ecf0'"
                />

                <button 
                    @click="updateProfile" 
                    class="button"
                    :disabled="
                        displayName === '' 
                        && handle === ''  
                        && location === '' 
                        && website === '' 
                        && birth === '' 
                        && bio === '' 
                        || displayName.length > 20 
                        || handle.length > 20
                        || bio.length > 200
                    "
                >Update Profile</button>
            </form>
        </div>
    </section>
</template>

<script>
import {mapState} from 'vuex'
import {url, maxLength, minLength, required} from 'vuelidate/lib/validators'
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
            profilePic: null,
            progressUpload: 0,
            uploadTask: ''
        }
    },
    validations: {
        displayName: { minLength: minLength(1), maxLength: maxLength(20)},
        handle: { minLength: minLength(1), maxLength: maxLength(20)},
        bio: {maxLength: maxLength(200)},
        location: {maxLength: maxLength(30)},
        website: {url}
    },
    computed: {
        ...mapState(['userProfile'])
    },
    methods: {
        updateProfile() {
            const formattedHandle = this.handle.replace(/ /g,"_")
            this.$store.dispatch('updateProfile', { // data that is received in the action on store ({context, state}, data)
                displayName: this.displayName !== '' ? this.displayName : this.userProfile.displayName,
                handle: this.handle !== '' ? formattedHandle : this.userProfile.handle,
                location: this.location !== '' ? this.location : this.userProfile.location,
                bio: this.bio !== '' ? this.bio : this.userProfile.bio,
                website: this.website !== '' ? this.website : this.userProfile.website,
                birth: this.birth !== '' ? this.birth : this.userProfile.birth,
                profilePic: this.profilePic !== null ? this.profilePic : this.userProfile.profilePic
            })

            this.displayName = ''
            this.handle = ''
            this.location = ''
            this.bio = ''
            this.website = ''
            this.birth = ''
            this.profilePic = null,
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
            this.uploadTask = fb.storage.child(`${this.userProfile.userId}` + '/profile_picture/' + file.name).put(file)
        },
        spacesReplace(handle) {
            return handle.replace(/ /g,"_")
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
    
    #settings {
        textarea {
            border: 1px solid #e6ecf0;
            outline: 0;
            height: 100px;
            width: 100%;
            padding: 10px;
            font-size: 16px;
        }

        .profilePicWrapper {
            margin: 0 0px 35px 0 !important;
        }

        .SettingInput.has-status-error {
            border-color: #FDB6C1
        }
    }

</style>

