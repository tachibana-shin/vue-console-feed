<template>
  <span v-if="t === 'string'" class="string">'{{ data['@value'] }}'</span>
  <span v-else-if="t === 'number'" class="number">{{ data['@value'] }}</span>
  <span v-else-if="t === 'bint'" class="bint">{{ data['@value'] }}</span>
  <span v-else-if="t === 'symbol'" class="symbol">{{ data['@value'] }}</span>
  <span v-else-if="t === 'nill'" class="nill">{{ data['@value'] }}</span>
  <template v-else-if="t === 'object'">
    <template v-if="!hideNameObject">{{ data['@name'] }}</template>
    {...}</template
  >
  <template v-else-if="t === 'error'">{{ data['@stack'] }}</template>
  <template v-else-if="t === 'regexp'">
    <span class="regexp">
      {{ data['@name'] }}
    </span>
  </template>
  <template v-else-if="t === 'collection'">
    {{ data['@name']
    }}<template v-if="data['@size'] !== null">({{ data['@size'] }})</template>
  </template>
  <template v-else-if="t === 'array'">Array({{ data['@size'] }})</template>
  <template v-else-if="t === 'function'">
    <template v-if="showNameFn"> {{ data['@name'] }}</template>
    <template v-else>ƒ</template>
  </template>
  <template v-else>nothing</template>
</template>

<script lang="ts" setup>
const props = defineProps<{
  data: DataPreview.objReal[''];
  hideNameObject?: boolean;
  showNameFn?: boolean;
}>();
const t = props.data['@t'];
</script>

<style lang="scss" scoped>
@import './styles.scss';
</style>
