<script setup lang="ts">
interface Props {
  renderAs?: string,
  loading: boolean
}

withDefaults(defineProps<Props>(), {
  renderAs: 'div',
  loading: false
})

</script>

<template>
  <component
    :is="renderAs"
    class="ui-preloader-component"
  >
    <slot />
    <div
      v-if="loading"
      class="ui-preloader-component__overlay"
    >
      <img
        class="ui-preloader-component__spinner"
        src="/images/spinner.svg"
      >
    </div>
  </component>
</template>

<style lang="scss">
.ui-preloader-component {
  position: relative;

  &__overlay {
    display: flex;
    align-items:center;
    justify-content: center;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(255, 255, 255, 0.5);
  }

  &__spinner {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    animation: spin 0.8s cubic-bezier(0.1, 0.5, 0.9, 0.2) infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(50deg);
    }

    to {
      transform: rotate(410deg);
    }
  }
}
</style>
