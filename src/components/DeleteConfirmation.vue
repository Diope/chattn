<template>
    <div>
        <div class="cheat" />
        <div class="d-modal__wrapper">
            <div class="d-modal__inner">
                <div class="head">
                    This post will be deleted, are you sure?
                </div>
                <div class="body">
                    <button class="button-clear" @click="close">Cancel</button>
                    <button class="button" @click="deletePost(post)">Delete</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    computed: {
        ...mapState(["currentUser"])
    },
    props: [
        "closePane",
        "post"
    ],
    methods: {
        deletePost(post) {
            this.$store.dispatch('DELETE_POST', {postId: post.id, userId: this.currentUser.uid, tweetPic: post.tweetPic}).then(() => {
                this.$emit('closePane');
            })
        },
        close(){
            this.$emit('closePane')
        }
    }
}
</script>


<style lang="scss" scoped>
    
    .cheat {
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        position: fixed;
        z-index: 50;
        background: rgba(0,0,0,0.25);
        overflow: hidden;
    }

    .d-modal__wrapper {
        position: fixed;
        border-radius: 4px;
        top: 42vh;
        bottom: 42vh;
        max-width: 315px;
        margin: 0 auto;
        background: #ffffff;
        z-index: 60;
        .d-modal__inner {
            padding: 15px 15px;
            .head {
                font-size: 16px;
                font-weight: 600;
                margin: 10px 0;
                text-align: center;
            }
            .body {
                display:flex;
                justify-content: space-around;
                padding: 10px 0;
            }
        }
    }

</style>
