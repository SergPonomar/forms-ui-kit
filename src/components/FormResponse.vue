<script setup lang="ts">
import UiButton from '@/components/ui-kit/UiButton.vue'

defineEmits(['resetForm'])
interface Props {
  applicationId?: string | number
}

withDefaults(defineProps<Props>(), {
  applicationId: '-'
})
</script>

<template>
  <div class="form-response">
    <h3 class="form-response__title">
      Завка №: {{ applicationId }} принята
    </h3>
    <p class="form-response__text">
      Ответ поступит на email в течении 48 ч.
    </p>
    <UiButton
      class="form-response__button"
      label="Заполнить еще раз"
      style-type="secondary"
      @click="$emit('resetForm')"
    />
  </div>
</template>

<style lang="scss">
.form-response {
  color: $solid-grey-900;

  &__title {
    @include headline-s-mobile;
    margin-bottom: $space-unit-2x;
  }

  &__text {
    margin-bottom: $space-unit-3x;
  }

  &__button {
    width: 100%;
  }

  @media screen and (min-width: 768px) {

    &__text {
      margin-bottom: $space-unit-5x;
    }
  }
}
</style>
