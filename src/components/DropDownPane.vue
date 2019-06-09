<template>
    <div class="dropDownContainer">
        <ul class="">
            <li>
                <router-link to="/timeline" exact>Timeline</router-link>
            </li>
            <li>
                <router-link to="settings" exact>Settings</router-link>
            </li>
            <li>
                <a @click="logout">logout</a>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: `DropDownPane`,
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

<style lang="scss">
    .dropDownContainer {
        z-index: 50;
        width: 200px;
        height: 300px;
    }
</style>
