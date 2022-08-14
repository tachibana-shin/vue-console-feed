<template>
  <ConsoleField
    :data="dataLoad"
    :flat="link['@type'] === 'function' || link['@type'] === 'object'"
  />
</template>

<script lang="ts" setup>
import { ref, shallowRef, watch, useAttrs } from 'vue';
import { Data, readLinkObject } from '../logic/Encode';
import ConsoleField from './ConsoleField.vue';

const props = defineProps<{
  link: Data.Link;
}>();

const dataLoad = shallowRef();

dataLoad.value = readLinkObject(props.link);
console.log({ data: dataLoad.value });
</script>
