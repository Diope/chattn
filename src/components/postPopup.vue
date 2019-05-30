<template>
    
        <div class="p-container">
            <a @click="closePostModal" class="close">X</a>
            <div class="post">
                <h5>{{ fullPost.userName }}</h5>
                <span>{{ fullPost.createdOn | formatDate }}</span>
                <p>{{ fullPost.content }}</p>
                <ul>
                    <li><a>comments {{ fullPost.comments }}</a></li>
                    <li><a>likes {{ fullPost.likes }}</a></li>
                </ul>
            </div>
            <div v-show="postComments.length" class="comments">
                <div v-for="comment in postComments" class="comment">
                    <p>{{ comment.userName }}</p>
                    <span>{{ comment.createdOn | formatDate }}</span>
                    <p>{{ comment.content }}</p>
                </div>
            </div>
        </div>

    
</template>

<script>
export default {

}
</script>

<style>

</style>
