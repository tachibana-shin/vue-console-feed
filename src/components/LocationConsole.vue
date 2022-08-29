<template>
  <component
    :is="
      createAnchor(anchor, {
        class: 'console-link',
        href: location,
        text: location.slice(location.lastIndexOf('/') + 1)
      })
    "
  />
</template>

<script lang="ts" setup>
import { Component } from "vue";
import { createAnchor } from "../logic/createAnchor"

defineProps<{
  location: string
  anchor: Component<{
    href: string
  }>
}>()
</script>

<style lang="scss" scoped>
@import "./location-console.scss";
</style>
