<template>
  <div
    :class="[
      $options.name,
      {
        'has-exceeded-limit': limitStatus > 100,
      },
    ]"
  >
    <div
      :class="`${$options.name}__htmlarea`"
      aria-hidden
    >{{ valueAllowed }}<em v-if="valueExcess">{{ valueExcess }}</em></div>
    <textarea
      ref="textarea"
      :class="`${$options.name}__textarea`"
      :value="value"
      rows="1"
      @input="updateValue"
    />
    <div :class="`${$options.name}__limit`">
      <span :class="`${$options.name}__remainingCharacters`">
        {{ remainingCharacters }}
      </span>
      <svg
        :class="`${$options.name}__counter`"
        viewBox="0 0 33.83098862 33.83098862"
        height="20"
        width="20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          :class="`${$options.name}__counterUnderlay`"
          cx="16.91549431"
          cy="16.91549431"
          r="15.91549431"
          fill="none"
          stroke-width="3"
        />
        <circle
          :class="`${$options.name}__counterProgress`"
          :stroke-dasharray="`${limitStatus},100`"
          cx="16.91549431"
          cy="16.91549431"
          r="15.91549431"
          fill="none"
          stroke-width="5"
        />
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: `ChattBox`,
  props: {
    limit: {
      type: Number,
      default: 280,
    },
    value: {
      type: String,
    },
  },
  computed: {
    valueAllowed() {
      return this.limit ? this.value.slice(0, this.limit) : this.value;
    },
    valueExcess() {
      return this.limit ? this.value.slice(this.limit) : '';
    },
    limitStatus() {
      return (this.value.length / this.limit) * 100;
    },
    remainingCharacters() {
      return this.limit - this.value.length;
    },
    textareaStyle() {
      return getComputedStyle(this.$refs.textarea);
    },
  },
  // It might be tempting to use a watcher instead of
  // triggering `textareaGrow()` in both, the `mounted()`
  // lifecycle hook and in the `updateValue()` method
  // but because watchers, which are set to run immediately,
  // are triggered before evaluating computed properties,
  // a watcher wouldn't work.
  mounted() {
    this.textareaGrow();
  },
  methods: {
    updateValue(e) {
      this.textareaGrow();
      this.$emit(`input`, e.target.value);
    },
    // Update the size of the textarea to fit the number
    // of lines of text.
    textareaGrow() {
      const paddingTop = parseInt(this.textareaStyle.getPropertyValue(`padding-top`), 10);
      const paddingBottom = parseInt(this.textareaStyle.getPropertyValue(`padding-bottom`), 10);
      const lineHeight = parseInt(this.textareaStyle.getPropertyValue(`line-height`), 10);

      // Resetting the row count to `1` is necessary for
      // recalculating the `scrollHeight` of the textarea.
      this.$refs.textarea.rows = 1;

      // We're calculating the inner height of the textare
      // and take this value to also calculate the number
      // of rows needed to fit the currently entered text.
      const innerHeight = this.$refs.textarea.scrollHeight - paddingTop - paddingBottom;
      this.$refs.textarea.rows = innerHeight / lineHeight;
    },
  },
};
</script>

<style lang="scss">
   @import '../assets/scss/global';

.ChattBox {
    /* $primary: #179BB5;
    $error: #FDB6C1;
    $success: #AADA7B;
    $lightText: #757575;
    $light: #F5F8FA;
    $medium: #657786;
    $dark: #34495E;
    $white: #fff; */

  position: relative;

  // 1. Account for the width of the remaining characters
  //    and visual counters.
  // 2. Harmonize differences between <div> and <textarea>.
  &__htmlarea,
  &__textarea {
    padding: 1rem;
    padding-right: 4rem;
    width: 100%;
    line-height: 1.25;
    border: 2px solid transparent;
    border-radius: 0.5em;
    font-size: 16px;
  }

  // 1. Remove the element from the normal document flow,
  //    so the <textarea> lies above this element, and
  //    make the HTML area <div> as tall as the <textarea>.
  // 2. Make the text color transparent, so only the
  //    background color of the <em> is visible.
  // 3. Make word breaks behave exactly like in a textarea.
  &__htmlarea {
    position: absolute; // 1
    height: 100%; // 1
    background-color: #fff;
    color: transparent; // 2
    white-space: pre-wrap; // 3
    word-wrap: break-word; // 3
  }

  // 1. Make the <textarea> a block level element to make
  //    its sizing behave like that of a <div>.
  // 2. By making the background color transparent, the user
  //    sees the content of the HTML area <div> behind the <textarea>.
  &__textarea {
    display: block; // 1
    position: relative;
    border-color: $primary;
    outline: 0;
    background-color: transparent;
    resize: none;

    &:focus {
      border-color: darken($primary, 5%);
    }
  }

  em {
    background: $error;
  }

  &__limit {
    display: flex;
    position: absolute;
    right: 0.75em;
    bottom: 0.75em;
    align-items: center;
  }

  &__remainingCharacters {
    margin-right: 0.5em;
    color: $lightText;
    font-size: 0.75em;

    .has-exceeded-limit & {
      color: $error;
    }
  }

  // 1. Making overflowing content visible, because
  //    otherwise the `counterPulse` animation would be
  //    cut off.
  &__counter {
    overflow: visible; // 1
    transform: rotate(-90deg);
    transform-origin: center;
  }

  &__counterUnderlay {
    stroke: $lightText;
  }

  &__counterProgress {
    stroke: $primary;

    .has-exceeded-limit & {
      stroke: $error;
      animation: counterPulse 0.3s ease-in-out;
      animation-iteration-count: 1;
    }
  }

  @keyframes counterPulse {
    0% { stroke-width: 4; }
    50% { stroke-width: 6; }
    100% { stroke-width: 4; }
  }
}
</style>