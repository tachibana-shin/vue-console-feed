<template>
  <div>
    <template v-for="(item, index) in data" :key="index">
      <ConsoleGroup
        v-if="isGroup(item)"
        :data="item"
        :_get-list-link-async="_getListLinkAsync ?? _getListLinkAsyncDefault"
        :read-link-object-async="
          readLinkObjectAsync ?? readLinkObjectAsyncDefault
        "
        :call-fn-link-async="callFnLinkAsync ?? callFnLinkAsyncDefault"
        :anchor="Anchor"
      />
      <ConsoleTable
        v-else-if="item.type === 'table'"
        :data="item.data"
        :_get-list-link-async="_getListLinkAsync ?? _getListLinkAsyncDefault"
        :read-link-object-async="
          readLinkObjectAsync ?? readLinkObjectAsyncDefault
        "
        :call-fn-link-async="callFnLinkAsync ?? callFnLinkAsyncDefault"
        :anchor="Anchor"
      />
      <ConsoleItem
        v-else
        :data="item.data"
        :type="item.type"
        :count="item.count"
        :_get-list-link-async="_getListLinkAsync ?? _getListLinkAsyncDefault"
        :read-link-object-async="
          readLinkObjectAsync ?? readLinkObjectAsyncDefault
        "
        :call-fn-link-async="callFnLinkAsync ?? callFnLinkAsyncDefault"
        :anchor="Anchor"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import type { Component, Slot } from "vue"
import { computed, useSlots } from "vue"

import { isGroup } from "../logic/DataAPI"
import type { DataAPI } from "../logic/DataAPI"
import type { _getListLink, callFnLink, readLinkObject } from "../logic/Encode"

import ConsoleGroup from "./ConsoleGroup.vue"
import ConsoleItem from "./ConsoleItem.vue"
import ConsoleTable from "./ConsoleTable.vue"
import type { Promisy } from "./Promisy"
import {
  _getListLinkAsync as _getListLinkAsyncDefault,
  callFnLinkAsync as callFnLinkAsyncDefault,
  readLinkObjectAsync as readLinkObjectAsyncDefault
} from "./api-async-defaults"

const props = defineProps<{
  data: DataAPI<true>["value"]

  anchor?:
    | Component<{
        href: string
      }>
    | Slot
    | string

  // api
  _getListLinkAsync?: Promisy<typeof _getListLink>
  readLinkObjectAsync?: Promisy<typeof readLinkObject>
  callFnLinkAsync?: Promisy<typeof callFnLink>
}>()
const $slots = useSlots()

const Anchor = computed(() => props.anchor ?? $slots.anchor ?? "a")
</script>
