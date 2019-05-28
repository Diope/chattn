<template>
  <SinglePost 
    :profilePic="post.profilePic"
    :displayName="post.displayName"
    :postId="this.$route.params.postId"
    :createdOn="post.createdOn"
    :tweetPic="post.tweetPic"
    :content="post.content"
    :userId="post.userId"
    :handle="post.handle"
    :likes="post.likes"
    :commentCount="post.comments"
  ></SinglePost>
  
</template>

<script>
import SinglePost from '@/components/SinglePost'
const fb = require("../FirebaseConfig.js");
export default {
    components: {
        SinglePost
    },
  data() {
    return {
      post: {}
    };
  },
  created() {
    this.fetchPost();
  },
  methods: {
    fetchPost() {
      let userPost = this.$route.params.postId;
      fb.postCollection
        .doc(userPost)
        .get()
        .then(post => {
          this.post = post.data();
        });
    }
  }
};
</script>

<style lang="scss" scoped>
#singlePost {
  width: 80%;
  margin: 5vh auto 0;
}
</style>

