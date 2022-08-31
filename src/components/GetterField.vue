<template>
  <span @click="getted = true" v-if="!getted || !value">(…)</span>
  <ConsoleValue
    :data="value!"
    v-else
    class="inline !ml-0"
    :_get-list-link-async="_getListLinkAsync"
    :read-link-object-async="readLinkObjectAsync"
    :call-fn-link-async="callFnLinkAsync"
    :anchor="anchor"
  />
</template>

<script lang="ts" setup>
import type { Component, Slot } from "vue"
import { ref, shallowRef, toRaw, watch } from "vue"

import type {
  _Encode,
  _getListLink,
  callFnLink,
  Data,
  readLinkObject
} from "../logic/Encode"

import ConsoleValue from "./ConsoleValue.vue"
import type { Promisy } from "./Promisy"

const props = defineProps<{
  getter: Data.Link

  anchor:
    | Component<{
        href: string
      }>
    | Slot
    | string
    | ((...args: unknown[]) => Component)

  // api
  _getListLinkAsync: Promisy<typeof _getListLink>
  readLinkObjectAsync: Promisy<typeof readLinkObject>
  callFnLinkAsync: Promisy<typeof callFnLink>
}>()

const getted = ref(false)
const value = shallowRef<ReturnType<typeof _Encode>>()
const watcher = watch(getted, () => {
  watcher()

  getted.value = true

  // eslint-disable-next-line promise/catch-or-return
  props.callFnLinkAsync(toRaw(props.getter)).then((response) => {
    value.value = response

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
    // @ts-ignore
    // eslint-disable-next-line promise/always-return
    if (import.meta.env.NODE_ENV !== "production") {
      console.log("valueof", value.value)
    }
  })
  // value.value = callFnLink(props.getter)
})
</script>

<style lang="scss" scoped>
.ml-0 {
  margin-left: 0;
}
</style>
