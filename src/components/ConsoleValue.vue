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
        <template v-if="data['@header'].typeFn !== 1">
          <span class="char-f"
            >{{ data["@header"].isAsync ? "async " : "" }}ƒ{{
              data["@header"].isStar ? "*" : ""
            }}</span
          >
          {{ data["@header"].name }}{{ data["@header"].args }}
        </template>
        <template v-else>
          {{ data["@header"].args }} => {{ data["@header"].content ?? "…" }}
        </template>
      </span>

      <template v-slot:content>
        <ConsoleLink
          :link="data['@real']!"
          :_get-list-link-async="_getListLinkAsync"
          :read-link-object-async="readLinkObjectAsync"
          :call-fn-link-async="callFnLinkAsync"
        />
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
              <ConsoleValueStatic :data="item[1]" full />}</span
            >
            <span v-else>
              <ConsoleValueStatic :data="item[0]" full />
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
                :_get-list-link-async="_getListLinkAsync"
                :read-link-object-async="readLinkObjectAsync"
                :call-fn-link-async="callFnLinkAsync"
              />
            </template>
          </Collapse>
        </template>
      </Collapse>

      <ConsoleLink
        :link="data['@real']!"
        :_get-list-link-async="_getListLinkAsync"
        :read-link-object-async="readLinkObjectAsync"
        :call-fn-link-async="callFnLinkAsync"
      />
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
      <ConsoleLink
        :link="data['@real']!"
        :_get-list-link-async="_getListLinkAsync"
        :read-link-object-async="readLinkObjectAsync"
        :call-fn-link-async="callFnLinkAsync"
      />
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
        :_get-list-link-async="_getListLinkAsync"
        :read-link-object-async="readLinkObjectAsync"
        :call-fn-link-async="callFnLinkAsync"
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
            <GetterField
              :getter="item['@value']['@value']"
              class="truncate"
              :_get-list-link-async="_getListLinkAsync"
              :read-link-object-async="readLinkObjectAsync"
              :call-fn-link-async="callFnLinkAsync"
            />
          </div>
          <!-- /@value -->

          <ConsoleValue
            v-for="(encoded, actName) in item['@value']['@at']"
            :key="actName"
            :data="encoded!"
            class="truncate"
            :_get-list-link-async="_getListLinkAsync"
            :read-link-object-async="readLinkObjectAsync"
            :call-fn-link-async="callFnLinkAsync"
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
          :_get-list-link-async="_getListLinkAsync"
          :read-link-object-async="readLinkObjectAsync"
          :call-fn-link-async="callFnLinkAsync"
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
      <ConsoleLink
        :link="data['@real']!"
        :_get-list-link-async="_getListLinkAsync"
        :read-link-object-async="readLinkObjectAsync"
        :call-fn-link-async="callFnLinkAsync"
      />
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
      <ConsoleLink
        :link="data['@real']"
        :_get-list-link-async="_getListLinkAsync"
        :read-link-object-async="readLinkObjectAsync"
        :call-fn-link-async="callFnLinkAsync"
      />
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
          <ConsoleLink
            :link="data['@real']!"
            :_get-list-link-async="_getListLinkAsync"
            :read-link-object-async="readLinkObjectAsync"
            :call-fn-link-async="callFnLinkAsync"
          />
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
            v-for="(item, index) in (refreshListLinkAsync(data['@childs'] as Data.Link), listLinkAsync)"
            :key="index"
            :data="item"
            :_get-list-link-async="_getListLinkAsync"
            :read-link-object-async="readLinkObjectAsync"
            :call-fn-link-async="callFnLinkAsync"
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
        <ConsoleLink
          :link="(data['@real'] as Data.Link)"
          :_get-list-link-async="_getListLinkAsync"
          :read-link-object-async="readLinkObjectAsync"
          :call-fn-link-async="callFnLinkAsync"
        />
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
      :_get-list-link-async="_getListLinkAsync"
      :read-link-object-async="readLinkObjectAsync"
      :call-fn-link-async="callFnLinkAsync"
    >
      <slot />
    </ConsoleValue>
  </template>
  <Collapse v-else-if="data['@t'] === 'buffer' || data['@t'] === 'dataview'">
    <slot />{{ data["@name"] ?? "DataView" }}({{ data["@size"] }})

    <template v-slot:content>
      <ConsoleLink
        v-if="data['@real']['@t']"
        :link="data['@real']"
        :_get-list-link-async="_getListLinkAsync"
        :read-link-object-async="readLinkObjectAsync"
        :call-fn-link-async="callFnLinkAsync"
      />
    </template>
  </Collapse>
  <div v-else>
    <slot />
    Nothing {{ data }}
  </div>
</template>

<script lang="ts" setup>
import type { DefineComponent } from "vue"
import { shallowRef, toRaw, useAttrs } from "vue"

import { Data } from "../logic/Encode"
import type {
  _Encode,
  _getListLink,
  callFnLink,
  DataPreview,
  readLinkObject
} from "../logic/Encode"
import { keys as extendsKeysTypedArray } from "../logic/getOwnDescriptorsTypedArray"
import { parseLink } from "../logic/parseLink"

import Collapse from "./Collapse.vue"
import ConsoleLink from "./ConsoleLink.vue"
import _ConsoleValue from "./ConsoleValue.vue"
import ConsoleValueStatic from "./ConsoleValueStatic.vue"
import _GetterField from "./GetterField.vue"
import type { Promisy } from "./Promisy"
import PropName from "./PropName.vue"

const attrs = useAttrs()

const ConsoleValue = _ConsoleValue as unknown as DefineComponent<{
  data: ReturnType<typeof _Encode>
  hideNameObject?: boolean
  flat?: boolean
}>
const GetterField = _GetterField as unknown as DefineComponent<{
  getter: Data.Link
}>

const props = defineProps<{
  data: ReturnType<typeof _Encode>
  flat?: boolean
  hideNameObject?: boolean

  isLog?: boolean

  // api
  _getListLinkAsync: Promisy<typeof _getListLink>
  readLinkObjectAsync: Promisy<typeof readLinkObject>
  callFnLinkAsync: Promisy<typeof callFnLink>
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

  // eslint-disable-next-line functional/no-let
  let countEmpty = 0
  // eslint-disable-next-line functional/no-let
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

const listLinkAsync = shallowRef<Awaited<ReturnType<typeof _getListLink>>>()

function refreshListLinkAsync(link: Data.Link) {
  if (listLinkAsync.value) return

  // eslint-disable-next-line promise/catch-or-return, promise/always-return
  props._getListLinkAsync(toRaw(link)).then((response) => {
    listLinkAsync.value = response
  })

  // return listLinkAsyn
}
</script>

<script lang="ts">
export default {
  inheritAttrs: false
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
