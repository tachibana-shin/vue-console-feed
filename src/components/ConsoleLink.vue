<template>
  <ConsoleField
    :data="readLinkObject(link)"
    :flat="link['@type'] === 'function' || link['@type'] === 'object'"
  />
</template>

<script lang="ts" setup>
import { DefineComponent } from "vue"
import { Data, Encode, readLinkObject } from "../logic/Encode"
import _ConsoleField from "./ConsoleField.vue"

const ConsoleField = _ConsoleField as unknown as DefineComponent<{
  data: ReturnType<typeof Encode>
  hideNameObject?: boolean
  flat?: boolean
}>

defineProps<{
  link: Data.Link
}>()
</script>
