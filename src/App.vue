<script setup lang="ts">
import { Encode } from "./logic/Encode";
import ConsoleField from "./components/ConsoleField.vue";

const tt = {
  r: /script/,
  e: new WeakMap(),
  c: new Map([[45, [789, 89]]]),
  s: new Set([2,54,65,[123], () => 2]),
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
    { a: 34 },
  ],
  foo: { x: 245, y: 843 },
  year: 10,
  name: "Shin",
  b: 129n,
  err: new Error("this message error"),
  sym: Symbol("a"),
  map: new Map([[45, [789, 89]]]),
  get lusa() {
    return this.year ** 2;
  },
  matcher: /\<script\s+\>/,
  increment: function increment(value = 56) {
    this.year++;
  },
  abort: new AbortController(),
};
tt.tt = tt;
const data = Encode(tt);
console.log(tt);
console.log(data);
</script>

<template>
  <ConsoleField :data="data" />
  <!-- <div v-for="data" -->
</template>

<style lang="scss">
body {
  font-size: 14px;
}
</style>
