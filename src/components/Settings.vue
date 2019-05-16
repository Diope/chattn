<template>
    <section id="settings">
        <div class="col1">
            <h3>Settings</h3>
            <p>Update Profile</p>

            <transition name="fade">
                <p v-if="showSuccess" class="success">Your profile has been updated</p>
            </transition>
            <form @submit.prevent>
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
export default {
    data() {
        return {
            displayName: '',
            handle: '',
            location: '',
            bio: '',
            website: '',
            birth: '',
            showSuccess: false
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
                birth: this.birth !== '' ? this.birth : this.userProfile.birth
            })

            this.displayName = ''
            this.handle = ''
            this.location = ''
            this.bio = ''
            this.website = ''
            this.birth = ''
            this.showSuccess = true

            setTimeout(() => {
                this.showSuccess = false
            }, 2500);
        }
    }
}
</script>

<style>

</style>
