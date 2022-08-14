<template>
  <ConsoleField
    :data="dataLoad"
    :flat="link['@type'] === 'function' || link['@type'] === 'object'"
  />
</template>

<script lang="ts" setup>
import { ref, shallowRef, watch, useAttrs, DefineComponent } from 'vue';
import { Data, Encode, readLinkObject } from '../logic/Encode';
import _ConsoleField from './ConsoleField.vue';

const ConsoleField = _ConsoleField as unknown as DefineComponent<{
  data: ReturnType<typeof Encode>;
  hideNameObject?: boolean;
  flat?: boolean;
}>;

const props = defineProps<{
  link: Data.Link;
}>();

const dataLoad = shallowRef();

dataLoad.value = readLinkObject(props.link);
console.log({ data: dataLoad.value });
</script>
