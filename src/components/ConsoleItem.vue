<template>
  <div
    class="console-wrap console-item"
    :class="type ? `console-${type}` : undefined"
  >
    <span v-if="type" class="console-icon" />
    <div class="console-value">
      <ConsoleValue
        :data="data"
        :is-log="type !== undefined"
        :_get-list-link-async="_getListLinkAsync ?? _getListLinkAsyncDefault"
        :read-link-object-async="readLinkObjectAsync ?? readLinkObjectAsyncDefault"
        :call-fn-link-async="callFnLinkAsync ?? callFnLinkAsyncDefault"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Encode, readLinkObject, _getListLink , callFnLink} from "../logic/Encode"
import {
  readLinkObjectAsync as readLinkObjectAsyncDefault,
  _getListLinkAsync as _getListLinkAsyncDefault,
  callFnLinkAsync as callFnLinkAsyncDefault
} from "./api-async-defaults"
import ConsoleValue from "./ConsoleValue.vue"
import { Promisy } from "./Promisy"

defineProps<{
  data: ReturnType<typeof Encode>
  type?: "warn" | "info" | "debug" | "error" | "output" | "log"

  // api
  _getListLinkAsync?: Promisy<typeof _getListLink>
  readLinkObjectAsync?: Promisy<typeof readLinkObject>
  callFnLinkAsync?: Promisy<typeof callFnLink>
}>()
</script>

<style lang="scss" scoped>
@import "./wrap.scss";

.console-item {
  // border-top: 1px solid #3a3a3a;
  border-bottom: 1px solid #3a3a3a;
  padding: {
    top: 5px;
    bottom: 5px;
  }
  display: flex;
  .console-value {
    min-width: 0;
    flex: 1;
  }

  :deep(.console-link) {
    color: rgb(177, 177, 177);
    text-decoration: underline;
  }
  :deep(.color-white) {
    color: white;
  }

  .badge {
    background-color: #5db0d7;
    border-radius: 30px;
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
  .console-value {
    margin-left: (10px + 7px * 2);
  }

  &.console-output {
    .console-icon {
      background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABpSURBVChTY6A92LNnj96uXbvKoVzsYMeOHVbbt29/D1T4eP/+/QJQYVSwe/duD6CCr0B8A8iWgwqjAqBk2NatW38B6bPbtm0TBYkBFbsA+c9ANFgRCBCtEASAAoSthgGiPAMD2IOHgQEA521bM7uG52wAAAAASUVORK5CYII=");
    }
  }

  &.console-warn {
    background-color: #332b00;
    border-top: 1px solid #665500;
    border-bottom: 1px solid #665500;
    color: #f2ab26;
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
    color: #4d88ff;
  }
  &.console-error {
    background-color: #290000;
    border-top: 1px solid #5c0000;
    border-bottom: 1px solid #5c0000;
    color: #ff5d32;
    .console-icon {
      background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADESURBVChTY4CB7ZI8tmfU5E6e01b+DMIgNkgMKg0BR9Vkux6YWPx/bemIgkFiIDmwogOaqrYPzazAEm8DwuGKYGyQHEgNw0VT05Mwib9v3v7/kJEHxiA2TDFIDcNNU4vPMFPACj58/P/v40cwGyYOUsNwy8IZRSFIEUgxskKQGoZrzp4ErQapYbgYHG371M4dLACTQGaD5EBqwD6/FpzQ9dTBE64IhkFiIDmwIhi4mlJqey8o4eR9r8jPIAxig8QgsgwMAFZz1YtGPXgjAAAAAElFTkSuQmCC");
    }
  }
}
</style>
