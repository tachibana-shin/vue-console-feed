<template>
  <ConsoleField
    :data="dataLoad"
    :flat="link['@type'] === 'function' || link['@type'] === 'object'"
  />
</template>

<script lang="ts" setup>
import { shallowRef, DefineComponent } from "vue"
import { Data, Encode, readLinkObject } from "../logic/Encode"
import _ConsoleField from "./ConsoleField.vue"

const ConsoleField = _ConsoleField as unknown as DefineComponent<{
  data: ReturnType<typeof Encode>
  hideNameObject?: boolean
  flat?: boolean
}>

const props = defineProps<{
  link: Data.Link
}>()

const dataLoad = shallowRef()

dataLoad.value = readLinkObject(props.link)
console.log({ data: dataLoad.value })
</script>
