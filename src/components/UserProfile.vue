<template>
    <section id="settings">
        <div class="col">
            <h3>Profile</h3>
            {{this.$route.params.handle}}

            {{requestedUser}}
        </div>
    </section>
</template>

<script>
import {mapState} from 'vuex'
export default {
    computed: {
        ...mapState(['userProfile', 'requestedUser'])
    },
    methods: {
        test() {
            console.log()
        }
    }
}
</script>

<style>

</style>
