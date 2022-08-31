<template>
  <component
    :is="
      createAnchor(anchor, {
        href: location,
        text: location.slice(location.lastIndexOf('/') + 1)
      })
    "
  />
</template>

<script lang="ts" setup>
import type { Component, Slot } from "vue"

import { createAnchor } from "../logic/createAnchor"

defineProps<{
  location: string
  anchor:
    | Component<{
        href: string
      }>
    | Slot
    | string
    | ((...args: unknown[]) => Component)
}>()
</script>
