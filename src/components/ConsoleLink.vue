<template>
  <ConsoleValue
    v-if="data"
    :data="data"
    flat
    :_get-list-link-async="_getListLinkAsync"
    :read-link-object-async="readLinkObjectAsync"
    :call-fn-link-async="callFnLinkAsync"
    :anchor="anchor"
  />
  <template v-else>loading...</template>
</template>

<script lang="ts" setup>
import { DefineComponent, shallowRef, watchEffect, toRaw, Component } from "vue"
import {
  Data,
  _Encode,
  readLinkObject,
  callFnLink,
  _getListLink
} from "../logic/Encode"
import _ConsoleValue from "./ConsoleValue.vue"
import { Promisy } from "./Promisy"

const ConsoleValue = _ConsoleValue as unknown as DefineComponent<{
  data: ReturnType<typeof _Encode>
  hideNameObject?: boolean
  flat?: boolean
}>

const props = defineProps<{
  link: Data.Link

  anchor: Component<{
    href: string
  }>

  // @api
  _getListLinkAsync: Promisy<typeof _getListLink>
  readLinkObjectAsync: Promisy<typeof readLinkObject>
  callFnLinkAsync: Promisy<typeof callFnLink>
}>()

const data = shallowRef<ReturnType<typeof readLinkObject>>()
watchEffect(() => {
  props
    .readLinkObjectAsync(toRaw(props.link))
    .then((response) => (data.value = response))
})

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
if (import.meta.env.NODE_ENV !== "production")
  props.readLinkObjectAsync(toRaw(props.link)).then((res) => console.log(res))
</script>
