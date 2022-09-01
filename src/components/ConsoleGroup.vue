<template>
  <Collapse
    show
    class-detail="console-colors l0 line-throught"
    class-summary="console-colors svg-top"
    style="border-bottom: 1px solid var(--c-border)"
    :padding-left="paddingLeftComputed"
  >
    <template v-slot:summary>
      <ConsoleItem
        :data="data['@key']"
        type="log"
        class="children:ml-0 border-b-none min-w-0"
        :_get-list-link-async="_getListLinkAsync ?? _getListLinkAsyncDefault"
        :read-link-object-async="
          readLinkObjectAsync ?? readLinkObjectAsyncDefault
        "
        :call-fn-link-async="callFnLinkAsync ?? callFnLinkAsyncDefault"
        :anchor="Anchor"
        @click.stop="void 0"
      />
    </template>

    <template v-slot:content>
      <template v-for="(item, index) in data['@items']" :key="index">
        <ConsoleGroup
          v-if="'@items' in item"
          :data="item"
          :_get-list-link-async="_getListLinkAsync ?? _getListLinkAsyncDefault"
          :read-link-object-async="
            readLinkObjectAsync ?? readLinkObjectAsyncDefault
          "
          :call-fn-link-async="callFnLinkAsync ?? callFnLinkAsyncDefault"
          :anchor="Anchor"
          :padding-left="paddingLeftComputed"
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
          :style="{
            paddingLeft: paddingLeftComputed + 'px'
          }"
        />
        <ConsoleItem
          v-else
          :data="item.data"
          :count="item.count"
          :type="item.type"
          :_get-list-link-async="_getListLinkAsync ?? _getListLinkAsyncDefault"
          :read-link-object-async="
            readLinkObjectAsync ?? readLinkObjectAsyncDefault
          "
          :call-fn-link-async="callFnLinkAsync ?? callFnLinkAsyncDefault"
          :anchor="Anchor"
          :style="{
            paddingLeft: paddingLeftComputed + 'px'
          }"
        />
      </template>
    </template>
  </Collapse>
</template>

<script lang="ts" setup>
import type { Component, DefineComponent, Slot } from "vue"
import { computed, useSlots } from "vue"

import type { GroupData } from "../logic/DataAPI"
import type {
  _getListLink,
  callFnLink,
  readLinkObject
} from "../logic/Encode"

import Collapse from "./Collapse.vue"
import _ConsoleGroup from "./ConsoleGroup.vue"
import ConsoleItem from "./ConsoleItem.vue"
import ConsoleTable from "./ConsoleTable.vue"
import type { Promisy } from "./Promisy"
import {
  _getListLinkAsync as _getListLinkAsyncDefault,
  callFnLinkAsync as callFnLinkAsyncDefault,
  readLinkObjectAsync as readLinkObjectAsyncDefault
} from "./api-async-defaults"

const props = withDefaults(
  defineProps<{
    data: GroupData

    // @ui
    paddingLeft?: number

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
  }>(),
  { paddingLeft: 0 }
)
const ConsoleGroup = _ConsoleGroup as unknown as DefineComponent<{
  data: GroupData

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
}>
const $slots = useSlots()

const Anchor = computed(() => props.anchor ?? $slots.anchor ?? "a")

const paddingLeftComputed = computed(() => props.paddingLeft + 12)
</script>

<style lang="scss" scoped>
.children\:ml-0:deep(> *) {
  margin-left: 0 !important;
}
.border-b-none {
  border-bottom: none;
}
.min-w-0 {
  min-width: 0;
}
</style>
