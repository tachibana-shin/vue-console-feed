<template>
  <ConsoleValue
    :data="readLinkObject(link)"
    :flat="link['@type'] === 'function' || link['@type'] === 'object'"
  />
</template>

<script lang="ts" setup>
import { DefineComponent } from "vue"
import { Data, Encode, readLinkObject } from "../logic/Encode"
import _ConsoleValue from "./ConsoleValue.vue"

const ConsoleValue = _ConsoleValue as unknown as DefineComponent<{
  data: ReturnType<typeof Encode>
  hideNameObject?: boolean
  flat?: boolean
}>

const props = defineProps<{
  link: Data.Link
}>()

if (import.meta.env.NODE_ENV !== "production") console.log(readLinkObject(props.link))
</script>
