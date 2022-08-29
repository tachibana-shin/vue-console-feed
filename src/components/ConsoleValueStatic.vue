<template>
  <span v-if="data['@t'] === 'string'" :class="isLog ? undefined : 'string'">
    <template v-if="first">
      <component
        :is="
          h(
            'span',
            parseLink(data['@value'], {
              classes: 'color-white',
              component: anchor
            })
          )
        "
      />
    </template>
    <template v-else-if="full"
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
    <template v-if="!hideNameObject">{{ data["@name"] }}</template
    >{…}</template
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
  <template
    v-else-if="
      data['@t'] === 'array' ||
      data['@t'] === 'typedarray' ||
      data['@t'] === 'buffer' ||
      data['@t'] === 'dataview'
    "
    >{{ data["@name"] ?? "Array" }}({{ data["@size"] }})</template
  >
  <template v-else-if="data['@t'] === 'function'">ƒ</template>
  <template v-else-if="data['@t'] === 'element'">
    <span class="element-tag">{{
      data["@name"].toLowerCase().replace(/^#/, "")
    }}</span>
  </template>
  <template v-else-if="data['@t'] === 'promise'">Promise</template>
  <template v-else-if="data['@t'] === 'date'">{{ data["@value"] }}</template>
  <template v-else-if="data['@t'] === 'gs'">(…)</template>
  <template v-else>nothing</template>
</template>

<script lang="ts" setup>
import type { Component, Slot} from "vue";
import { h } from "vue"

import type { Data, DataPreview } from "../logic/Encode"
import { parseLink } from "../logic/parseLink"

defineProps<{
  data: DataPreview.objReal[""]["@value"] | Data.GetSetter
  hideNameObject?: boolean
  full?: boolean
  isLog?: boolean
  first?: boolean

  anchor: Component<{
    href: string
  }>| Slot | string
}>()
</script>

<style lang="scss" scoped>
@import "./styles.scss";
</style>
