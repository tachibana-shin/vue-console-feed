<template>
  <span v-if="data['@t'] === 'string'" class="string">
    <template v-if="full"
      >"{{
        data["@value"].replace(/"/g, '\\"').replace(/\\n/g, "\\\n")
      }}"</template
    ><template v-else
      >'{{
        data["@value"].replace(/'/g, "\\'").replace(/\\n/g, "\\\n")
      }}'</template
    >
  </span>
  <span v-else-if="data['@t'] === 'number'" class="number">{{
    data["@value"]
  }}</span>
  <span v-else-if="data['@t'] === 'bint'" class="bint">{{
    data["@value"]
  }}</span>
  <span v-else-if="data['@t'] === 'symbol'" class="symbol">{{
    data["@value"]
  }}</span>
  <span v-else-if="data['@t'] === 'nill'" class="nill">{{
    data["@value"]
  }}</span>
  <template v-else-if="data['@t'] === 'object'">
    <template v-if="!hideNameObject">{{ data["@name"] }}</template>
    {...}</template
  >
  <template v-else-if="data['@t'] === 'error'">{{ data["@stack"] }}</template>
  <template v-else-if="data['@t'] === 'regexp'">
    <span class="regexp">
      {{ data["@name"] }}
    </span>
  </template>
  <template v-else-if="data['@t'] === 'collection'">
    {{ data["@name"]
    }}<template v-if="data['@size'] !== null">({{ data["@size"] }})</template>
  </template>
  <template v-else-if="data['@t'] === 'array'"
    >{{ data["@name"] ?? "Array" }}({{ data["@size"] }})</template
  >
  <template v-else-if="data['@t'] === 'function'">
    <template v-if="showNameFn"> {{ data["@name"] }}</template>
    <template v-else>ƒ</template>
  </template>
  <template v-else-if="data['@t'] === 'element'">
    <span class="element-tag">{{
      data["@name"].toLowerCase().replace(/^#/, "")
    }}</span>
  </template>
  <template v-else>nothing</template>
</template>

<script lang="ts" setup>
import { DataPreview } from "../logic/Encode"

defineProps<{
  data: DataPreview.objReal[""]["@value"]
  hideNameObject?: boolean
  showNameFn?: boolean
  full?: boolean
}>()
</script>

<style lang="scss" scoped>
@import "./styles.scss";
</style>
