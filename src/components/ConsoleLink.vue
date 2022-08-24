<template>
  <ConsoleValue
    v-if="data"
    :data="data"
    :flat="link['@type'] === 'function' || link['@type'] === 'object'"
    :_get-list-link-async="_getListLinkAsync"
    :read-link-object-async="readLinkObjectAsync"
    :call-fn-link-async="callFnLinkAsync"
    
  />
  <template v-else>loading...</template>
</template>

<script lang="ts" setup>
import { DefineComponent, shallowRef, watchEffect } from "vue"
import { Data, Encode, readLinkObject , callFnLink, _getListLink} from "../logic/Encode"
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
  _getListLinkAsync: Promisy<typeof _getListLink>
  readLinkObjectAsync: Promisy<typeof readLinkObject>
  callFnLinkAsync: Promisy<typeof callFnLink>
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
  console.log(props.readLinkObjectAsync(props.link))
</script>
