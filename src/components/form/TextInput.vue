<script setup lang="ts">
import { useSelector } from '@xstate/vue'
import { ref, inject, useAttrs, computed, onUnmounted, onMounted } from 'vue'
import { setup, fromCallback, assign, sendTo, assertEvent } from 'xstate'
import type { Actor, AnyActorLogic } from 'xstate'
import UiInputContainer from '@/components/ui-kit/UiInputContainer.vue'
import { useSaveMachine, emptyStorage } from '@/utils'

const emit = defineEmits(['register', 'unregister'])

interface Props {
  name?: string,
  formName?: string,
  label?: string,
  supportText?: string,
  required?: boolean,
  validationFunc?: (value: any) => string
}

const props = withDefaults(defineProps<Props>(), {
  name: undefined,
  formName: '',
  label: '',
  supportText: '',
  required: false,
  validationFunc: function (value: string): string {
    return this.required && !value.length
      ? 'Поле обязательно для заполнения'
      : ''
  }
})

const formName = props.formName || inject('formName', undefined) || ''

interface WithValue<T> {
  data: { value: T }
}

interface WithError {
  data: { error: string }
}

type FOCUS = { type: 'FOCUS' } & WithValue<string>
type VALIDATE = { type: 'VALIDATE' } & WithValue<string>
type INPUT = { type: 'INPUT' } & WithValue<string>
type BLUR = { type: 'BLUR' } & WithValue<string>
type ERROR = { type: 'ERROR' } & WithError
type ACTIVATE = { type: 'ACTIVATE' }
type DISABLE = { type: 'DISABLE' }
type SUCCESS = { type: 'SUCCESS' }
type COLLECT = { type: 'COLLECT' }

type MachineEvents = FOCUS | VALIDATE | INPUT | BLUR | ERROR | ACTIVATE | DISABLE | SUCCESS | COLLECT

const validationActor = fromCallback(({ sendBack, receive }) => {
  receive((event) => {
    assertEvent(event, 'VALIDATE')
    const value = (event as VALIDATE).data.value
    const error = props.validationFunc(value)
    sendBack(!error
      ? {
          type: 'SUCCESS'
        }
      : {
          type: 'ERROR',
          data: {
            error
          }
        })
  })
})

const inputId = `${formName}-${props.name}`
const formActor = inject<Actor<AnyActorLogic>>('formActor')
const inputMachine = setup({
  types: {} as {
    context: { value: string, error: string };
    events: MachineEvents;
  },
  actions: {
    validateAction: sendTo('validationActor', ({ context }) => {
      return { type: 'VALIDATE', data: { value: context.value } }
    })
  },
  actors: {
    validationActor
  }
}).createMachine({
  id: inputId,
  initial: 'idle',
  context: {
    value: '',
    error: ''
  },
  invoke: {
    id: 'validationActor',
    src: 'validationActor'
  },
  on: {
    VALIDATE: {
      actions: ['validateAction']
    },
    DISABLE: '.disabled',
    ERROR: '.error',
    RESET: {
      target: '.idle',
      actions: [
        assign({
          value: () => '',
          error: () => ''
        }),
        () => {
          emptyStorage(props.name, formName)
        }
      ]
    },
    COLLECT: {
      actions: [
        ({ context }) => {
          if (!formActor) { return }
          formActor.send({ type: 'VALUE', data: { name: props.name, value: context.value } })
        }
      ]
    }
  },
  states: {
    idle: {
      on: {
        FOCUS: 'editing'
      }
    },
    editing: {
      on: {
        INPUT: {
          actions: assign({
            value: ({ event }) => event.data.value
          })
        },
        BLUR: {
          actions: ['validateAction']
        },
        SUCCESS: {
          target: 'idle',
          actions: [
            assign({
              error: () => ''
            }),
            () => {
              if (!formActor) { return }
              formActor.send({ type: 'UNERROR', data: { name: props.name } })
            }
          ]
        },
        ERROR: 'error'
      }
    },
    error: {
      entry: [
        ({ event }) => {
          assertEvent(event, 'ERROR')
          if (!formActor) { return }
          formActor.send({ type: 'ERROR', data: { name: props.name, error: event.data.error } })
        },
        assign({
          error: ({ event }) => {
            assertEvent(event, 'ERROR')
            return event.data.error
          }
        })
      ],
      on: {
        FOCUS: 'editing'
      }
    },
    disabled: {
      on: {
        ACTIVATE: 'idle'
      }
    }
  }
})

const { snapshot, send, actorRef } = useSaveMachine(inputMachine, props.name, formName)

// const inputValue = ref(snapshot.value.context.value)
const inputValue = useSelector(actorRef, snapshot => snapshot.context.value)
const textInput = ref()

emit('register', { type: 'REGISTER', data: { name: props.name, actor: actorRef } })
if (formActor) {
  formActor.send({ type: 'REGISTER', data: { name: props.name, actor: actorRef } })
}

const errorText = useSelector(actorRef, snapshot => snapshot.context.error)
const attrs = useAttrs()
const attrsNoStyles = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { class: _c, style: _s, ...rest } = attrs
  return rest
})

onMounted(() => {
  if (textInput.value !== document.activeElement && snapshot.value.value === 'editing') {
    textInput.value.focus()
  }
})

onUnmounted(() => {
  emit('unregister', { type: 'UNREGISTER', data: { name: props.name } })
  if (formActor) {
    formActor.send({ type: 'UNREGISTER', data: { name: props.name } })
  }
})
</script>

<template>
  <UiInputContainer
    :input-id="inputId"
    :state="snapshot.value"
    :required="required"
    :label="label"
    :support-text="supportText"
    :error-text="errorText"
  >
    <input
      :id="inputId"
      ref="textInput"
      v-model="inputValue"
      type="text"
      :name="name"
      :disabled="snapshot.value === 'disabled'"
      v-bind="attrsNoStyles"
      class="text-input__input"
      @input="(e) => send({ type: 'INPUT', data: { value: (e.target as HTMLInputElement).value }})"
      @blur="(e) => send({ type: 'BLUR', data: { value: (e.target as HTMLInputElement).value }})"
      @focus="(e) => send({ type: 'FOCUS', data: { value: (e.target as HTMLInputElement).value }})"
    >
  </UiInputContainer>
</template>

<style lang="scss">
.text-input {

  &__input {
    width: 100%;
  }
}
</style>
