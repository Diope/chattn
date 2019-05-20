<template>
    <header>
        <section>
            <div class="col1">
                <router-link to="dashboard"><div class="title">Chattn</div></router-link>
                <ul class="inline">
                    <li>
                        <router-link to="/dashboard" exact>Timeline</router-link>
                    </li>
                    <li>
                        <router-link to="settings">Settings</router-link>
                    </li>
                    <li>
                        <a @click="logout">logout</a>
                    </li>
                </ul>
            </div>
        </section>
    </header>
</template>

<script>
const fb = require('../FirebaseConfig.js')
export default {
    methods: {
        logout() {
            fb.auth.signOut().then(() => {
                this.$store.dispatch('clearData')
                this.$router.push('/login')
            })
            .catch((err) => {
                console.log(err)
            })
        }
    }

}
</script>

<style>

</style>
