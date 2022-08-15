<template>
  <span @click="getted = true" v-if="!getted && value">(...)</span>
  <ConsoleValue :data="value!" v-else class="inline ml-0" />
</template>

<script lang="ts" setup>
import { ref, watch } from "vue"
import ConsoleValue from "./ConsoleValue.vue"

import { Data, callFnLink, Encode } from "../logic/Encode"

const props = defineProps<{
  getter: Data.Link
}>()

const getted = ref(false)
const value = ref<ReturnType<typeof Encode>>()
const watcher = watch(getted, () => {
  watcher()

  getted.value = true

  value.value = callFnLink(props.getter)

  if (import.meta.env.NODE_ENV !== "production") {
    console.log("valueof", value.value)
  }
})
</script>

<style lang="scss" scoped>
.ml-0 {
  margin-left: 0;
}
</style>
