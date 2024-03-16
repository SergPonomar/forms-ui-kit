<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  inputId?: string
  state?: 'idle' | 'editing' | 'error' | 'disabled'
  required?: boolean
  label?: string
  supportText?: string
  errorText?: string
}

const props = withDefaults(defineProps<Props>(), {
  inputId: undefined,
  state: undefined,
  required: false,
  label: '',
  supportText: '',
  errorText: ''
})

const stateClasses = computed(() => {
  switch (props.state) {
    case 'editing':
    case 'error':
    case 'disabled':
      return `ui-input-container__slot_${props.state}`
    default:
      return ''
  }
})
</script>

<template>
  <div class="ui-input-container">
    <label
      v-if="label"
      :for="inputId"
      class="ui-input-container__label"
    >
      <span>{{ label }}</span>
      <span
        v-if="required"
        class="ui-input-container__required"
      >
        *
      </span>
    </label>
    <p
      v-if="supportText"
      class="ui-input-container__support-text"
    >
      {{ supportText }}
    </p>
    <div
      class="ui-input-container__slot"
      :class="stateClasses"
    >
      <slot />
    </div>
    <p
      v-if="errorText"
      class="ui-input-container__error-text"
    >
      {{ errorText }}
    </p>
  </div>
</template>

<style lang="scss">
.ui-input-container {

  &__label {
    @include label-l;
    display: block;
    margin-bottom: 8px;
  }

  &__required {
    @include caption-l;
    color: $error-1;
    margin-left: 8px;
    vertical-align: bottom;
  }

  &__support-text {
    @include caption-l;
    color: $solid-grey-600;
    margin-bottom: 8px;
  }

  &__slot {
    @include body-l;
    color: $solid-grey-900;
    border: 1px solid $solid-grey-900;
    padding: 12px 16px;
    border-radius: 8px;
    width: 100%;
    margin: 4px 0;
    background: white;

    &_editing {
      border: 1px solid transparent;
      outline: 4px solid $focus-yellow;
    }

    &_error {
      border: 1px solid $error-1;
    }

    &_disabled {
      background: $solid-grey-50;
      border: 1px solid $solid-grey-420;
    }
  }

  &__error-text {
    margin-top: 8px;
    @include caption-l;
    color: $error-1;
  }
}
</style>
