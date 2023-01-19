# vue-console-feed

[![Build](https://github.com/tachibana-shin/vue-console-feed/actions/workflows/test.yml/badge.svg)](https://github.com/tachibana-shin/vue-console-feed/actions/workflows/test.yml)
[![NPM](https://badge.fury.io/js/vue-console-feed.svg)](http://badge.fury.io/js/vue-console-feed)
[![Size](https://img.shields.io/bundlephobia/minzip/vue-console-feed/latest)](https://npmjs.org/package/vue-console-feed)
[![Languages](https://img.shields.io/github/languages/top/tachibana-shin/vue-console-feed)](https://npmjs.org/package/vue-console-feed)
[![License](https://img.shields.io/npm/l/vue-console-feed)](https://npmjs.org/package/vue-console-feed)
[![Star](https://img.shields.io/github/stars/tachibana-shin/vue-console-feed)](https://github.com/tachibana-shin/vue-console-feed/stargazers)
[![Download](https://img.shields.io/npm/dm/vue-console-feed)](https://npmjs.org/package/vue-console-feed)

This is the plugin that is almost identical to the [console-feed](https://github.com/samdenty/console-feed) but for Vue. This plugin moves closer to `Console Chrome Devtools` than `console-feed`

> [Demo from Stackbliz](https://stackblitz.com/edit/github-m6j4xf)

**This plugin release!**

## Preview

![Preview](./screenshots/preview.png)

## Installation

pnpm, yarn, npm:

```bash
pnpm add vue-console-feed
```

or with CDN:

```html
<link rel="stylesheet" href="https://cdn.skypack.dev/vue-console-feed/style.css">
<script type="module">
  import * as ConsoleFeed from "https://cdn.skypack.dev/vue-console-feed"
</script>
```

## To be on

- [x] basic type value (string, number, bigint, symbol, null, undefined) `full support`
- [x] error `full support`
- [x] object `full support`
- [x] array `full support`
- [x] Map, Set, WeakMap, WeakSet `full support`
- [x] function, function full `full support`
- [x] function async
- [x] function star, prop
- [x] regexp `full support`
- [x] element, DOM `full support`
- [x] Promise `limit`
- [x] console.table
- [x] console.warn
- [x] console.info
- [x] console.error
- [x] console.count
- [x] console.group
- [x] Date
- [x] Buffer
- [x] TypedArray
- [x] DataView
- [x] address `http` in `string` and `Error`
- [x] Location link

**DataAPI**

- [x] console.log
- [x] console.warn
- [x] console.info
- [x] console.debug
- [x] console.error
- [x] console.table
- [x] console.group
- [x] console.groupEnd
- [x] console.count
- [x] console.countReset
- [x] console.time
- [x] console.timeLog
- [x] console.timeEnd
- [x] console.clear

## Usage

### Console & DataAPI

```vue
<template>
  <Console :data="console.value" />
</template>

<script lang="ts" setup>
import { Console, DataAPI } from "vue-console-feed"
import "vue-console-feed/style.css"

const console = new DataAPI(false, 0) // if you use API set option to true, argument 2 offset deep location

console.log("hello world")
console.count()
console.group()
console.count()
console.table([1, 234, 1])
console.warn("Warning!!")
console.count()
console.groupEnd()
</script>
```

### ConsoleItem

| Option                | Type                                                          | Required | Description                                                                                                     |
| --------------------- | ------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------- |
| `type`                | `"warn" \| "info" \| "debug" \| "error" \| "output" \| "log"` | `false`  | determine the console type corresponding to the methods `data.warn`, `console.info`, `data.debug`, `data.error` |
| `data`                | `ReturnType<typeof Encode>`                                   | `true`   | determine the type corresponding to the methods `Encode`                                                        |
| `_getListLinkAsync`   | `Promisy<_getListLink>`                                       | `false`  | This is the `promise` function of `_getListLink`                                                                |
| `readLinkObjectAsync` | `Promisy<readLinkObject>`                                     | `false`  | This is the `promise` function of `readLinkObject`                                                              |

#### Example and Promise API

```vue
<template>
  <ConsoleItem :data="data" type="log" />
</template>

<script lang="ts" setup>
import { ConsoleItem, Encode } from "vue-console-feed"
import "vue-console-feed/style.css"

const data = Encode(
  {
    name: "Shin",
    permission: ["admin"],
    social: {
      twitter: "@tachib_shin",
      github: "@tachibana-shin"
    }
  },
  true,
  true
)
</script>
```

You have custom API fetch lazy data

> Options `_getListLinkAsync` and `readLinkObjectAsync` is the port of the functions corresponding to it. useful when you work with iframe.

> In it `_getListLinkAsync` is the `promise` function of `_getListLink` and `readLinkObjectAsync` is the `promise` function of `readLinkObject`.

```vue
<template>
  <ConsoleItem
    :data="data"
    :_getListLinkAsync="_getListLinkAsync"
    :readLinkObjectAsync="readLinkObjectAsync"
  />
</template>

<script lang="ts" setup>
import {
  ConsoleItem,
  Encode,
  _getListLink,
  readLinkObject
} from "vue-console-feed"
import "vue-console-feed/style.css"

const data = Encode(
  {
    name: "Shin",
    permission: ["admin"],
    social: {
      twitter: "@tachib_shin",
      github: "@tachibana-shin"
    }
  },
  true,
  true
)

// custom api
async function _getListLinkAsync(link: Data.Link) {
  return _getListLink(link)
}
async function readLinkObjectAsync(link: Data.Link) {
  return readLinkObject(link)
}
</script>
```

### ConsoleTable

| Option                | Type                       | Required | Description                                             |
| --------------------- | -------------------------- | -------- | ------------------------------------------------------- |
| `data`                | `ReturnType<typeof Table>` | `true`   | determine the type corresponding to the methods `Table` |
| `_getListLinkAsync`   | `Promisy<_getListLink>`    | `false`  | This is the `promise` function of `_getListLink`        |
| `readLinkObjectAsync` | `Promisy<readLinkObject>`  | `false`  | This is the `promise` function of `readLinkObject`      |

#### Example and Promise API

```vue
<template>
  <ConsoleTable :data="data" type="log" />
</template>

<script lang="ts" setup>
import { ConsoleTable, Encode, Table } from "vue-console-feed"
import "vue-console-feed/style.css"

const value = {
  name: "Shin",
  permission: ["admin"],
  social: {
    twitter: "@tachib_shin",
    github: "@tachibana-shin"
  }
}
const data = Table(value)
</script>
```

You have custom API fetch lazy data

> Options `_getListLinkAsync` and `readLinkObjectAsync` is the port of the functions corresponding to it. useful when you work with iframe.

> In it `_getListLinkAsync` is the `promise` function of `_getListLink` and `readLinkObjectAsync` is the `promise` function of `readLinkObject`.

```vue
<template>
  <ConsoleTable
    :data="data"
    :_getListLinkAsync="_getListLinkAsync"
    :readLinkObjectAsync="readLinkObjectAsync"
  />
</template>

<script lang="ts" setup>
import {
  ConsoleTable,
  Encode,
  Table,
  _getListLink,
  readLinkObject
} from "vue-console-feed"
import "vue-console-feed/style.css"

const value = {
  name: "Shin",
  permission: ["admin"],
  social: {
    twitter: "@tachib_shin",
    github: "@tachibana-shin"
  }
}
const data = Table(value)

// custom api
async function _getListLinkAsync(link: Data.Link) {
  return _getListLink(link)
}
async function readLinkObjectAsync(link: Data.Link) {
  return readLinkObject(link)
}
</script>
```

### API

#### Encode(value: unknown, firstCall: boolean, linkFn: boolean)

Encrypt the values for use on the components (the result of this function is a pure object so you can use `JSON.stringify`, send `fetch` or `postMessage` it which remains safe for data.
Option | Type | Required | Description
------ | ---- | -------- | ------------
`value` | unknown | `true` | value for encryption. accept all kinds of values like `data.log`
`firstCall` | `boolean` | `true` | Is this your root data? If you don't care about it, always set it to `true`.
`linkFn` | `boolean` | `true` | Is this link object? If you don't care about it, always set it to `true`.

```ts
function Encode(
  value: unknown,
  firstCall?: boolean,
  linkFn?: boolean
):
  | Data.String
  | Data.Number
  | Data.BigInt
  | Data.Symbol
  | Data.Function
  | Data.Collection
  | Data.RegExp
  | Data.Nill
  | Data.Record
  | Data.Error
  | Data.Array
  | Data.Element
  | Data.Promise
  | Data.Date
  | Data.TypedArray
  | Data.Buffer
  | Data.DataView
```

#### Table(value: object)

Encrypt the values for use on the components (the result of this function is a pure object so you can use `JSON.stringify`, send `fetch` or `postMessage` it which remains safe for data.
Option | Type | Required | Description
----- | ----- | ----- | -----------
`value` | like `object` | `true` | It could be anything in the form of an object to encrypt.

```ts
function Table(value: object): {
   table: Record<string, Record<string, Data.String | Data.Number | Data.BigInt | Data.Symbol | Data.Nill | DataPreview.Record | ... 10 more ... | DataPreview.DataView>>;
   cols: string[];
}
```

#### readLinkObject(link: Data.Link), \_getListLink(link: Data.Link)

These are the system functions for communication between different environments. (Exm: `fetch`, `postMessage`)
If you don't use other environments, you should ignore this.

```ts
function readLinkObject(link: Data.Link): Data.String | Data.Number | Data.BigInt | Data.Symbol | Data.Nill | Data.Function | Data.Collection | Data.Record | ... 8 more ... | Data.DataView
function _getListLink(link: Data.Link): (ReturnType<typeof Encode> | Data.Error)[]
```

#### clearLinkStore()

This is the memory release function. while you call the `Encode` functions, there will be some `object in object`, but the objects in are not immediately used so `Encode` will not analyze it but create a `link` by clicking on `object in object` that the `_getLinkObject` function will work to parse it

## Usage with IFrame

Console.vue
```vue
<template>
  <Console
    :data="console.value"
    :_get-list-link-async="getListLinkAsync"
    :read-link-object-async="readLinkObjectAsync"
    :call-fn-link-async="callFnLinkAsync"
    :anchor="Anchor"
  />
</template>

<script lang="ts" setup>
import { Console, DataAPI } from "vue-console-feed
import type {
  _getListLink,
  callFnLink,
  Data,
  readLinkObject
} from "vue-console-feed"
import { v4 } from "uuid"

const console = new DataAPI(true)

function createAPIAsync(
  type: "getListLink" | "readLinkObject" | "callFnLink"
) {
  return (link: Data.Link) =>
    new Promise((resolve) => {
      const id = v4()
      iframeRef.value?.contentWindow?.postMessage({
        id,
        type,
        link
      })

      const handler = (event: MessageEvent<MessageAPI>) => {
        if (event.data.id !== id || event.data.type !== type) return

        resolve(event.data.result)

        cancel()
        cancelers.delete(cancel)
      }
      const cancel = () => window.removeEventListener("message", handler)

      cancelers.add(cancel)
      window.addEventListener("message", handler)
    })
}

const getListLinkAsync =
  createAPIAsync<ReturnType<typeof _getListLink>>("getListLink")
const readLinkObjectAsync =
  createAPIAsync<ReturnType<typeof readLinkObject>>("readLinkObject")
const callFnLinkAsync =
  createAPIAsync<ReturnType<typeof callFnLink>>("callFnLink")

function Anchor(options: { text: string; href: string }) {
  return h(
    "a",
    {
      href: options.href
    },
    [options.text]
  )
}
</script>
```

Embed this script to iframe
```ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DataAPI } from "vue-console-feed/data-api"
import { printfArgs } from "vue-console-feed/data-api"
import type { Data } from "vue-console-feed/encode"
import {
  _getListLink,
  callFnLink,
  clearLinkStore,
  Encode,
  readLinkObject
} from "vue-console-feed/encode"
import { Table } from "vue-console-feed/table"

export type Methods = Exclude<keyof DataAPI, "value">
export interface MessageConsoleTable {
  type: "console"
  name: "table"
  args: [ReturnType<typeof Table>]
}
export interface MessageConsoleEncode {
  type: "console"
  name: Methods
  args: ReturnType<typeof Encode>[] | [string]
}

export type MessageAPI =
  | {
      type: "getListLink"
      id: string
      result: ReturnType<typeof _getListLink>
    }
  | {
      type: "readLinkObject"
      id: string
      result: ReturnType<typeof readLinkObject>
    }
  | {
      type: "callFnLink"
      id: string
      result: ReturnType<typeof callFnLink>
    }

function postMessageToParent(
  message: MessageConsoleEncode | MessageConsoleTable | MessageAPI
) {
  parent.postMessage(message, {
    targetOrigin: "*"
  })
}

// ===== console API ======
/**
 *
    clear(): void;
 */
;(["log", "warn", "info", "debug", "error"] as Methods[]).forEach((name) => {
  const cbRoot = (console as unknown as any)[name]
  // eslint-disable-next-line functional/functional-parameters
  ;(console as unknown as any)[name] = function (...args: unknown[]) {
    postMessageToParent({
      type: "console",
      name,
      args: printfArgs(args).map((item: unknown) => Encode(item, 2))
    })

    cbRoot.apply(this, args)
  }
})
const { table } = console
console.table = function (value: unknown) {
  if (value !== null && typeof value === "object")
    postMessageToParent({
      type: "console",
      name: "table",
      args: [Table(value, 1)]
    })
  else
    postMessageToParent({
      type: "console",
      name: "log",
      args: [Encode(value, 1)]
    })
  return table.call(this, value)
}
;(["group", "groupEnd"] as Methods[]).forEach((name) => {
  const cbRoot = (console as unknown as any)[name]
  ;(console as unknown as any)[name] = function (value?: unknown) {
    postMessageToParent({
      type: "console",
      name,
      args: value !== undefined ? [Encode(value, 1)] : []
    })

    cbRoot.call(this, value)
  }
})
;(["count", "countReset", "time", "timeLog", "timeEnd"] as Methods[]).forEach(
  (name) => {
    const cbRoot = (console as unknown as any)[name]
    ;(console as unknown as any)[name] = function (value?: unknown) {
      postMessageToParent({
        type: "console",
        name,
        args: value !== undefined ? [Encode(value + "", 1)] : []
      })

      cbRoot.call(this, value)
    }
  }
)
const { clear } = console
console.clear = function () {
  postMessageToParent({
    type: "console",
    name: "clear",
    args: []
  })

  clear.call(this)
}
// ========================

// ===== error globals ====
addEventListener("error", (event) => {
  postMessageToParent({
    type: "console",
    name: "error",
    args: [Encode(event.error, 1)]
  })
})
// ========================

// ====== API Async ======
window.addEventListener(
  "message",
  (
    event: MessageEvent<{
      id: string
      type: MessageAPI["type"]
      link: Data.Link
    }>
  ) => {
    switch (event.data.type) {
      case "getListLink":
        postMessageToParent({
          type: "getListLink",
          id: event.data.id,
          result: _getListLink(event.data.link)
        })
        break
      case "readLinkObject":
        postMessageToParent({
          type: "readLinkObject",
          id: event.data.id,
          result: readLinkObject(event.data.link)
        })
        break
      case "callFnLink":
        postMessageToParent({
          type: "callFnLink",
          id: event.data.id,
          result: callFnLink(event.data.link)
        })
        break
    }

    // id, result
  }
)
window.addEventListener(
  "message",
  (event: MessageEvent<{ type: "clearConsole" }>) => {
    if (event.data.type === "clearConsole") {
      console.clear()
      clearLinkStore()
    }
  }
)
// =======================
```
