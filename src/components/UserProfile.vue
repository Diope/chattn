<template>
    <section id="settings">
        <div class="col1">
            <h3>{{requestedUser.displayName}}</h3>
            

            {{requestedUser}}
        </div>
    </section>
</template>

<script>
import {mapState} from 'vuex'
const fb = require('../FirebaseConfig.js')
export default {
    created() {
        this.fetchUser()
    },
    watch: {
        '$route': 'fetchUser'
    },
    computed: {
        ...mapState(['userProfile', 'requestedUser'])
    },
    methods: {
        test() {
            console.log()
        },
        fetchUser() {
            fb.userCollection.doc(this.$route.params.id).get().then(res => {
                this.$store.commit('setRequestedProfile', res.data())
            })
        }
    },
    
}
</script>

<style>

</style>
