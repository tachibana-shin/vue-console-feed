<template>
  <ConsoleValue
    v-if="data"
    :data="data"
    :flat="link['@type'] === 'function' || link['@type'] === 'object'"
  />
  <template v-else>loading...</template>
</template>

<script lang="ts" setup>
import { DefineComponent, shallowRef, watchEffect } from "vue"
import { Data, Encode, readLinkObject } from "../logic/Encode"
import _ConsoleValue from "./ConsoleValue.vue"
import { Promisy } from "./Promisy"

const ConsoleValue = _ConsoleValue as unknown as DefineComponent<{
  data: ReturnType<typeof Encode>
  hideNameObject?: boolean
  flat?: boolean
}>

const props = defineProps<{
  link: Data.Link

  // @api
  readLinkObjectAsync: Promisy<typeof readLinkObject>
}>()

const data = shallowRef<ReturnType<typeof readLinkObject>>()
watchEffect(() => {
  props
    .readLinkObjectAsync(props.link)
    .then((response) => (data.value = response))
})

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
if (import.meta.env.NODE_ENV !== "production")
  console.log(readLinkObject(props.link))
</script>
