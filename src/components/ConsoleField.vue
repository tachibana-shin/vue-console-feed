<template>
  <div
    v-if="
      data['@t'] === 'string' ||
      data['@t'] === 'number' ||
      data['@t'] === 'bint' ||
      data['@t'] === 'symbol' ||
      data['@t'] === 'nill'
    "
    class="ml-[12px]"
  >
    <slot />
    <ConsoleFieldPreview :data="data" full />
  </div>
  <Collapse v-else-if="data['@t'] === 'function'" :flat="flat">
    <slot />
    <span class="function">
      <span class="char-f">ƒ</span>
      {{ data["@name"] }}
    </span>

    <template v-slot:content>
      <ConsoleLink
        v-if="data['@real']['@t'] === 'link'"
        :link="(data['@real'] as Data.Link)"
      />
      <ConsoleField
        v-else
        :data="{
          '@t': 'object',
          '@name': null,
          '@real': data['@real']
        }"
        flat
      />
    </template>
  </Collapse>
  <Collapse v-else-if="data['@t'] === 'collection'" :flat="flat">
    <slot />
    <span class="array-size">
      {{ data["@name"]
      }}<template v-if="data['@size'] !== null">({{ data["@size"] }})</template>
    </span>
    <template v-if="data['@size'] === 0">
      {size: {{ data["@size"] }}}
    </template>
    <template v-else-if="data['@size'] !== null">
      {<span v-for="(item, index) in data['@entries']" :key="index">
        <span v-if="data['@name'].endsWith('Map')">
          <ConsoleFieldPreview :data="item[0]" /> =>
          <ConsoleFieldPreview :data="item[1]" />
        </span>
        <span v-else> <ConsoleFieldPreview :data="item[0]" /> </span>
        <span v-if="index < data['@size'] - 1" class="comma">,</span> </span
      >}
    </template>
    <template v-else>{}</template>

    <template v-slot:summary-opened>
      <slot />
      {{ data["@name"]
      }}<template v-if="data['@size'] !== null">({{ data["@size"] }})</template>
    </template>

    <template v-slot:content>
      <Collapse show>
        <PropName :hidden="false" name="[[Entries]]" />

        <template v-slot:content>
          <Collapse v-for="(item, index) in data['@entries']" :key="index">
            <PropName :hidden="false" :name="index + ''" />
            <span v-if="data['@name'].endsWith('Map')">
              {<ConsoleFieldPreview :data="item[0]" /> =>
              <ConsoleFieldPreview :data="item[1]" show-name-fn />}
            </span>
            <span v-else>
              <ConsoleFieldPreview :data="item[0]" show-name-fn />
            </span>

            <template v-slot:content>
              <ConsoleField
                :data="{
                  '@t': 'object',
                  '@name': null,
                  '@real': {
                    ...(data['@name'].endsWith('Map')
                      ? {
                          key: {
                            '@hidden': false,
                            '@value': item[0]
                          }
                        }
                      : {}),
                    value: {
                      '@hidden': false,
                      '@value': item[1]
                    }
                  }
                }"
                flat
              />
            </template>
          </Collapse>
        </template>
      </Collapse>

      <ConsoleField
        :data="{
          '@t': 'object',
          '@name': null,
          '@real': data['@real']
        }"
        flat
      />
    </template>
    <!-- {{ item }} -->
  </Collapse>
  <!-- object -->
  <Collapse v-else-if="data['@t'] === 'regexp'" class="regexp" :flat="flat">
    <slot />
    {{ data["@name"] }}

    <template v-slot:content>
      <ConsoleField
        :data="{
          '@t': 'object',
          '@name': null,
          '@real': data['@real']
        }"
        flat
      />
    </template>
  </Collapse>
  <Collapse v-else-if="data['@t'] === 'object'" :flat="flat">
    <slot />
    <span class="array-size" v-if="!hideNameObject">{{ data["@name"] }}</span>
    {<template v-for="(item, name) in data['@des']['@value']" :key="name">
      <PropName :hidden="item['@hidden']" :name="name + ''" />
      <ConsoleFieldPreview :data="item['@value']" hide-name-object />
      <span class="comma" v-if="name !== data['@des']['@lastKey']"
        >,</span
      > </template
    >}

    <template v-slot:summary-opened>
      <slot />
      <template v-if="!hideNameObject">{{ data["@name"] }}</template>
    </template>

    <template v-slot:content>
      <!-- @real is link -->
      <ConsoleLink
        v-if="data['@real']?.['@t'] === 'link'"
        :link="(data['@real'] as Data.Link)"
      />
      <!-- /@real is link -->

      <template
        v-else
        v-for="(item, name) in (data['@real'] as Data.objReal)"
        :key="name"
      >
        <!-- get/set -->
        <template v-if="item['@value']['@t'] === 'gs'">
          <!-- @value -->
          <div class="ml-[12px]">
            <PropName :hidden="item['@hidden']" :name="name + ''" />
            <GetterField :getter="item['@value']['@value']" />
          </div>
          <!-- /@value -->

          <ConsoleField
            v-for="(encoded, actName) in item['@value']['@at']"
            :key="actName"
            :data="encoded!"
          >
            <PropName hidden :name="actName + ' ' + name" />
          </ConsoleField>
        </template>
        <!-- link -->
        <!-- function -->
        <!-- collection -->
        <!-- regexp -->
        <!-- error -->

        <!-- str, num, bint, collection, nill -->
        <ConsoleField
          v-else
          :data="item['@value']"
          :hide-name-object="
            typeof name === 'string' && !(name as string)?.startsWith('[[') && (item['@value'] as any)?.['@name'] === 'Object'
          "
        >
          <PropName :hidden="item['@hidden']" :name="name + ''" />
        </ConsoleField>
      </template>
      <!-- /@real -->
    </template>
  </Collapse>
  <Collapse v-else-if="data['@t'] === 'error'">
    <slot />
    {{ data["@stack"] }}

    <template v-slot:content>
      <ConsoleField
        :data="{
          '@t': 'object',
          '@name': null,
          '@real': data['@real']
        }"
        flat
      />
    </template>
  </Collapse>
  <Collapse v-else-if="data['@t'] === 'array'" :flat="flat">
    <slot />
    <span class="array-size" v-if="data['@name']">{{ data["@name"] }}</span>
    <span class="array-size"
      >({{ data["@real"].length["@value"]["@value"] }})</span
    >
    [<template
      v-for="item in +data['@real'].length['@value']['@value']"
      :key="item"
    >
      <ConsoleFieldPreview
        :data="(data['@real'][item - 1]['@value'] as Exclude<typeof data['@real'][0]['@value'], Data.GetSetter>)"
        hide-name-object
      />
      <span
        v-if="+data['@real'].length['@value']['@value'] > item"
        class="comma"
        >,</span
      > </template
    >]

    <template v-slot:summary-opened>
      <slot />
      {{ data["@name"] ?? "Array" }} ({{
        data["@real"].length["@value"]["@value"]
      }})
    </template>

    <template v-slot:content>
      <ConsoleField
        :data="{
          '@t': 'object',
          '@name': null,
          '@real': data['@real']
        }"
        flat
      />
    </template>
  </Collapse>
  <Collapse v-else-if="data['@t'] === 'link'" :flat="flat">
    <slot />
    <template v-if="data['@type'] === 'object'">
      fake:{{ data["@name"] }}{...}
    </template>
    <template v-else>
      <span class="char-f">ƒ</span> {{ data["@name"] }}
    </template>

    <template v-slot:content>
      <ConsoleLink :link="data" />
    </template>
  </Collapse>
  <div v-else>
    <slot />
    Nothing {{ data }}
  </div>
</template>

<script lang="ts" setup>
import { Data, Encode } from "../logic/Encode"
import _ConsoleField from "./ConsoleField.vue"
import ConsoleLink from "./ConsoleLink.vue"
import Collapse from "./Collapse.vue"
import PropName from "./PropName.vue"
import ConsoleFieldPreview from "./ConsoleFieldPreview.vue"
import _GetterField from "./GetterField.vue"
import { DefineComponent } from "vue"

const ConsoleField = _ConsoleField as unknown as DefineComponent<{
  data: ReturnType<typeof Encode>
  hideNameObject?: boolean
  flat?: boolean
}>
const GetterField = _GetterField as unknown as DefineComponent<{
  getter: Data.Link
}>

defineProps<{
  data: ReturnType<typeof Encode>
  flat?: boolean
  hideNameObject?: boolean
}>()
</script>

<style lang="scss" scoped>
@import "./styles.scss";
// color: rgb(85, 106, 242);

div {
  font-family: monospace;
}
</style>
