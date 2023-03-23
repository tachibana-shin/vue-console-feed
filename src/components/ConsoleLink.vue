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
import type { Component, DefineComponent, Slot } from "vue"
import { shallowRef, toRaw, watchEffect } from "vue"

import type {
  _Encode,
  _getListLink,
  callFnLink,
  Data,
  readLinkObject
} from "../logic/Encode"

import _ConsoleValue from "./ConsoleValue.vue"
import type { Promisy } from "./Promisy"

const ConsoleValue = _ConsoleValue as unknown as DefineComponent<{
  data: ReturnType<typeof _Encode>
  hideNameObject?: boolean
  flat?: boolean

  anchor:
    | Component<{
        href: string
      }>
    | Slot
    | string
    | ((...args: unknown[]) => Component)
}>

const props = defineProps<{
  link: Data.Link

  anchor:
    | Component<{
        href: string
      }>
    | Slot
    | string
    | ((...args: unknown[]) => Component)

  // @api
  _getListLinkAsync: Promisy<typeof _getListLink>
  readLinkObjectAsync: Promisy<typeof readLinkObject>
  callFnLinkAsync: Promisy<typeof callFnLink>
}>()

const data = shallowRef<ReturnType<typeof readLinkObject>>()
watchEffect(() => {
  // eslint-disable-next-line promise/catch-or-return
  props
    .readLinkObjectAsync(toRaw(props.link))
    .then((response) => (data.value = response))
})

// eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
// @ts-ignore
if (import.meta.env.DEV)
  // eslint-disable-next-line promise/catch-or-return
  props.readLinkObjectAsync(toRaw(props.link)).then((res) => {
    console.log(res)
  })
</script>
