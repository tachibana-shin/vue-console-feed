<template>
  <div
    v-if="
      data['@t'] === 'string' ||
      data['@t'] === 'number' ||
      data['@t'] === 'bint' ||
      data['@t'] === 'symbol' ||
      data['@t'] === 'nill'
    "
    v-bind="attrs"
  >
    <slot />
    <ConsoleValueStatic
      :data="data"
      :is-log="isLog"
      full
      :first="data['@t'] === 'string' ? data['@first'] : false"
    />
  </div>
  <template v-else-if="data['@t'] === 'function'">
    <template v-if="data['@first']">{{ data["@code"] }}</template>
    <Collapse v-else :flat="flat">
      <slot />
      <span class="function">
        <span class="char-f">ƒ</span>
        {{ data["@name"] }}
      </span>

      <template v-slot:content>
        <ConsoleLink :link="data['@real']!" />
      </template>
    </Collapse>
  </template>
  <Collapse v-else-if="data['@t'] === 'collection'" :flat="flat">
    <slot />
    <span class="array-size">
      {{ data["@name"]
      }}<template v-if="data['@size'] !== null">({{ data["@size"] }})</template>
    </span>
    <template v-if="data['@size'] === 0">
      {size: {{ data["@size"] }}}
    </template>
    <template v-else-if="data['@size'] !== null"
      >{<span v-for="(item, index) in data['@entries']" :key="index">
        <span v-if="data['@name'].endsWith('Map')">
          <ConsoleValueStatic :data="item[0]" hide-name-object /> =>
          <ConsoleValueStatic :data="item[1]" hide-name-object />
        </span>
        <span v-else>
          <ConsoleValueStatic :data="item[0]" hide-name-object />
        </span>
        <span v-if="index < data['@size'] - 1" class="comma">,</span> </span
      >}
    </template>
    <template v-else>{}</template>

    <template v-slot:summary-opened>
      <slot />{{ data["@name"]
      }}<template v-if="data['@size'] !== null">({{ data["@size"] }})</template>
    </template>

    <template v-slot:content>
      <Collapse show>
        <PropName :hidden="false" name="[[Entries]]" />

        <template v-slot:content>
          <Collapse v-for="(item, index) in data['@entries']" :key="index">
            <PropName :hidden="false" :name="index + ''" />
            <span v-if="data['@name'].endsWith('Map')"
              >{<ConsoleValueStatic :data="item[0]" full /> =>
              <ConsoleValueStatic :data="item[1]" show-name-fn full />}</span
            >
            <span v-else>
              <ConsoleValueStatic :data="item[0]" show-name-fn full />
            </span>

            <template v-slot:content>
              <ConsoleValue
                :data="{
                  '@t': 'object',
                  '@name': null,
                  '@first': false,
                  '@des': null,
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

      <ConsoleLink :link="data['@real']!" />
    </template>
    <!-- {{ item }} -->
  </Collapse>
  <!-- object -->

  <Collapse
    v-else-if="data['@t'] === 'regexp'"
    :flat="flat"
    :only-btn="data['@first']"
  >
    <slot /><span class="regexp">{{ data["@name"] }}</span>

    <template v-slot:content>
      <ConsoleLink :link="data['@real']!" />
    </template>
  </Collapse>
  <Collapse
    v-else-if="data['@t'] === 'object'"
    :flat="flat"
    :disable-magic="data['@first']"
  >
    <slot />
    <span class="array-size" v-if="!hideNameObject">{{ data["@name"] }}</span
    >{<template v-for="(item, name) in data['@des']?.['@value']" :key="name">
      <PropName :hidden="item['@hidden']" :name="name + ''" preview />
      <ConsoleValueStatic :data="item['@value']" hide-name-object />
      <span class="comma" v-if="name !== data['@des']!['@lastKey']"
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
          <div class="ml-4">
            <PropName :hidden="item['@hidden']" :name="name + ''" />
            <GetterField :getter="item['@value']['@value']" class="truncate" />
          </div>
          <!-- /@value -->

          <ConsoleValue
            v-for="(encoded, actName) in item['@value']['@at']"
            :key="actName"
            :data="encoded!"
            class="truncate"
          >
            <PropName hidden :name="actName + ' ' + name" />
          </ConsoleValue>
        </template>
        <!-- link -->
        <!-- function -->
        <!-- collection -->
        <!-- regexp -->
        <!-- error -->

        <!-- str, num, bint, collection, nill -->
        <ConsoleValue
          v-else
          :data="item['@value']"
          :hide-name-object="
            typeof name === 'string' && !(name as string)?.startsWith('[[') && (item['@value'] as any)?.['@name'] === 'Object'
          "
          class="truncate"
        >
          <PropName :hidden="item['@hidden']" :name="name + ''" />
        </ConsoleValue>
      </template>
      <!-- /@real -->
    </template>
  </Collapse>
  <Collapse v-else-if="data['@t'] === 'error'" :only-btn="data['@first']">
    <slot /><span v-html="parseLink(data['@stack'], { minifyLink: true })" />

    <template v-slot:content>
      <ConsoleLink :link="data['@real']!" />
    </template>
  </Collapse>
  <Collapse
    v-else-if="data['@t'] === 'array' || data['@t'] === 'typedarray'"
    :flat="flat"
    :disable-magic="data['@first']"
  >
    <slot /><span class="array-size mr-0" v-if="data['@name']">{{
      data["@name"]
    }}</span
    ><span class="array-size">({{ data["@size"] }})</span>[<template
      v-for="(item, index) in generateDescriptorArray(data['@des']!['@value'], data['@size'])"
      :key="index"
    >
      <span class="array-size mr-0" v-if="item.empty"
        >&lt;empty&gt; x {{ item.count }}</span
      >
      <ConsoleValueStatic
        v-else
        :data="item.value['@value']"
        hide-name-object
      />
      <span v-if="data['@size'] - 1 > item.index" class="comma">,</span>
    </template>
    <!-- addons for TypedArray, TypedArray never empty value -->
    <template v-if="data['@t'] === 'typedarray'"
      >,
      <template v-for="key in extendsKeysTypedArray" :key="key">
        <PropName
          :hidden="data['@des']!['@value'][key.toString()]['@hidden']"
          :name="key.toString()"
          preview
        />
        <!-- {{item}} -->
        <ConsoleValueStatic
          :data="data['@des']!['@value'][key.toString()]['@value']"
          hide-name-object
        />
        <span class="comma">,</span>
      </template> </template
    >]
    <!-- //addons for TypedArray -->

    <template v-slot:summary-opened>
      <slot />{{ data["@name"] ?? "Array" }}({{ data["@size"] }})
    </template>

    <template v-slot:content>
      <ConsoleLink :link="data['@real']" />
    </template>
  </Collapse>
  <template v-else-if="data['@t'] === 'element'">
    <template v-if="data['@first']">
      <template v-if="data['@name'] === '#text'">
        "{{ data["@childs"] }}"
      </template>
      <template v-else-if="data['@name'] === '#cdata-section'">
        {{ data["@childs"] }}
      </template>
      <span v-else-if="data['@name'] === '#comment'" class="element-comment">{{
        data["@childs"]
      }}</span>
      <span v-else-if="data['@name'] === 'html'" class="element-doctype">{{
        data["@childs"]
      }}</span>
      <Collapse
        v-else-if="data['@name'].startsWith('#')"
        :only-btn="data['@real'] !== undefined"
      >
        {{ data["@name"] }}

        <template v-slot:content>
          <ConsoleLink :link="data['@real']!" />
        </template>
      </Collapse>

      <Collapse
        v-else
        :only-btn="!data['@childs'] || typeof data['@childs'] === 'string'"
        detail-l7
      >
        <span class="element-tag">
          &lt;{{ data["@name"].toLowerCase().replace(/^#/, "")
          }}<span
            v-for="([key, value], index) in data['@attrs']"
            :key="key"
            :class="{
              'ml-1': index === 0,
              'mr-1': index < data['@attrs']!.length - 1
            }"
          >
            <span class="element-propName">{{ key }}="</span>
            <span class="element-propValue">{{ value }}</span>
            <span class="element-propName">"</span> </span
          >&gt;</span
        >
        <span v-if="data['@childs']">{{
          typeof data["@childs"] === "string" ? data["@childs"] : "…"
        }}</span>
        <span class="element-tag"
          >&lt;/{{ data["@name"].toLowerCase().replace(/^#/, "") }}&gt;
        </span>

        <template v-slot:content>
          <ConsoleValue
            v-for="(item, index) in _getListLink(data['@childs'] as Data.Link)"
            :key="index"
            :data="item"
          />
        </template>
      </Collapse>
    </template>
    <Collapse v-else :flat="flat">
      <slot />
      <span class="element-tag">{{
        data["@name"].toLowerCase().replace(/^#/, "")
      }}</span>

      <template v-slot:content>
        <ConsoleLink :link="(data['@real'] as Data.Link)" />
      </template>
    </Collapse>
  </template>
  <template v-else-if="data['@t'] === 'date' || data['@t'] === 'promise'">
    <template v-if="data['@first']"
      ><slot />{{
        data["@t"] === "promise" ? "Promise" : data["@value"]
      }}</template
    >
    <ConsoleValue
      v-else
      :data="{
        '@t': 'object',
        '@first': false,
        '@des': data['@des'],
        '@name': data['@t'] === 'promise' ? 'Promise' : data['@value'],
        '@real': data['@real']!
      }"
      :flat="flat"
    >
      <slot />
    </ConsoleValue>
  </template>
  <Collapse v-else-if="data['@t'] === 'buffer' || data['@t'] === 'dataview'">
    <slot />{{ data["@name"] ?? "DataView" }}({{ data["@size"] }})

    <template v-slot:content>
      <ConsoleLink v-if="data['@real']['@t']" :link="data['@real']" />
    </template>
  </Collapse>
  <div v-else>
    <slot />
    Nothing {{ data }}
  </div>
</template>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script lang="ts" setup>
import { Data, DataPreview, Encode, _getListLink } from "../logic/Encode"
import _ConsoleValue from "./ConsoleValue.vue"
import ConsoleLink from "./ConsoleLink.vue"
import Collapse from "./Collapse.vue"
import PropName from "./PropName.vue"
import ConsoleValueStatic from "./ConsoleValueStatic.vue"
import _GetterField from "./GetterField.vue"
import { DefineComponent, useAttrs } from "vue"
import { keys as extendsKeysTypedArray } from "../logic/getOwnDescriptorsTypedArray"
import { parseLink } from "../logic/parseLink"

const attrs = useAttrs()

const ConsoleValue = _ConsoleValue as unknown as DefineComponent<{
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

  isLog?: boolean
}>()

function generateDescriptorArray(des: DataPreview.objReal, size: number) {
  const newDes: (
    | {
        empty: true
        index: number
        count: number
      }
    | {
        empty: false
        index: number
        value: DataPreview.objReal[""]
      }
  )[] = []

  let countEmpty = 0
  for (let i = 0; i < size; i++) {
    if (!des[i]) {
      countEmpty++
      continue
    }

    if (countEmpty) {
      newDes.push({
        empty: true,
        index: i,
        count: countEmpty
      })
      countEmpty = 0
    }

    newDes.push({
      empty: false,
      index: i,
      value: des[i]
    })
  }

  if (countEmpty) {
    newDes.push({
      empty: true,
      index: size - 1,
      count: countEmpty
    })
    countEmpty = 0
  }

  return newDes
}
</script>

<style lang="scss" scoped>
@import "./styles.scss";
// color: rgb(85, 106, 242);

.ml-4 {
  margin-left: 12px;
}
.ml-1 {
  margin-left: 4px;
}
.mr-1 {
  margin-right: 4px;
}
.\!ml-7 {
  margin-left: (4px * 7) !important;
}
</style>
