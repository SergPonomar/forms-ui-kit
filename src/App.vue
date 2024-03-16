<script setup lang="ts">
import { ref } from 'vue'
import DemoForm from '@/components/DemoForm.vue'
import FormResponse from '@/components/FormResponse.vue'

interface Payload {
  data: { applicationId: number }
}

const onDone = (payload: Payload) => {
  done.value = true
  applicationId.value = payload.data.applicationId
}
const done = ref(false)
const applicationId = ref<string | number>()

const onResetForm = () => {
  done.value = false
  applicationId.value = undefined
}
</script>

<template>
  <div class="popup-component">
    <div class="popup-component__content">
      <DemoForm
        v-if="!done"
        @done="onDone"
      />
      <FormResponse
        v-else
        :application-id="applicationId"
        @reset-form="onResetForm"
      />
    </div>
  </div>
</template>

<style lang="scss">
.popup-component {
  background: #999999;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  &__content {
    position: absolute;
    top: min(25%, 100px);
    left: 50%;
    min-width: 272px;
    max-width: calc(352px + 2*16px);
    width: calc(100% - 48px);
    background: white;
    border-radius: 12px;
    transform: translateX(-50%);
    padding: $space-unit-2x;
  }

  @media screen and (min-width: 768px) {

    &__content {
      top: 50%;
      transform: translate(-50%, -50%);
      width: 496px;
      max-width: unset;
      padding: $space-unit-5x $space-unit-7x;
    }
  }
}
</style>
