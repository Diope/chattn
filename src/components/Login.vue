<template>
    <div id="login">
        <transition name="fade">
            <div v-if="performingRequest" class="loading">
                <p>Loading...</p>
            </div>
        </transition>
        <section>
        <div class="col1">
            <h3><i class="fas fa-search"></i> Follow your interests.</h3>
            <h3><i class="fas fa-user-friends"></i> Hear what people are talking about.</h3>
            <h3><i class="far fa-comment"></i> Join the conversation.</h3>
        </div>
        <div class="col2" :class="{'signup-form' : !showLoginForm && !showForgotPassword}">
            <transition name="fade">
                <div v-if="err_message !== ''" class="error-msg">
                    <p>{{err_message}}</p>
                </div>
            </transition>
            <form v-if="showLoginForm && !showForgotPassword" @submit.prevent>
                <h1>Chattn</h1>
                <p>Welcome Back!</p>

                <input v-model.trim="loginForm.email" type="text" placeholder="example@email.com" id="email1">
                <input v-model.trim="loginForm.password" type="password" placeholder="Enter Your Password" id="password1">

                <button @click="login" class="button">Log In</button>

                <div class="extras">
                    <a @click="togglePasswordReset">Forgot Password</a>
                    <a @click="toggleForm">Create An Account</a>
                </div>
            </form>
            <form v-else @submit.prevent>
                <h1>Sign Up</h1>

                <input v-model.trim="signupForm.handle" type="text" placeholder="Your Chattn handle" id="handle" />
                <input v-model.trim="signupForm.displayName" type="text" placeholder="Your display Name" id="displayName" />
                <input v-model.trim="signupForm.email" type="email" placeholder="example@email.com" id="email2" />
                <input v-model.trim="signupForm.password" type="password" placeholder="6 character minimum password" id="password2" />

                <button @click="signup" class="button">Sign Up</button>
                <div class="extras"><a @click="toggleForm">Back to Log In</a></div>
            </form>
            <form v-if="showForgotPassword" @submit.prevent class="password-reset">
                <div v-if="!passwordResetSuccess">
                    <h1>Reset Your Password</h1>
                    <p>An link will be sent to your email to reset your password</p>

                    <label for="email3">Email</label>
                    <input type="text" v-model.trim="passwordForm.email" placeholder="example@email.com" id="email3">

                    <button @click="resetPass" class="button">Submit</button>

                    <div class="extras">
                        <a @click="togglePasswordReset">Back to Log In</a>
                    </div>
                </div>
                <div v-else>
                    <h1>Email Sent</h1>
                    <p>Check your email for password reset link</p>
                    <button @click="togglePasswordReset" class="button">Back to Log In</button>
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
            },
            signupForm: {
                handle: '',
                displayName: '',
                email: '',
                password: ''
            },
            passwordForm: {
                email: ''
            },
            showLoginForm: true,
            showForgotPassword: false,
            passwordResetSuccess: false,
            performingRequest: false,
            err_message: ''
        }
    },
    methods: {
        login() {
            this.performingRequest = true;

            fb.auth.signInWithEmailAndPassword(this.loginForm.email, this.loginForm.password)
                .then(user => {
                    this.commit('setCurrentUser', user.user)
                    this.$store.dispatch('fetchUserProfile')
                    this.performingRequest = false
                    this.$router.push('/dashboard')
                })
                .catch(err => {
                    console.log(err)
                    this.performingRequest = false;
                    this.err_message = err.message
                })
        },
        signup() {
            this.performingRequest = true
            fb.auth.createUserWithEmailAndPassword(this.signupForm.email, this.signupForm.password).then(user => {
                this.$store.commit('setCurrentUser', user.user)

                // creates the user object, kinda like what I'm doing on drybbble...though easier bc I'm using firebase
                fb.userCollection.doc(user.user.uid).set({
                    handle: this.signupForm.handle,
                    displayName: this.signupForm.displayName,
                    email: this.signupForm.email
                }).then(() => {
                    this.$store.dispatch('fetchUserProfile')
                    this.performingRequest = false;
                    this.$router.push('/dashboard')
                }).catch(err => console.log(err))
            }).catch(err => {
                console.log(err);
                this.performingRequest = false;
            })
        },
        resetPass() {
            this.performingRequest = true

            fb.auth.sendPasswordResetEmail(this.passwordForm.email)
                .then(() => {
                    this.performingRequest = false
                    this.passwordResetSuccess = true
                    this.passwordForm.email = ''
                })
                .catch((err) => {
                    console.log(err)
                    this.performingRequest = false
                    this.err_message = err.message
                })
        },
        toggleForm() {
            this.err_message
            this.showLoginForm = !this.showLoginForm
        },
        togglePasswordReset() {
            if (this.showForgotPassword) {
                this.showLoginForm = true
                this.showForgotPassword = false
                this.passwordResetSuccess = false
            } else {
                this.showLoginForm = false
                this.showForgotPassword = true
            }
        }
    }
    
}
</script>

<style>

</style>
