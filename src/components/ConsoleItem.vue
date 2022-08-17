<template>
  <div class="console-item">
    <ConsoleValue :data="data" is-lg />
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
  font-family: Consolas, Lucida Console, Courier New, monospace, sans-serif;
  white-space: pre-wrap;

  // theme
  background-color: #202124;
  color: #ffffff;
  font-size: 14px;

  :deep(.console-link) {
    color: rgb(177, 177, 177);
    text-decoration: underline;
  }
  :deep(.color-white) {
    color: white;
  }
}
</style>
