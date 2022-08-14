<template>
  <div
    @click="state = !state"
    v-bind="attrs"
    v-if="!flat"
    class="truncate min-h-[1em] flex items-center"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      version="1.1"
      x="0px"
      y="0px"
      viewBox="0 0 1000 1000"
      enable-background="new 0 0 1000 1000"
      xml:space="preserve"
      :class="{
        opened: state,
      }"
    >
      <g><path d="M79.2,10l841.6,490.1L79.2,990V10z" /></g>
    </svg>

    <slot v-if="$slots['summary-opened'] ? !state : true" />
    <slot v-else name="summary-opened" />
  </div>
  <div v-if="state || loaded || flat" v-show="state || flat">
    <slot name="content" :state="state" />
  </div>
</template>

<script lang="ts" setup>
import { ref, useAttrs, watch } from 'vue';

const props = defineProps<{
  flat?: boolean;
  show?: boolean;
}>();

const attrs = useAttrs();
const state = ref(props.show);

const loaded = ref(false);

const watcher = watch(state, (state) => {
  loaded.value = true;
  watcher();
});
</script>

<style lang="scss" scoped>
svg {
  width: 0.5rem;
  height: 0.5rem;
  margin-right: 4px;
  fill: currentColor;
  &.opened {
    transform: rotate(90deg);
  }
}
</style>
