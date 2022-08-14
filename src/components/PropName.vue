<template>
  <span
    class="propName"
    :class="{
      propHidden: hidden,
      proto: name.startsWith('[['),
    }"
    >{{ name }}<span class="is">:</span>
  </span>
</template>

<script lang="ts" setup>
defineProps<{
  hidden: boolean;
  name: string;
}>();
</script>

<style lang="scss" scoped>
@import "./styles.scss";
</style>
