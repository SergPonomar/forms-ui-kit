<script setup lang="ts">
import { provide } from 'vue'
import axios from 'axios'
import type { AxiosError, Method } from 'axios'
import { setup, assign, fromPromise } from 'xstate'
import type { Actor, AnyActorLogic } from 'xstate'
import PreloaderComponent from '@/components/ui-kit/PreloaderComponent.vue'
import { useSaveMachine, emptyStorage } from '@/utils'

interface Props {
  name?: string,
  numberOfSteps?: number,
  url: string,
  method?: Method
}

const props = withDefaults(defineProps<Props>(), {
  name: undefined,
  numberOfSteps: 1,
  method: 'post'
})

const emit = defineEmits(['done', 'error'])

provide('formName', props.name)

const fetchForm = async (payload: Object[]) => {
  const payloadObj = Object.fromEntries(payload.map(obj => Object.entries(obj)).flat())
  const { data } = await axios({
    url: props.url,
    method: props.method,
    data: props.url !== 'get' ? payloadObj : undefined,
    params: props.url === 'get' ? payloadObj : undefined
  })
  return data
}

const findStepByField = (payload: Object[], field: string) => {
  for (const [index, obj] of payload.entries()) {
    if (Object.prototype.hasOwnProperty.call(obj, field)) {
      return index + 1
    }
  }
}

const formMachine = setup({
  actions: {
    validateAction: ({ context }) => {
      (Object.values(context.inputs) as Actor<AnyActorLogic>[]).forEach((actor) => {
        actor.send({ type: 'VALIDATE' })
      })
    },
    resetAction: ({ context }) => {
      (Object.values(context.inputs) as Actor<AnyActorLogic>[]).forEach((actor) => {
        actor.send({ type: 'RESET' })
      })
    },
    preparePayloadActionInc: assign({
      payload: ({ context }) => {
        if (context.step <= props.numberOfSteps) {
          const payloadObj = Object.fromEntries(Object.keys(context.inputs).map(name => [name, undefined]))
          context.payload.push(payloadObj)
        }
        return context.payload
      }
    }),
    preparePayloadActionDec: assign({
      payload: ({ context }) => {
        context.payload.pop()
        return context.payload
      }
    }),
    collectPayloadAction: ({ context }) => {
      (Object.values(context.inputs) as Actor<AnyActorLogic>[]).forEach((actor) => {
        actor.send({ type: 'COLLECT' })
      })
    },
    stepIncrement: assign({
      step: ({ context }) => Math.min(context.step + 1, props.numberOfSteps)
    }),
    stepDecrement: assign({
      step: ({ context }) => Math.max(context.step - 1, 1),
      errors: () => ({})
    })
  },
  actors: {
    fetchUser: fromPromise(({ input }: { input: { payload: Object[] } }) => {
      const delay = new Promise((resolve, _reject) => {
        setTimeout(() => {
          resolve('delay')
        }, 100)
      })
      return delay.then(() => fetchForm(input.payload))
    }
    )
  }
}).createMachine({
  id: props.name,
  context: {
    step: 1,
    inputs: {},
    errors: {},
    payload: []
  },
  initial: 'idle',
  on: {
    REGISTER: {
      actions: assign({
        inputs: ({ context, event }) => {
          const { name, actor } = event.data
          context.inputs[name] = actor
          return context.inputs
        }
      })
    },
    UNREGISTER: {
      actions: assign({
        inputs: ({ context, event }) => {
          delete context.inputs[event.data.name]
          return context.inputs
        }
      })
    },
    ERROR: {
      target: '.error',
      actions: assign({
        errors: ({ context, event }) => {
          const { name, error } = event.data
          context.errors[name] = error
          return context.errors
        }
      })
    },
    UNERROR: {
      actions: assign({
        errors: ({ context, event }) => {
          delete context.errors[event.data.name]
          return context.errors
        }
      })
    },
    PREVIOUS: {
      actions: [
        'preparePayloadActionDec',
        'stepDecrement'
      ]
    },
    RESET: {
      target: '.idle',
      actions: [
        'resetAction',
        assign({
          step: () => 1,
          errors: () => ({}),
          payload: () => []
        }),
        () => { emptyStorage(props.name) }
      ]
    },
    VALUE: {
      actions: assign({
        payload: ({ context, event }) => {
          const { name, value } = event.data
          // if (context.payload.length < 1) { return context.payload }
          const lastStepIndex = context.payload.length - 1
          context.payload[lastStepIndex][name] = value
          return context.payload
        }
      })
    }
  },
  states: {
    idle: {
      on: {
        TRYSUBMIT: {
          actions: [
            'validateAction',
            ({ self }) => { self.send({ type: 'SUBMIT' }) }
          ]
        },
        SUBMIT: {
          actions: [
            'preparePayloadActionInc',
            'collectPayloadAction'
          ],
          target: 'loading'
        },
        TRYNEXT: {
          actions: [
            'validateAction',
            ({ self }) => { self.send({ type: 'NEXT' }) }
          ]
        },
        NEXT: {
          actions: [
            'preparePayloadActionInc',
            'collectPayloadAction',
            'stepIncrement'
          ]
        }
      }
    },
    loading: {
      invoke: {
        src: 'fetchUser',
        input: ({ context }) => ({ payload: context.payload }),
        onDone: {
          target: 'idle',
          actions: ({ event, self }) => {
            self.send({ type: 'RESET' })
            emit('done', event.output)
          }
        },
        onError: {
          target: 'error',
          actions: [
            assign({
              step: ({ event: { error }, context }) => {
                emit('error', error)
                const response = (error as AxiosError).response
                if (response && response.data) {
                  interface ErrorResponse {
                    errors: { [key: string]: string; }
                  }
                  const data = response.data as ErrorResponse
                  let step: number | undefined
                  for (const field in data.errors) {
                    step = findStepByField(context.payload, field)
                    if (step) { break }
                  }

                  Object.entries(data.errors || []).forEach(([field, error]) => {
                    setTimeout(() => {
                      const input = context.inputs[field]
                      if (input) {
                        input.send({ type: 'ERROR', data: { error } })
                      }
                    }, 0)
                  })

                  return step || context.step
                }
                return context.step
              }
            })
          ]
        }
      }
    },
    error: {
      always: {
        guard: ({ context }) => Object.keys(context.errors).length === 0,
        target: 'idle'
      }
    }
  }
})

const { snapshot, send, actorRef: formActor } = useSaveMachine(formMachine, props.name, props.name)
provide('formActor', formActor)
const reset = () => { send({ type: 'RESET' }) }
</script>

<template>
  <PreloaderComponent
    render-as="form"
    :loading="snapshot.value === 'loading'"
    :name="name"
  >
    <slot
      :step="snapshot.context.step"
      :number-of-steps="numberOfSteps"
      :reset="reset"
    />
  </PreloaderComponent>
</template>

<style>
</style>
