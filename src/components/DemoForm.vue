<script setup lang="ts">
import { ref } from 'vue'
import TextInput from '@/components/form/TextInput.vue'
import SubmitButton from '@/components/form/SubmitButton.vue'
import PreviousButton from '@/components/form/PreviousButton.vue'
import FormComponent from '@/components/form/FormComponent.vue'

const test = ref(true)
</script>

<template>
  <FormComponent
    v-slot="slotProps"
    name="demo-form"
    :number-of-steps="3"
    method="post"
    url="https://sergponomar-form-demo.builtwithdark.com/demo-form"
    class="demo-form"
  >
    <h3 class="demo-form__title">
      Форма&nbsp;<span>4-ТПЗВ<span class="demo-form__step">({{ slotProps.step }}/{{ slotProps.numberOfSteps }})</span></span>
    </h3>
    <p class="demo-form__annotation">
      Заявление на подключение домовладений к сетям газораспределения.
    </p>
    <div
      v-if="slotProps.step === 1"
    >
      <TextInput
        label="Поле 1"
        name="field1"
        required
        class="demo-form__input"
      />
      <TextInput
        v-if="test"
        label="Поле 2"
        name="field2"
        support-text="Введите данные в поле 2"
        class="demo-form__input"
      />
      <SubmitButton
        label="Далее"
        class="demo-form__submit"
        next
      />
    </div>
    <div v-if="slotProps.step === 2">
      <TextInput
        label="Поле 3"
        name="field3"
        required
        class="demo-form__input"
      />
      <TextInput
        v-if="test"
        label="Поле 4"
        name="field4"
        support-text="Введите данные в поле 4"
        class="demo-form__input"
      />
      <div class="demo-form__buttons">
        <PreviousButton
          label="Назад"
        />
        <SubmitButton
          label="Далее"
          next
          class="demo-form__submit"
        />
      </div>
    </div>
    <div v-if="slotProps.step === 3">
      <TextInput
        label="Поле 5"
        name="field5"
        required
        class="demo-form__input"
      />
      <TextInput
        v-if="test"
        label="Поле 6"
        name="field6"
        support-text="Введите данные в поле 6"
        class="demo-form__input"
      />
      <div class="demo-form__buttons">
        <PreviousButton
          label="Назад"
        />
        <SubmitButton
          label="Отправить"
          class="demo-form__submit"
        />
      </div>
    </div>
  </FormComponent>
</template>

<style lang="scss">
.demo-form {
  color: $solid-grey-900;

  &__input {
    margin-bottom: $space-unit;

    &:last-of-type {
      margin-bottom: $space-unit-5x;
    }
  }

  &__submit {
    width: 100%;
  }

  &__buttons {
    margin-top: $space-unit-5x;
    display: flex;
    flex-direction: column-reverse;
  }

  &__title {
    @include headline-l-mobile;
    color: $solid-grey-900;
    font-weight: 400;
    margin-top: $space-unit;
    margin-bottom: $space-unit-2x;
  }

  &__step {
    @include headline-xs-mobile;
    margin-left: $space-unit-2x;
    vertical-align: 0.3em;
  }

  &__annotation {
    margin-bottom: $space-unit-3x;
  }

  @media screen and (min-width: 768px) {

    &__buttons {
      display: grid;
      column-gap: $space-unit-2x;
      grid-template-columns: repeat(2, 1fr);
    }

    &__title {
      @include headline-l;
      margin-top: 0;
    }

    &__annotation {
      margin-bottom: $space-unit-4x;
    }

    &__step {
      @include headline-xs;
      vertical-align: 0.25em;
    }
  }
}
</style>
