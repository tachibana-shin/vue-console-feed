<template>
  <table class="console-wrap">
    <tr>
      <th @click="changeSorter(KEY_INDEX as any)">(Index)</th>
      <th
        v-for="name in data.cols.slice(0, MAX_COUNT_COLDS)"
        :key="name"
        @click="changeSorter(name)"
      >
        {{ name }}
      </th>
    </tr>
    <tr v-for="[name, row] in sortTable(data.table)" :key="name">
      <th>{{ name }}</th>
      <td v-for="colName in data.cols.slice(0, MAX_COUNT_COLDS)" :key="colName">
        <ConsoleValueStatic
          v-if="row[colName]"
          hide-name-object
          :data="row[colName]"
        />
      </td>
    </tr>
  </table>
  <ConsoleItem
    v-if="dataValue"
    :data="dataValue"
    :_get-list-link-async="_getListLinkAsync ?? _getListLinkAsyncDefault"
    :read-link-object-async="readLinkObjectAsync ?? readLinkObjectAsyncDefault"
    :call-fn-link-async="callFnLinkAsync ?? callFnLinkAsyncDefault"
  />
</template>

<script lang="ts" setup>
import { Table } from "../logic/Table"
import ConsoleValueStatic from "./ConsoleValueStatic.vue"
import ConsoleItem from "./ConsoleItem.vue"
import {
  readLinkObjectAsync as readLinkObjectAsyncDefault,
  _getListLinkAsync as _getListLinkAsyncDefault,
  callFnLinkAsync as callFnLinkAsyncDefault
} from "./api-async-defaults"
import { callFnLink, Encode, readLinkObject, _getListLink } from "../logic/Encode"
import { reactive, ref } from "vue"
import { Promisy } from "./Promisy"

const MAX_COUNT_COLDS = 20

// 20 x 24
defineProps<{
  data: ReturnType<typeof Table>
  dataValue?: ReturnType<typeof Encode>

  // api get lazy data
  _getListLinkAsync?: Promisy<typeof _getListLink>
  readLinkObjectAsync?: Promisy<typeof readLinkObject>
  callFnLinkAsync?: Promisy<typeof callFnLink>
}>()

enum StateSorter {
  ASC = "asc",
  DESC = "desc"
}
const KEY_INDEX = Symbol("(Index)")
const sorters = reactive<
  Partial<
    Record<
      string | typeof KEY_INDEX,
      StateSorter.ASC | StateSorter.DESC | undefined
    >
  >
>({})
const usedSorter = ref<string | typeof KEY_INDEX>(KEY_INDEX)

function changeSorter(name: string | typeof KEY_INDEX) {
  switch (sorters[name]) {
    case undefined:
      sorters[name] = StateSorter.ASC
      break
    case StateSorter.ASC:
      sorters[name] = StateSorter.DESC
      break
    case StateSorter.DESC:
      delete sorters[name]
      break
  }

  usedSorter.value = name
}
function sortTable(table: ReturnType<typeof Table>["table"]) {
  const sortBy = sorters[usedSorter.value]

  if (sortBy === undefined) return Object.entries(table)

  if (usedSorter.value === KEY_INDEX)
    return Object.entries(table).sort((a, b) => {
      return (
        (sortBy === StateSorter.ASC ? 1 : -1) *
        (a[0].charCodeAt(0) - b[0].charCodeAt(0))
      )
    })

  return Object.entries(table).sort((a, b) => {
    const valA = (a[1][usedSorter.value as never] as unknown as never)?.[
      "@value"
    ] as string | undefined
    const valB = (b[1][usedSorter.value as never] as unknown as never)?.[
      "@value"
    ] as string | undefined
    const isNum = valA && valB && !Number.isNaN(+valA) && !Number.isNaN(+valB)

    if (isNum) {
      return (sortBy === StateSorter.ASC ? 1 : -1) * (+valA - +valB)
    }

    return (
      (sortBy === StateSorter.ASC ? 1 : -1) *
      ((valA as string)?.charCodeAt(0) - (valB as string)?.charCodeAt(0))
    )
  })
}
</script>

<style lang="scss" scoped>
@import "./styles.scss";
@import "./wrap.scss";

table {
  text-align: left;
  border-spacing: 0;
  width: 100%;
  margin-left: (10px + 7 * 2);
  margin-top: 10px;
  table-layout: fixed; // fixed

  th {
    font-weight: 400;
  }

  td,
  th {
    padding: 3px 4px;
    @apply truncate;
  }

  tr:nth-child(2n + 1) {
    background-color: #292a2d;
  }
  tr:nth-child(2n) {
    background-color: #202124;
  }

  $border: 1px solid #494c50;

  tr > th,
  tr > td {
    border-left: $border;

    &:last-child {
      border-right: $border;
    }
  }

  tr:first-child > th {
    cursor: pointer;
    border: {
      top: $border;
      bottom: $border;
    }
  }
  tr:last-child > th,
  tr:last-child > td {
    border-bottom: $border;
  }
}
</style>
