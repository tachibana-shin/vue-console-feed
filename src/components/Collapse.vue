<template>
  <div v-if="onlyBtn">
    <slot />
  </div>
  <template v-else>
    <slot name="content" v-if="flat" />
    <template v-else>
      <div
        @click.stop="state = !state"
        v-bind="attrs"
        class="collapse-summary"
        :class="classSummary"
        :style="{
          paddingLeft:
            paddingLeft === undefined ? undefined : paddingLeft + 'px'
        }"
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
            opened: state
          }"
        >
          <g><path d="M79.2,10l841.6,490.1L79.2,990V10z" /></g>
        </svg>

        <slot v-if="slots['summary']" name="summary" />
        <div v-else class="truncate-2">
          <slot v-if="forceMagic" name="summary-opened" />
          <template v-else>
            <slot
              v-if="disableMagic || ($slots['summary-opened'] ? !state : true)"
            />
            <slot v-else name="summary-opened" />
          </template>
        </div>
      </div>
      <div
        v-if="state || loaded"
        v-show="state"
        class="collapse-detail"
        :class="classDetail"
        :style="{
          '--p-left': paddingLeft === undefined ? undefined : paddingLeft + 'px'
        }"
      >
        <slot name="content" :state="state" />
      </div>
    </template>
  </template>
</template>

<script lang="ts" setup>
import { ref, useAttrs, useSlots, watch } from "vue"

const props = defineProps<{
  onlyBtn?: boolean
  disableMagic?: boolean
  forceMagic?: boolean

  paddingLeft?: number

  flat?: boolean
  show?: boolean

  classSummary?: string
  classDetail?: string
}>()

const attrs = useAttrs()
const slots = useSlots()
const state = ref(props.show)

const loaded = ref(state.value)

if (!state.value) {
  const watcher = watch(state, () => {
    loaded.value = true
    watcher()
  })
}
</script>

<style lang="scss" scoped>
@import "./styles.scss";
@import "./colors.scss";

.truncate-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

svg {
  width: 0.5rem;
  height: 0.5rem;
  margin-right: 4px;
  fill: var(--c-triangle-fill);
  flex: none;

  &.opened {
    transform: rotate(90deg);
  }
}

.svg-top > svg {
  align-self: start;
  margin-top: 1em;
  transform: translateY(-50%);

  &.opened {
    transform: translateY(-50%) rotate(90deg);
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
  &.l0 {
    margin-left: 0;
  }

  :deep(.collapse-summary) {
    font-style: normal;
  }
}

.line-throught {
  position: relative;
  &:before {
    content: "";
    height: 100%;
    width: 1px;
    background-color: var(--c-border);
    position: absolute;
    top: 0;
    left: var(--p-left);
    transform: translateX(3px);
    z-index: 1;
  }
}
</style>
