<template>
  <table
    class="console-wrap"
    :style="{
      '--width': `${100 / (data.cols.length + 1)}%`
    }"
  >
    <tr>
      <th>(Index)</th>
      <th v-for="name in data.cols" :key="name">{{ name }}</th>
    </tr>
    <tr v-for="(row, name) in data.table" :key="name">
      <th>{{ name }}</th>
      <td v-for="colName in data.cols" :key="colName">
        <ConsoleValueStatic
          v-if="row[colName]"
          hide-name-object
          :data="row[colName]"
        />
      </td>
    </tr>
  </table>
</template>

<script lang="ts" setup>
import { Table } from "../logic/Table"
import ConsoleValueStatic from "./ConsoleValueStatic.vue"

const tt = {
  min: new Set([12, 23, 43]),
  ut: new Uint8Array([2, 33, 4354]),
  // cc: /a/,
  zu: new Array(1),
  soci3al: {
    twttier: {
      username: "tachib_shin"
    },
    facebook: false
  },
  name: "Shin",
  permissionspermissionspermissionspermissionspermissionspermissionspermissionspermissionspermissionspermissions:
    ["admin"],
  social: {
    twttier: {
      username: "tachib_shin"
    },
    facebook: false
  }
}
console.table(tt)
const data = Table(tt)
</script>

<style lang="scss" scoped>
@import "./styles.scss";
@import "./wrap.scss";

table {
  text-align: left;
  border-spacing: 0;
  width: 100%;
  table-layout: fixed;

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

  tr:first-child > th,
  tr:first-child > td {
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
