<script setup lang="ts">
import { useMachine, useSelector } from '@xstate/vue';
import { ref } from 'vue'
import { setup, fromCallback, assign, sendTo, assertEvent } from 'xstate';
import UiInputContainer from './ui-kit/UiInputContainer.vue'

const inputValue = ref('')
const emit = defineEmits(['register'])
const props = defineProps({
  name: {
    type: String,
    default: ''
  },
  formId: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  supportText: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  validationFunc: {
    type: Function,
    default: undefined
  }
})

const validationFunc = props.validationFunc || function (value: string) {
  return props.required && !value.length ?
    'Поле обязательно для заполнения' :
    ''
}

const validationActor = fromCallback(({ sendBack, receive }) => {
  receive(event => {
    assertEvent(event, 'VALIDATE');
    const value = (event as VALIDATE).data.value
    const error = validationFunc(value)
    sendBack(!error? 
    {
      type: 'SUCCESS',
    } : {
      type: 'ERROR',
      data: {
        error
      }
    })
  })
});

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

type MachineEvents = FOCUS | VALIDATE | INPUT | BLUR | ERROR | ACTIVATE | DISABLE | SUCCESS

const inputMachine = setup({
  types: {} as {
    context: { value: string, error: string };
    events: MachineEvents;
  },
  actions: {
    validateAction: sendTo('validationActor', ({ context }) => {
      return { type: 'VALIDATE', data: { value: context.value }};
    })
  },
  actors: {
    validationActor
  },
}).createMachine({
  id: 'textInput',
  initial: 'idle',
  context: {
    value: inputValue.value,
    error: ''
  },
  invoke: {
    id: 'validationActor',
    src: 'validationActor',
  }, 
  states: {
    idle: {
      on: {
        FOCUS: 'editing',
        DISABLE: 'disabled',
        VALIDATE: {
          actions: ['validateAction'],
        },
        ERROR: 'error',
      },
    },
    editing: {
      on: {
        INPUT: {
          actions: assign({
            value: ({ event }) => event.data.value,
          })
        },
        BLUR: {
          actions: ['validateAction'],
        },
        SUCCESS: {
          target: 'idle',
          actions: assign({
            error: () => ''
          })
        },
        ERROR: 'error',
      }
    },
    error: {
      entry: assign({
        error: ({ event }) => {
          assertEvent(event, 'ERROR');
          return event.data.error
        }
      }),
      on: {
        FOCUS: 'editing',
      },
    },
    disabled: {
      on: {
        ACTIVATE: 'idle'
      }
    }
  }
});
const { snapshot, send, actorRef } = useMachine(inputMachine)
emit("register", { type: 'REGISTER', data: actorRef })

const inputId = `${props.formId}-${props.name}`

const errorText = useSelector(actorRef, (snapshot) => snapshot.context.error)
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
      v-model="inputValue"
      type="text"
      :name="name"
      :disabled="snapshot.value === 'disabled'"
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
