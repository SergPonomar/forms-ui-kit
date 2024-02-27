<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'l' | 'm' | 's' | 'xs'
  label?: string
  state?: 'disabled'
  style?: 'primary' | 'secondary' | 'tertiary'
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  size: 'l',
  state: undefined,
  style: undefined
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'm':
    case 's':
    case 'xs':
      return `ui-button_size-${props.size}`
    default:
      return ''
  }
})

const styleClasses = computed(() => {
  switch (props.style) {
    case 'secondary':
    case 'tertiary':
      return `ui-button_${props.style}`
    default:
      return ''
  }
})

</script>

<template>
  <button
    class="ui-button"
    :class="[sizeClasses, styleClasses]"
    :disabled="state === 'disabled'"
    focus
  >
    {{ label }}
  </button>
</template>

<style lang="scss">
.ui-button {
  display: block;
  @include button();

  // --- Default size (Large) ---
  min-width: 136px;
  height: 56px;
  text-align: center;
  border-radius: 8px;
  margin: 4px 0;
  padding: 0 16px;

  &_size-m {
    min-width: 96px;
    height: 48px;
    padding: 0 12px;
  }

  &_size-s {
    min-width: 80px;
    height: 36px;
    padding: 0 6px;
  }

  &_size-xs {
    min-width: 72px;
    height: 28px;
    font-size: 14;
    line-height: 100%;
    padding: 0 7px;
  }

  // --- Default style (Primary) ---
  color: $white;
  background: $blue-900;

  @include hover {
    background: $blue-1000;
    text-decoration: underline;
  }

  @include active {
    background: $blue-1100;
    text-decoration: underline;
  }

  &:focus {
    outline: 2px solid $focus-yellow;
    outline-offset: 2px;
    text-decoration: underline;
  }

  &:disabled {
    color: rgba(255, 255, 255, 34%);
    background: rgba(0, 0, 0, 30%);
    cursor: not-allowed;
  }

  @mixin tertiary {
    color: $blue-900;
    background: none;

    @include hover {
      color: $blue-1000;
      background: $blue-200;
    }

    @include active {
      color: $blue-1200;
      background: $blue-300;
    }

    &:disabled {
      color: $solid-grey-400;
      background: none;
    }
  }

  &_secondary {
    @include tertiary();
    background: $white;
    border: 1px solid $blue-900;

    @include hover {
      border: 1px solid $blue-1000;
    }

    @include active {
      border: 1px solid $blue-1200;
    }

    &:disabled {
      border: 1px solid $solid-grey-400;
      background: $white;
    }
  }

  &_tertiary {
    @include tertiary();

    &:disabled {
      text-decoration: underline;
    }
  }
}
</style>
