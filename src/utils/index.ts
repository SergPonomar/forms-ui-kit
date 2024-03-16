import type { AnyStateMachine } from 'xstate'
import { useMachine } from '@xstate/vue'
import { onUpdated } from 'vue'

const useSaveMachine = (machine: AnyStateMachine, machineId?: string, rootObject?: string) => {
  if (!machineId) {
    return useMachine(machine)
  }
  const restoredState = rootObject
    ? (function () {
        const root = sessionStorage.getItem(rootObject)
        if (!root) { return undefined }
        return JSON.parse(root)[machineId]
      })()
    : (function () {
        const state = sessionStorage.getItem(machineId)
        if (!state) { return undefined }
        return JSON.parse(state)
      })()

  const useMachineOut = useMachine(machine, {
    snapshot: restoredState
  })

  onUpdated(() => {
    const persistedState = useMachineOut.actorRef.getPersistedSnapshot()
    if (!rootObject) {
      sessionStorage.setItem(machineId, JSON.stringify(persistedState))
    } else {
      const root = sessionStorage.getItem(rootObject) || '{}'
      const rootParsed = JSON.parse(root)
      rootParsed[machineId] = persistedState
      sessionStorage.setItem(rootObject, JSON.stringify(rootParsed))
    }
  })

  return { ...useMachineOut, restoredState }
}

const emptyStorage = (machineId?: string, rootObject?: string) => {
  if (!machineId) { return }
  if (!rootObject) {
    sessionStorage.removeItem(machineId)
  } else {
    const root = sessionStorage.getItem(rootObject)
    if (!root) { return }
    const rootParsed = JSON.parse(root)
    delete rootParsed[machineId]
    sessionStorage.setItem(rootObject, JSON.stringify(rootParsed))
  }
}

export { useSaveMachine, emptyStorage }
