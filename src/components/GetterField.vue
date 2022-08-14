<template>
  <div @click="getted = true" v-if="!getted">(...)</div>
  <ConsoleField :data="value" v-else />
</template>

<script lang="ts" setup>
import { ref, watch } from "vue"
import ConsoleField from "./ConsoleField.vue"

import { Data, callFnLink } from "../logic/Encode"

const props = defineProps<{
  getter: Data.Link
}>()

const getted = ref(false)
const value = ref()
const watcher = watch(getted, () => {
  watcher()

  getted.value = true

  value.value = callFnLink(props.getter)

  if (import.meta.env.NODE_ENV !== "production") {
    console.log("valueof", value.value)
  }
})
</script>
