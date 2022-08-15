<template>
  <div class="console-item">
    <ConsoleValue :data="data" />
  </div>
</template>

<script lang="ts" setup>
import { Encode } from "../logic/Encode"
import ConsoleValue from "./ConsoleValue.vue"

defineProps<{
  data: ReturnType<typeof Encode>
}>()
</script>

<style lang="scss" scoped>
.console-item {
  font-family: monospace, sans-serif;
  white-space: pre-wrap;

  // theme
  background-color: #202124;
  color: #ffffff;
  font-size: 14px;
}
</style>
