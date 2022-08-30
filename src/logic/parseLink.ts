import type { Component, Slot, VNode } from "vue"

import { createAnchor } from "./createAnchor"

function formatRelativeLink(value: string): string {
  return value
    .slice(value.lastIndexOf("/") + 1)
    .replace(/t=\d+/, "")
    .replace(/\?:/, ":")
}

const rUrl = /(?:[^\s()]+):\/\/[^\s()]+/gi

export function parseLink(
  text: string,
  options?: {
    minifyLink?: boolean
    classes?: string
    component?: string | Component | Slot
  }
) {
  const minifyLink = options?.minifyLink
  const classes = options?.classes ?? ""
  const component = options?.component ?? "a"

  text = text.replace(/</g, "&lt;").replace(/>/g, "&gt;") // block XSS

  const children: (string | VNode)[] = []
  // eslint-disable-next-line functional/no-let
  let lastIndex = 0
  for (const match of text.matchAll(rUrl)) {
    children.push(text.slice(lastIndex, match.index))

    children.push(
      createAnchor(component, {
        href: match[0],
        class: classes,
        get text() {
          return minifyLink ? formatRelativeLink(match[0]) : match[0]
        }
      })
    )
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    lastIndex = match.index! + match[0].length
  }

  children.push(text.slice(lastIndex))

  return children
}
