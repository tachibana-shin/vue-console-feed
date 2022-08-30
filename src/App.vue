<script setup lang="ts">
import { h } from "vue"

import ConsoleItem from "./components/ConsoleItem.vue"
import ConsoleTable from "./components/ConsoleTable.vue"
import { Encode } from "./logic/Encode"
import { Table } from "./logic/Table"

const el = document.createElement("div")
el.style.color = "red"
el.dir = "ltr"
el.innerHTML = "hkhkjhhu op<span>Hello<Span>jkfiwoejgoijerokg</span></span>"
// el.innerHTML = "xss"
const uint = new Uint8Array([312, 432, 5435])
const pro = Promise.resolve()
const date = new Date()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(date as unknown as any).status = "ok"
const tt = {
  el,
  nl: el.childNodes,
  r: /script/,
  aep: new Array(99),
  pro,
  uint,
  // eslint-disable-next-line functional/functional-parameters, @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  asn: async function asn(v, vv, ...vvv) {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  *iwjfgew() {},
  cvv: () => {
    // eslint-disable-next-line no-unused-expressions
    alert
    // eslint-disable-next-line no-unused-expressions
    window
  },
  gttt: () => 12423543,
  buffer: uint.buffer,
  view: new DataView(uint.buffer),
  date,
  [Symbol("aafe")]: [3124],
  e: new WeakMap(),
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  c: new Map([
    [45, [789, 89]],
    ["user", { name: "Shin" }]
  ]),
  s: new Set([2, 54, 65, [123], () => 2]),
  ae: [
    /script/,
    new WeakMap(),
    new Map([[45, [789, 89]]]),
    1,
    3,
    alert,
    [43, 5, 76, 23],
    { a: 34 },
    1,
    3,
    { a: 34 },
    1,
    3,
    { a: 34 },
    1,
    3,
    { a: 34 },
    1,
    3,
    { a: 34 },
    1,
    3,
    { a: 34 },
    1,
    3,
    { a: 34 },
    1,
    3,
    { a: 34 },
    1,
    3,
    { a: 34 },
    1,
    3,
    { a: 34 },
    1,
    3,
    { a: 34 },
    1,
    3,
    { a: 34 },
    1,
    3,
    { a: 34 },
    1,
    3,
    { a: 34 }
  ],
  foo: { x: 245, y: 843 },
  year: 10,
  name: "Shin",
  b: 129n,
  err: new Error("this message error"),
  sym: Symbol("a"),
  map: new Map([[45, [789, 89]]]),
  get lusa() {
    return this.year ** 2
  },
  matcher: /<script\s+>/,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  increment: function increment(value = 56) {
    this.year++
  },
  abort: new AbortController()
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(pro as unknown as any).asjfiopeg = tt
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(tt as unknown as any).tt = tt

// eslint-disable-next-line functional/no-let
let a
try {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  // eslint-disable-next-line no-undef
  foeojgr()
} catch (err) {
  a = err
}
const data = Encode(tt)
// console.table(tt)
console.log(data)
const data2 = Encode(a)
const data3 = Encode({ a: 778 })
// console.log(document.body)
function onLinkClick() {
  console.log("onLinkClick")
}
const dataTable = Table([1, 432, 54, 2])
const anchor = h("a")
</script>

<template>
  <div>
    <ConsoleItem :data="Encode('hello world')" type="log" />
    <ConsoleItem :data="data" type="log" :anchor="anchor" />
    <ConsoleTable
      :data="dataTable"
      :data-value="Encode([1, 432, 54, 2], false)"
      :anchor="anchor"
    />
    <ConsoleItem :data="data2" type="error">
      <template v-slot:anchor="props">
        <a :href="props.href" :class="props.class">{{ props.text }}</a>
      </template>
    </ConsoleItem>
    <ConsoleItem
      :data="data3"
      type="log"
      use-link-click
      @link-click="onLinkClick"
    >
      <template v-slot:anchor="props">
        <a :href="props.href" :class="props.class">{{ props.text }}</a>
      </template>
    </ConsoleItem>
  </div>
  <!-- <div v-for="data" -->
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-size: 14px;
}
</style>
