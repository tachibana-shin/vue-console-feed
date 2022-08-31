<template>
  <Collapse
    show
    class-detail="l0"
    style="border-bottom: 1px solid #3a3a3a"
    :style="{
      'padding-left': paddingLeftComputed + 'px'
    }"
  >
    <template v-slot:summary>
      <ConsoleItem
        :data="data['@key']"
        type="log"
        class="children:ml-0 border-b-none"
        :_get-list-link-async="_getListLinkAsync ?? _getListLinkAsyncDefault"
        :read-link-object-async="
          readLinkObjectAsync ?? readLinkObjectAsyncDefault
        "
        :call-fn-link-async="callFnLinkAsync ?? callFnLinkAsyncDefault"
        :anchor="Anchor"
      />
    </template>

    <template v-slot:content>
      <template v-for="(item, index) in data['@items']" :key="item">
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

<style lang="scss" scoped>
.children\:ml-0:deep(> *) {
  margin-left: 0 !important;
}
.border-b-none {
  border-bottom: none;
}
</style>

<script lang="ts" setup>
import { _Encode } from "../logic/Encode"
import {
  _getListLinkAsync as _getListLinkAsyncDefault,
  callFnLinkAsync as callFnLinkAsyncDefault,
  readLinkObjectAsync as readLinkObjectAsyncDefault
} from "./api-async-defaults"
import { useSlots, computed, DefineComponent } from "vue"
import Collapse from "./Collapse.vue"
import ConsoleItem from "./ConsoleItem.vue"
import _ConsoleGroup from "./ConsoleGroup.vue"

interface ConsoleItemData {
  data: ReturnType<typeof _Encode>
  count: number
  type: "warn" | "info" | "debug" | "error" | "output" | "log"
}
interface ConsoleGroupData {
  "@key": ReturnType<typeof _Encode>
  "@items": (ConsoleItemData | ConsoleGroupData)[]
}

const props = withDefaults(
  defineProps<{
    data: ConsoleGroupData

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
  data: ConsoleGroupData

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
