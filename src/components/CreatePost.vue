<template>
    <div class="newPostContainer">
        <div class="userDisplay">
        <div class="postPhotoContainer">
            <div v-if="userProfile.profilePic">
            <img
                :src="userProfile.profilePic"
                alt
                style="height: 100%; width: 100%; object-fit: cover"
            >
            </div>
            <div v-else>
            <img
                src="../assets/images/default.png"
                alt
                style="height: 100%; width: 100%; object-fit: cover"
            >
            </div>
        </div>
        <div style="margin-left: 8px;">
            <span class="displayName">{{userProfile.displayName}}</span>
            <p>{{'@' + userProfile.handle}}</p>
        </div>
        </div>
        <div class="create-post">
        <form @submit.prevent>
            <chattbox v-model="post.content"></chattbox>
            <br>
            <div
                class="postTweetPicPreview"
                v-if="post.tweetPic"
                style="max-width:260px; max-height: 150px; overflow: hidden; border-radius: 4px; border: 1px solid #657787; position: relative"
            >
            <div
                class="removeTweetPic"
                @click="deletePreviewPhoto(post)"
            >
                <i class="far fa-times-circle"></i>
            </div>
            <img
                :src="post.tweetPic"
                alt="image to upload"
                style="height: auto; width: 100%; object-fit: cover;"
            >
            </div>
            <input
            type="file"
            accept="image/*"
            :multiple="false"
            @change="detectFiles($event)"
            ref="tweetImage"
            style="display: none"
            >

            <div class="postButtons">
            <div class="photoButtonWrapper" @click="$refs.tweetImage.click()">
                <i class="fas fa-camera-retro"></i>
            </div>
            <button
                @click="createPost"
                :disabled="post.content == '' && !post.tweetPic || post.content.length > 280"
                class="button"
            >Chatt</button>
            </div>
        </form>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import Chattbox from "./ChattBox";

export default {
    name: `CreatePost`,
    components: {
        Chattbox
    },
    computed: {
        ...mapState(["userProfile", "currentUser"])
    },
    data() {
        return {
        post: {
            content: "",
            tweetPic: null,
            image: null
        }
        };
    },
    methods: {
        createPost() {
            const { handle, displayName, profilePic, location } = this.userProfile;
            const { tweetPic, content, image } = this.post;
            this.$store.dispatch("ADD_POST", {
                userId: this.currentUser.uid,
                content,
                image,
                likes: 0,
                comments: 0,
                createdOn: new Date(),
                tweetPic: null,
                user: { handle, displayName, profilePic, location }
            });
            this.post.content = "";
            this.post.tweetPic = null;
            this.post.image = null;
            },
            detectFiles(e) {
            let fileList = e.target.files || e.dataTransfer.files;
            let fileName = fileList[0].name;
            if (fileName.lastIndexOf(".") <= 0) {
                this.err_message = "File type is not valid";
            }

            const fileReader = new FileReader();
            fileReader.addEventListener("load", () => {
                this.post.tweetPic = fileReader.result;
            });
            fileReader.readAsDataURL(fileList[0]);
            this.post.image = fileList[0];

            // Array.from(Array(fileList.length).keys()).map(x => {
            //   this.upload(fileList[x]);
            // });
            },
            deletePreviewPhoto(post) {
                post.tweetPic = null;
            }
        }
};
</script>

<style lang="scss">
    @import "../assets/scss/global";

    .photoButtonWrapper {
        .fas {
            color: white;
        }
    }
    .newPostContainer {
        background: $white;
        padding: 2rem;
        flex-wrap: wrap;
        position: fixed;
        @media screen and (max-width: 1000px) {
            position: relative;
        }
        h4 {
            display: inline-flex;
            padding-right: 6px;
            color: $dark;
        }

        p {
            display: inline-flex;
        }

        .userDisplay {
            display: flex;
            align-items: flex-end;
            margin-bottom: 10px;
            @media screen and (max-width: 1000px) {
            display: none;
            }
        }

        .postPhotoContainer {
            max-height: 40px;
            max-width: 40px;
        }

        .create-post {
            .removeTweetPic {
                position: absolute;
                top: 0px;
                right: 0px;
                padding: 0.35rem;
                background: rgba(0,0,0,0.5);
                margin: 0.25rem;
                border-radius: 50%;
                cursor: pointer;

                 i {
                    font-size: 20px;
                    color: white;
                }
            }

            p {
            margin-bottom: 0.5rem;
            }

            .button {
            margin-top: 1rem;
            min-width: 90px;
            width: 10%;
            z-index: 5;
            }
        }
    }
</style>
