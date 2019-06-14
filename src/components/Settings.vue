<template>
    <section :class="`${$options.name}`">
        <div class="col1">
            <ProfileBanner></ProfileBanner>

            
            <div class="profileHeader">

            </div>
            
            <form @submit.prevent>

                <div class="profilePicWrapper">
    
                        <div v-if="userProfile.profilePic !== null" class="profilePhotoContainer">

                            <div 
                                class="addIconWrapper"
                                @click="$refs.profilePicButton.click()"
                            >
                                <svg viewBox="0 0 24 24" :class="`${$options.name}__addIcon`"><g><path d="M19.708 22H4.292C3.028 22 2 20.972 2 19.708V7.375C2 6.11 3.028 5.083 4.292 5.083h2.146C7.633 3.17 9.722 2 12 2c2.277 0 4.367 1.17 5.562 3.083h2.146C20.972 5.083 22 6.11 22 7.375v12.333C22 20.972 20.972 22 19.708 22zM4.292 6.583c-.437 0-.792.355-.792.792v12.333c0 .437.355.792.792.792h15.416c.437 0 .792-.355.792-.792V7.375c0-.437-.355-.792-.792-.792h-2.45c-.317.05-.632-.095-.782-.382-.88-1.665-2.594-2.7-4.476-2.7-1.883 0-3.598 1.035-4.476 2.702-.16.302-.502.46-.833.38H4.293z"></path><path d="M12 8.167c-2.68 0-4.86 2.18-4.86 4.86s2.18 4.86 4.86 4.86 4.86-2.18 4.86-4.86-2.18-4.86-4.86-4.86zm2 5.583h-1.25V15c0 .414-.336.75-.75.75s-.75-.336-.75-.75v-1.25H10c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h1.25V11c0-.414.336-.75.75-.75s.75.336.75.75v1.25H14c.414 0 .75.336.75.75s-.336.75-.75.75z"></path></g></svg>
                            </div>

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
                    <transition name="fade">
                        <p v-if="showSuccess" class="success">Your profile has been updated</p>
                    </transition>
                </div>

                <template v-if="$v.displayName.$error">
                    <span v-if="!$v.displayName.minLength" style="font-size: 12px; color: #FDB6C1;">The minimum length is 3 character</span>
                    <span v-if="!$v.displayName.maxLength" style="font-size: 12px; color: #FDB6C1;">The maximum length is 30 character</span>
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
                    <span v-if="!$v.handle.maxLength" style="font-size: 12px; color: #FDB6C1;">The maximum length is 30 character</span>
                </template>
                <label for="handle">Chattn Handle</label>
                <input 
                    type="text" 
                    v-model="handle" 
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
                    v-model="bio" 
                    :placeholder="userProfile.bio" 
                    id="bio" @blur="$v.bio.$touch()" 
                    :style="!$v.bio.maxLength ? 'border-color: #FDB6C1' : 'border-color: #e6ecf0'"
                />
                <div class="bio_count" style="font-size: 12px;">{{this.bio.length}}/200</div>

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
                        || displayName.length > 30 
                        || handle.length > 30
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
import ProfileBanner from './ProfileBanner'
const fb = require('../FirebaseConfig');

export default {
    name: `Settings`,
    components: {
        ProfileBanner
    },
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
        displayName: { minLength: minLength(1), maxLength: maxLength(30)},
        handle: { minLength: minLength(1), maxLength: maxLength(30)},
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
            this.$store.dispatch('updateProfile', { 
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
            this.uploadTask = fb.storage.child(`${this.userProfile.userId}` + '/profile_pictures/' + file.name).put(file)
        },
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

    @import '../assets/scss/global';
    
    .Settings {
        padding-top: 72px;

        &__addIcon {
            max-width: 100%;
            max-height: 100%;
            fill: rgba(255,255,255, 0.90);
        }

        .profilePhotoContainer {
            max-height: 150px;
            max-width: 150px;
            background: gray;
            border: 1px solid black;
            border-radius: 50%;
            overflow: hidden;
            z-index: 30;
            position: relative;

            img {
                filter: brightness(80%);
            }

            .addIconWrapper {
                position: absolute;
                top: 50px;
                left: 50px;
                height: 50px;
                width: 50px;
                z-index: 50;
                background-color: rgba(0,0,0,0.40);
                padding: 10px;
                border-radius: 50%;
                cursor: pointer;
            }
        }

        .col1 {
            max-width: 700px;
            margin: 5vh auto 0;
            background: $white;
            padding: 0;
        }
        form {
            margin: -3.5rem 2rem 2rem; 
            textarea {
                border: 1px solid #e6ecf0;
                outline: 0;
                height: 100px;
                width: 100%;
                padding: 10px;
                font-size: 16px;
            }
        }

        .profilePicWrapper {
            display: inline-block;
            margin: 0 0px 35px 0 !important;
            cursor: default;
        }

    
        .button {
            margin-top: 2rem;
        }

        .success {
            color: $success;
        }
    }

</style>

