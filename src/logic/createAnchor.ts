import { h } from "vue"

export function createAnchor(
  component: Component,
  options: {
    text: string
    href: string
    class: string
  }
) {
  if (typeof component === "function") return h("span", [component(options)])

  return h(
    component,
    {
      href: options.href,
      class: options.class
    },
    [options.text]
  )
}
