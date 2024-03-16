<script setup lang="ts">
import { provide, watch } from 'vue'
import { createMachine } from 'xstate'
import { useMachine } from '@xstate/vue'

const emit = defineEmits(['machineEvent'])

interface Props {
  state?: 'idle' | 'error',
}

const props = withDefaults(defineProps<Props>(), {
  state: 'idle'
})

const testMachine = createMachine({
  id: 'test',
  initial: props.state,
  states: {
    idle: {
      on: {
        error: 'error'
      }
    },
    error: {
      on: {
        idle: 'idle'
      }
    }
  }
})

const { actorRef, send } = useMachine(testMachine, {
  inspect: (inspectionEvent) => {
    if (inspectionEvent.type === '@xstate.event' && inspectionEvent.event.type !== 'xstate.init') {
      emit('machineEvent', inspectionEvent.event)
    }
  }
})

watch(() => props.state, (state) => {
  send({ type: state })
})

provide('formActor', actorRef)
</script>

<template>
  <slot />
</template>

<style lang="scss">
</style>
