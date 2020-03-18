<template>
  <header>
    <section class="Nav GenericBookmark">
      <div class="col1">
        <!-- <div style="position: relative;"> -->
        <h2>{{ bookmark_msg }}</h2>
        <!-- </div> -->
      </div>
    </section>
  </header>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: `GenericNotification`,
  props: ["id"],
  data() {
    return {
      isOpen: false
    };
  },
  computed: {
    ...mapState(["bookmark_msg"])
  },
  methods: {
      setTimeout(() => {
          
      }, 5000);
    close() {
      this.$emit("closePane");
    },
    toggle: function() {
      this.isOpen = !this.isOpen;
    },
    show: function() {
      this.isOpen = true;
    },
    hide: function() {
      this.isOpen = false;
    }
  }
};
</script>

<style lang="scss">
@import "../assets/scss/global";
.Nav {
    z-index: 4000;
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .col1 {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }
}
</style>
