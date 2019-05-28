<template>
    
</template>

<script>
export default {

}
</script>

<style>

</style>
    
          <div class="c-container">
            <form @submit.prevent>
              <textarea
                cols="30"
                rows="10"
                v-model="comment.content"
                placeholder="Chatt out your reply"
              ></textarea>
              <button @click="addComment" :disabled="comment.content === ''" class="button">Reply</button>
            </form>
          </div>



      <transition class="fade">
        <div v-if="showPostsPane" class="p-modal">
          <div class="p-container">
            <a @click="closePostsPane" class="close">X</a>
            <div class="post">
              <div class="profilePicWrapper">
                <router-link :to="`/u/${fullPost.userId}`">
                  <div v-if="fullPost.profilePic !== null" class="profilePhotoContainer">
                    <img
                      :src="fullPost.profilePic"
                      style="height: 100%; width: 100%; object-fit: cover"
                    >
                  </div>
                  <div v-else class="profilePhotoContainer">
                    <img
                      src="../assets/images/default.png"
                      style="height: 100%; width: 100%; object-fit: cover"
                    >
                  </div>
                </router-link>
              </div>

              <div class="postMain">
                <div class="userDisplay">
                  <div class="postContainer">
                    <div class="postContent">
                      <span class="displayName">{{fullPost.displayName}}</span>
                      <p>{{'@' + fullPost.handle}}</p>
                    

                    <div class="postText">
                      <p>{{fullPost.content}}</p>
                    </div>

                    <div v-if="fullPost.tweetPic !== null" class="postImage">
                      <img :src="fullPost.tweetPic" alt>
                    </div>
                    </div>
                    <ul>
                      <li>
                        <a>Comments: {{fullPost.comments}}</a>
                      </li>
                      <li>
                        <a>Likes: {{fullPost.likes}}</a>
                      </li>
                    </ul>
                    <span>{{fullPost.createdOn | formatDate}}</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-show="postComments.length" class="comments">
              <div :key="comment.id" v-for="comment in postComments" class="comment">
                <span class="displayname">{{comment.displayName}}</span>
                <p>{{'@' + comment.handle}}</p>
                <span>{{comment.createdOn | formatDate}}</span>
                <p>{{comment.content}}</p>
              </div>
            </div>
          </div>
        </div>
      </transition>