<script setup lang="ts">
import { Encode } from "./logic/Encode"
import ConsoleItem from "./components/ConsoleItem.vue"

const el = document.createElement("div")
el.style.color = "red"
el.dir = "ltr"
el.innerHTML = "hkhkjhhu op<span>Hello<Span>jkfiwoejgoijerokg</span></span>"
// el.innerHTML = "xss"
const tt = {
  el,
  nl: el.childNodes,
  r: /script/,
  pro: Promise.resolve(),
  buffer: new Uint8Array([312,432,5435]).arrayBuffer,
  date: new Date(),
  [Symbol("aafe")]: [3124],
  e: new WeakMap(),
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
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
  matcher: /\<script\s+\>/,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  increment: function increment(value = 56) {
    this.year++
  },
  abort: new AbortController()
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(tt as unknown as any).tt = tt

const data = Encode(tt, true, true)
console.log(tt)
console.log(data)

console.log(document.body)
</script>

<template>
  <ConsoleItem :data="data" />
  <!-- <div v-for="data" -->
</template>

<style lang="scss">
body {
  font-size: 14px;
}
</style>
