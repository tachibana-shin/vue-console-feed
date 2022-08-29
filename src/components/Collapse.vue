<template>
  <div v-if="onlyBtn">
    <slot />
  </div>
  <template v-else>
    <slot name="content" v-if="flat" />
    <template v-else>
      <div @click="state = !state" v-bind="attrs" class="collapse-summary">
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
            opened: state
          }"
        >
          <g><path d="M79.2,10l841.6,490.1L79.2,990V10z" /></g>
        </svg>

        <div class="truncate">
          <slot
            v-if="disableMagic || ($slots['summary-opened'] ? !state : true)"
          />
          <slot v-else name="summary-opened" />
        </div>
      </div>
      <div
        v-if="state || loaded"
        v-show="state"
        class="collapse-detail"
        :class="{
          l7: detailL7
        }"
      >
        <slot name="content" :state="state" />
      </div>
    </template>
  </template>
</template>

<script lang="ts" setup>
import { ref, useAttrs, watch } from "vue"

const props = defineProps<{
  onlyBtn?: boolean
  disableMagic?: boolean

  flat?: boolean
  show?: boolean

  detailL7?: boolean
}>()

const attrs = useAttrs()
const state = ref(props.show)

const loaded = ref(false)

const watcher = watch(state, () => {
  loaded.value = true
  watcher()
})
</script>

<style lang="scss" scoped>
@import "./styles.scss";

svg {
  width: 0.5rem;
  height: 0.5rem;
  margin-right: 4px;
  fill: #9aa0a6;
  flex: none;

  &.opened {
    transform: rotate(90deg);
  }
}

.collapse-summary {
  min-height: 1em;
  display: flex;
  align-items: center;
  font-style: italic;
}
.collapse-detail {
  margin-left: 12px;
  &.l7 {
    margin-left: (4px * 7);
  }

  :deep(.collapse-summary) {
    font-style: normal;
  }
}
</style>
