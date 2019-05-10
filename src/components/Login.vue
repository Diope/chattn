<template>
    <div id="login">
        <section>
        <div class="col1">
            <h3><i class="fas fa-search"></i> Follow your interests.</h3>
            <h3><i class="fas fa-user-friends"></i> Hear what people are talking about.</h3>
            <h3><i class="far fa-comment"></i> Join the conversation.</h3>
        </div>
        <div class="col2">
            <form @submit.prevent>
                <h1>Chattn</h1>
                <p>Welcome Back!</p>

                <input v-model.trim="loginForm.email" type="text" placeholder="example@email.com" id="email1">
                <input v-model.trim="loginForm.password" type="password" placeholder="Enter Your Password" id="password1">

                <button @click="login" class="button">Log In</button>

                <div class="extras">
                    <a>Forgot Password</a>
                    <a>Create An Account</a>
                </div>
            </form>
        </div>
        </section>
    </div>
</template>

<script>
const fb = require('../FirebaseConfig.js')
export default {
    data() {
        return {
            loginForm: {
                email: '',
                password: ''
            }
        }
    },
    methods: {
        login() {
            fb.auth.signInWithEmailAndPassword(this.loginForm.email, this.loginForm.password)
                .then(user => {
                    this.$store.commit('setCurrentUser', user)
                    this.$store.dispatch('fetchUserProfile')
                    this.$store.push('/dashboard')
                })
                .catch(err => console.log(err))
        }
    }

}
</script>

<style>

</style>
