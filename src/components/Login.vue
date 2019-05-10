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
            <form @submit.prevent>
                <h1>Sign Up</h1>

                <input v-model.trim="signupForm.handle" type="text" placeholder="Your Chattn handle" id="name" />
                <input v-model.trim="signupForm.displayName" type="text" placeholder="Your display Name" id="name" />
                <input v-model.trim="signupForm.email" type="email" placeholder="example@email.com" id="email2" />
                <input v-model.trim="signupForm.password" type="password" placeholder="6 character minimum" id="password2" />

                <button @click="signup" class="button">Sign Up</button>
                <div class="extras"><a>Back to Log In</a></div>
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
            },
            signupForm: {
                handle: '',
                displayName: '',
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
