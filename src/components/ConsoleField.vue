<template>
  <div
    v-if="
      t === 'string' ||
      t === 'number' ||
      t === 'bint' ||
      t === 'symbol' ||
      t === 'nill'
    "
  >
    <slot />
    <ConsoleFieldPreview :data="data" />
  </div>
  <Collapse v-else-if="t === 'function'" class="function" :flat="flat">
    <slot />
    <div class="function">
      <span class="char-f">ƒ</span>
      {{ data['@name'] }}
    </div>

    <template v-slot:content>
      <ConsoleField
        :data="
          data['@real']['@t'] === 'link'
            ? data['@real']
            : {
                '@t': 'object',
                '@real': data['@real'],
              }
        "
        flat
      />
    </template>
  </Collapse>
  <Collapse v-else-if="t === 'collection'" :flat="flat">
    <slot />
    <span class="array-size">
      {{ data['@name']
      }}<template v-if="data['@size'] !== null">({{ data['@size'] }})</template>
    </span>
    <template v-if="data['@size'] === 0">
      {size: {{ data['@size'] }}}
    </template>
    <template v-else>
      {<span v-for="(item, index) in data['@entries']" :key="index">
        <span v-if="data['@name'].endsWith('Map')">
          <ConsoleFieldPreview :data="item[0]" /> =>
          <ConsoleFieldPreview :data="item[1]" />
        </span>
        <span v-else> <ConsoleFieldPreview :data="item[0]" /> </span
        ><template v-if="index < data['@size'] - 1">, </template></span
      >}</template
    >

    <template v-slot:summary-opened>
      {{ data['@name']
      }}<template v-if="data['@size'] !== null">({{ data['@size'] }})</template>
    </template>

    <template v-slot:content>
      <Collapse show>
        <slot />
        <PropName :hidden="false" name="[[Entries]]" />

        <template v-slot:content>
          <Collapse
            v-for="(item, index) in data['@entries']"
            class="flex"
            :key="index"
          >
            <PropName :hidden="false" :name="index + ''" />
            <span v-if="data['@name'].endsWith('Map')">
              {<ConsoleFieldPreview :data="item[0]" /> =>
              <ConsoleFieldPreview :data="item[1]" show-name-fn />}
            </span>
            <span v-else>
              <ConsoleFieldPreview :data="item[0]" show-name-fs />
            </span>

            <template v-slot:content>
              <ConsoleField
                :data="{
                  '@t': 'object',
                  '@real': {
                    ...(data['@name'].endsWith('Map')
                      ? {
                          key: {
                            '@hidden': false,
                            '@value': item[0],
                          },
                        }
                      : {}),
                    value: {
                      '@hidden': false,
                      '@value': item[1],
                    },
                  },
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
          '@real': data['@real'],
        }"
        flat
      />
    </template>
    <!-- {{ item }} -->
  </Collapse>
  <!-- object -->
  <Collapse v-else-if="t === 'regexp'" class="regexp" :flat="flat">
    <slot />
    {{ data['@name'] }}

    <template v-slot:content>
      <ConsoleField
        :data="{
          '@t': 'object',
          '@name': null,
          '@real': data['@real'],
        }"
        flat
      />
    </template>
  </Collapse>
  <Collapse v-else-if="t === 'object'" :flat="flat">
    <slot />
    <span class="array-size" v-if="!hideNameObject">{{ data['@name'] }}</span>
    {
    <template v-for="(item, name) in data['@des']" :key="name">
      <PropName :hidden="item['@hidden']" :name="name" />
      <ConsoleFieldPreview
        :data="item['@value']"
        hide-name-object
      />,
    </template>
    }

    <template v-slot:summary-opened>
      <template v-if="!hideNameObject">{{ data['@name'] }}</template>
    </template>

    <template v-slot:content>
      <!-- @real is link -->
      <ConsoleField
        v-if="data['@real']?.['@t'] === 'link'"
        :data="data['@real']"
        flat
      />
      <!-- /@real is link -->

      <template v-else v-for="(item, name) in data['@real']" :key="name">
        <!-- get/set -->
        <template v-if="item['@value']['@t'] === 'gs'">
          <!-- @value -->
          <div class="flex">
            <PropName :hidden="item['@hidden']" :name="name" />
            <GetterField :getter="item['@value']['@value']" />
          </div>
          <!-- /@value -->

          <ConsoleField
            v-for="(encoded, actName) in item['@value']['@at']"
            :key="name"
            :data="encoded"
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
            !name.startsWith('[[') && item['@value']['@name'] === 'Object'
          "
        >
          <PropName :hidden="item['@hidden']" :name="name" />
        </ConsoleField>
      </template>
      <!-- /@real -->
    </template>
  </Collapse>
  <Collapse v-else-if="t === 'error'">
    <slot />
    <div class="truncate">
      {{ data['@stack'] }}
    </div>

    <template v-slot:content>
      <ConsoleField
        :data="{
          '@t': 'object',
          '@real': data['@real'],
        }"
        flat
      />
    </template>
  </Collapse>
  <Collapse v-else-if="t === 'array'" :flat="flat">
    <slot />
    <span class="array-size"
      >({{ data['@real'].length['@value']['@value'] }})</span
    >
    [<template
      v-for="item in +data['@real'].length['@value']['@value']"
      :key="item"
    >
      <ConsoleFieldPreview
        :data="data['@real'][item - 1]['@value']"
        hide-name-object
      /><template v-if="+data['@real'].length['@value']['@value'] > item"
        >,
      </template></template
    >]

    <template v-slot:summary-opened>
      Array ({{ data['@real'].length['@value']['@value'] }})
    </template>

    <template v-slot:content>
      <ConsoleField :data="{ '@t': 'object', '@real': data['@real'] }" flat />
    </template>
  </Collapse>
  <Collapse v-else-if="t === 'link'" :flat="flat">
    <slot />
    <template v-if="data['@type'] === 'object'">
      fake:{{ data['@name'] }}{...}
    </template>
    <template v-else>
      <span class="char-f">ƒ</span> {{ data['@name'] }}
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
import { computed } from 'vue';
import { Encode } from '../logic/Encode';
import ConsoleField from './ConsoleField.vue';
import ConsoleLink from './ConsoleLink.vue';
import Collapse from './Collapse.vue';
import GetterField from './GetterField.vue';
import PropName from './PropName.vue';
import ConsoleFieldPreview from './ConsoleFieldPreview.vue';
import { Data } from '../logic/Encode';

const props = defineProps<{
  data: ReturnType<typeof Encode>;
  flat?: boolean;
  hideNameObject?: boolean;
}>();

const t = computed(() => props.data['@t']);
</script>

<style lang="scss" scoped>
@import './styles.scss';
// color: rgb(85, 106, 242);

div {
  font-family: sans-serif;
}
</style>
