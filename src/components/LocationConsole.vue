<template>
  <a class="console-link" :href="location" target="_blank">
    {{ location.slice(location.lastIndexOf("/") + 1) }}
  </a>
</template>

<script lang="ts" setup>
defineProps<{
  location: string
}>()
</script>

<style lang="scss" scoped>
@import "./location-console.scss";
</style>
