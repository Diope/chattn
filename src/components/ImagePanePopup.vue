<template>    
        <div class="imagePane__wrapper">
            <div class="close__button">
                <a @click="close">
                <i class="far fa-times-circle"></i>
                </a>
            </div>
            <img :src="tweetPic" alt="" style="width: 100%; height: 100%; object-fit: contain">
            <div class="imagePane__caption">
                <p>{{imageCaption}}</p>
            </div>
        </div> <!-- end of wrapper -->
</template>

<script>
export default {
    props: [
        "tweetPic",
        "imageCaption",
        "close"
    ],
    methods: {
        
    }
}
</script>
<style lang="scss">
    .imagePane__wrapper {
        position: fixed;
        max-width: 85%;
        border-radius: 6px;
        top: 2vh;
        bottom: 2vh;
        left: 0;
        right: 0;
        margin: 0 auto;
        background: #1C1C1C;
        
        .close__button {
            z-index: 1000;
            margin: 1rem;
            position: absolute;
            left: 0px;
            top: 0px;
            background: #1C1C1C;
            border-radius: 50%;
            padding: 0.5rem;

            i {
                font-size: 24px;
                color: white;
            }
        }

        .imagePane__caption {
            position: absolute;
            z-index: 1000;
            border-radius: 0 6px 6px;
            width: 100%;
            bottom: 0;
            background: RGBA(28, 28, 28, .75);
            text-align: center;
            font-size: 18px;
            color: white;
            align-items: center;
            padding: 1rem;

            p {

            }
        }
    }

</style>

