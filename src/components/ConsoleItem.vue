<template>
  <div
    class="console-colors console-wrap console-item"
    :class="type ? `console-${type}` : undefined"
    ref="elRef"
  >
    <span v-if="count && count > 1" class="console-icon console-badge">{{
      count
    }}</span>
    <span v-else-if="type && type !== 'log'" class="console-icon" />

    <div
      class="console-value"
      :class="{
        'has-location': location
      }"
    >
      <LocationConsole
        v-if="location"
        class="truncate console-location"
        :location="location"
        :anchor="Anchor"
      />
      <div class="console-message">
        <template v-if="Array.isArray(data)">
          <ConsoleValue
            v-for="(item, index) in data"
            :key="index"
            :data="item"
            :is-log="type !== undefined"
            :_get-list-link-async="
              _getListLinkAsync ?? _getListLinkAsyncDefault
            "
            :read-link-object-async="
              readLinkObjectAsync ?? readLinkObjectAsyncDefault
            "
            :call-fn-link-async="callFnLinkAsync ?? callFnLinkAsyncDefault"
            :anchor="Anchor"
            class="mr-1"
          />
        </template>
        <ConsoleValue
          v-else
          :data="(data as EncodeData)"
          :is-log="type !== undefined"
          :_get-list-link-async="_getListLinkAsync ?? _getListLinkAsyncDefault"
          :read-link-object-async="
            readLinkObjectAsync ?? readLinkObjectAsyncDefault
          "
          :call-fn-link-async="callFnLinkAsync ?? callFnLinkAsyncDefault"
          :anchor="Anchor"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Component, Slot } from "vue"
import { computed, useSlots } from "vue"

import type {
  _getListLink,
  callFnLink,
  Encode,
  readLinkObject
} from "../logic/Encode"

import ConsoleValue from "./ConsoleValue.vue"
import LocationConsole from "./LocationConsole.vue"
import type { Promisy } from "./Promisy"
import {
  _getListLinkAsync as _getListLinkAsyncDefault,
  callFnLinkAsync as callFnLinkAsyncDefault,
  readLinkObjectAsync as readLinkObjectAsyncDefault
} from "./api-async-defaults"

type EncodeData = ReturnType<typeof Encode>

const props = defineProps<{
  data: EncodeData | readonly EncodeData[]
  count?: number | string
  type?: "warn" | "info" | "debug" | "error" | "output" | "log"

  noLocation?: boolean

  anchor?:
    | Component<{
        href: string
      }>
    | Slot
    | string

  // api
  _getListLinkAsync?: Promisy<typeof _getListLink>
  readLinkObjectAsync?: Promisy<typeof readLinkObject>
  callFnLinkAsync?: Promisy<typeof callFnLink>
}>()
const $slots = useSlots()

const Anchor = computed(() => props.anchor ?? $slots.anchor ?? "a")

const location = computed(() =>
  props.noLocation
    ? undefined
    : (Array.isArray(props.data) ? props.data[0] : props.data)["@location"]
)
</script>

<style lang="scss" scoped>
@import "./wrap.scss";
@import "./colors.scss";

.console-item {
  border-bottom: 1px solid var(--c-border);
  padding: {
    top: 5px;
    bottom: 5px;
  }
  display: flex;
  .console-value {
    min-width: 0;
    flex: 1;

    &.has-location {
      .console-location {
        float: right;
        margin-left: 10px;
      }
      .console-message {
        max-width: 100%;
        float: left;
      }
    }
  }

  :deep(.color-white) {
    color: white;
  }

  .console-icon {
    width: 10px;
    height: 18px;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    display: inline-block;
    margin-left: 7px;
    margin-right: 7px;
    & + .console-value {
      margin-left: 0;
    }
  }
  .console-badge {
    background-color: var(--c-badge);
    border-radius: 15px;
    background-image: none;
    height: 15px;
    width: auto;
    font-size: 11px;
    padding: 0 5px;
    line-height: 15px;
    text-align: center;
    background-image: none !important;
    color: var(--bg-color);
  }
  &.console-warn {
    .console-badge {
      background-color: var(--c-badge-warn);
    }
  }
  &.console-error {
    .console-badge {
      background-color: var(--c-badge-error);
    }
  }
  .console-value {
    margin-left: (10px + 7px * 2);
  }

  &.console-output {
    .console-icon {
      background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABpSURBVChTY6A92LNnj96uXbvKoVzsYMeOHVbbt29/D1T4eP/+/QJQYVSwe/duD6CCr0B8A8iWgwqjAqBk2NatW38B6bPbtm0TBYkBFbsA+c9ANFgRCBCtEASAAoSthgGiPAMD2IOHgQEA521bM7uG52wAAAAASUVORK5CYII=");
    }
  }

  &.console-warn {
    background-color: var(--c-bg-warn);
    border-top: 1px solid var(--c-border-warn);
    border-bottom: 1px solid var(--c-border-warn);
    color: var(--c-text-warn);
    .console-icon {
      background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACkSURBVChTbY7BCoJQFERn0Q/3BX1JuxQjsSCXiV8gtCgxhCIrKIRIqKDVzXl5w5cNHBjm6eGinXiAXu5inY2xYm/mbpIh+vcFhLA3sx0athNUhymEsP+10lAEEA17x8o/9wFuNGnYuVlWve0SQl7P0sBu3aq2R1Q/1JzSkYGd29eqNv2wjdnUuvNRciC/N+qe+7gidbA8zyHkOINsvA/sumcOkjcabcBmw2+mMgAAAABJRU5ErkJggg==");
    }
  }
  &.console-info {
    .console-icon {
      background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADISURBVChTY4ABp/AztmZBZ07qe538rO114rOa8+GTskYHbKHSEOARd6nLIOTsf61gIA46U6kVePYQiK3uc/K/hPG+LrCi8IyrtkZh5yCKgk/80w46ba0RdGYGhH/2v6rXyf88qtttGVwSLp2ECQLxeiAu1wo6uwpJ7L+o2f6TDA6xZz8jCyqFnuHXCj4djywmZXHoM/EK0azGqhBsNYpngL6VCTnGqRF4xgKo+D5IDO4ZEEAKnjcQBafvqwWf/YoSPDCAP8AZGAC7mLM81zgOTQAAAABJRU5ErkJggg==");
    }
  }
  &.console-debug {
    .console-icon {
      background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 459 459'%3e%3cpath fill='%234D88FF' d='M433.5 127.5h-71.4a177.7 177.7 0 0 0-45.9-51L357 35.7 321.3 0l-56.1 56.1c-10.2-2.6-23-5.1-35.7-5.1s-25.5 2.5-35.7 5.1L137.7 0 102 35.7l40.8 40.8a177.7 177.7 0 0 0-45.9 51H25.5v51H79c-2.5 7.7-2.5 17.9-2.5 25.5v25.5h-51v51h51V306a88 88 0 0 0 2.5 25.5H25.5v51h71.4A152.2 152.2 0 0 0 229.5 459c56.1 0 107.1-30.6 132.6-76.5h71.4v-51H380c2.5-7.7 2.5-17.9 2.5-25.5v-25.5h51v-51h-51V204c0-7.7 0-17.9-2.5-25.5h53.5v-51zm-153 204h-102v-51h102v51zm0-102h-102v-51h102v51z'/%3e%3c/svg%3e");
    }
    color: var(--c-text-debug);
  }
  &.console-error {
    background-color: var(--c-bg-error);
    border-top: 1px solid var(--c-border-error);
    border-bottom: 1px solid var(--c-border-error);
    color: var(--c-text-error);
    .console-icon {
      background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADESURBVChTY4CB7ZI8tmfU5E6e01b+DMIgNkgMKg0BR9Vkux6YWPx/bemIgkFiIDmwogOaqrYPzazAEm8DwuGKYGyQHEgNw0VT05Mwib9v3v7/kJEHxiA2TDFIDcNNU4vPMFPACj58/P/v40cwGyYOUsNwy8IZRSFIEUgxskKQGoZrzp4ErQapYbgYHG371M4dLACTQGaD5EBqwD6/FpzQ9dTBE64IhkFiIDmwIhi4mlJqey8o4eR9r8jPIAxig8QgsgwMAFZz1YtGPXgjAAAAAElFTkSuQmCC");
    }
  }
}

.mr-1 {
  margin-right: 4px;
}
</style>
