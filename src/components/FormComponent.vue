<script setup>
import { useMachine } from '@xstate/vue';
import { fromPromise, createActor, createMachine, setup, assign, sendTo } from 'xstate';
import TextInput from './TextInput.vue'
import UiButton from './ui-kit/UiButton.vue'

const promiseLogic = fromPromise(async () => {
  console.log("promiseLogic")
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });

  return 'foo'
});

const logAction = () => { console.log('action') }

const formMachine = setup({
  actions: {
    logAction
  },
  // guards: {
  //   someGuard: ({ context }) => context.count <= 10
  // },
  actors: {
    promiseActor: promiseLogic
  },
  // delays: {
  //   someDelay: () => 1000
  // }
}).createMachine({
  id: 'formComponent',
  context: {
    fields: []
  },
  initial: 'initialization',
  states: {
    initialization: {
      on: {
        REGISTER: {
          actions: assign({
            fields: ({ context, event }) => context.fields.concat(event.data)
          }),
          target: 'ready'
        },
      }
    },
    ready: {
      on: {
        ERROR: 'error',
        SUBMIT: {
          actions: sendTo(({ context }) => context.fields[0], {
            type: 'VALIDATE',
          }),
        }
      },
    },
    error: {

    }
  },
});

const { snapshot, send } = useMachine(formMachine)

const onSubmit = (e) => {
  send({ type: 'SUBMIT' })
}

const onInput = (e) => {
  console.log(e)
}

const onFocus = (e) => {
  console.log(e);
}
</script>

<template>
  <!-- План
    +1. Добавить стили на сабмит батон
    +2. Шрифты
    +-3. Тайпскрипт
    4. Тесты
    +5. Сторибук
    +6. Разделить компоненты на uikit
    7. Вынести машину из инпута
    8. Добавить TextInput и FormComponent в сторибук
    9. Добавить дизайн систему в сторибук
    10. Оболочка для инпутов
   -->
  <form class="form-component">
    <!--     {{ snapshot.value }}
    {{ snapshot.context.fields }} -->
    <TextInput
      label="Имя"
      name="surname"
      form-id="auth"
      @register="send($event)"
    />
    <TextInput
      label="Фамилия"
      name="name"
      support-text="Ваше имя очень надо"
      form-id="auth"
      required
      @register="send($event)"
    />
    <UiButton
      label="Отправить"
      state="disabled"
      @focus="onFocus"
      @click.prevent="send({ type: 'SUBMIT' })"
    />
  </form>
</template>

<style>
.form-component {
  width: 367px;
  padding: 20px;
}
</style>
