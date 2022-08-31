import { Encode } from "./Encode"
import type { Table } from "./Table"

type ItemData =
  | {
      data: ReturnType<typeof Encode>
      count: number
      type: "warn" | "info" | "debug" | "error" | "output" | "log"
    }
  | {
      data: ReturnType<typeof Table>
      type: "table"
    }
export interface GroupData {
  "@key": ReturnType<typeof Encode>
  "@raw": unknown
  "@items": (ItemData | GroupData)[]
}

function createGroups() {
  return {
    groups: <GroupData[]>[],
    tasks: <GroupData[]>[]
  }
}

function group(
  groups: ReturnType<typeof createGroups>,
  key: unknown = "console.group"
) {
  // check on tasks
  if (groups.tasks.length === 0) {
    const groupData: GroupData = {
      "@key": Encode(key),
      "@raw": key,
      "@items": []
    }

    groups.groups.push(groupData)
    groups.tasks.push(groupData)

    return groupData
  }

  // tasks not resolve
  // last task
  const lastGroupOnTask = groups.tasks[groups.tasks.length - 1]
  const newGroup: GroupData = {
    "@key": Encode(key),
    "@raw": key,
    "@items": []
  }
  lastGroupOnTask["@items"].push(newGroup)
  groups.tasks.push(newGroup)

  return newGroup
}
function pushGroup(groups: ReturnType<typeof createGroups>, value: ItemData) {
  // task working
  groups.tasks[groups.tasks.length - 1]?.["@items"].push(value)
}
function groupEnd(
  groups: ReturnType<typeof createGroups>,
  key: unknown = "console.group"
) {
  if (groups.tasks.length === 0) return

  // eslint-disable-next-line functional/no-let
  for (let i = groups.tasks.length - 1; i > -1; i--) {
    if (groups.tasks[i]["@raw"] === key) {
      groups.tasks.splice(i)
      break
      // stop
    }
  }
}

// working

const groups = createGroups()

group(groups)
group(groups)
groupEnd(groups)
group(groups)

console.dir(groups)
