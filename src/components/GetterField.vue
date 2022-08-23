<template>
  <span @click="getted = true" v-if="!getted || !value">(…)</span>
  <ConsoleValue
    :data="value!"
    v-else
    class="inline !ml-0"
    :_get-list-link-async="_getListLinkAsync"
    :read-link-object-async="readLinkObjectAsync"
  />
</template>

<script lang="ts" setup>
import { ref, shallowRef, watch } from "vue"
import ConsoleValue from "./ConsoleValue.vue"

import {
  Data,
  callFnLink,
  Encode,
  _getListLink,
  readLinkObject
} from "../logic/Encode"
import { Promisy } from "./Promisy"

const props = defineProps<{
  getter: Data.Link
  callFnLinkAsync: Promisy<typeof callFnLink>

  // api
  _getListLinkAsync: Promisy<typeof _getListLink>
  readLinkObjectAsync: Promisy<typeof readLinkObject>
}>()

const getted = ref(false)
const value = shallowRef<ReturnType<typeof Encode>>()
const watcher = watch(getted, () => {
  watcher()

  getted.value = true

  props.callFnLinkAsync(props.getter).then((response) => {
    value.value = response

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
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
