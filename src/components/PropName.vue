<template>
  <span
    class="propName"
    :class="{
      propHidden: hidden,
      proto: name.startsWith('[['),
      propPreview: preview
    }"
    >{{ name }}<span class="is">:</span>
  </span>
</template>

<script lang="ts" setup>
defineProps<{
  hidden: boolean
  name: string

  preview?: boolean
}>()
</script>

<style lang="scss" scoped>
@import "./styles.scss";
</style>
