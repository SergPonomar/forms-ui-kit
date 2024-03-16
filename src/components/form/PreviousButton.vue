<script setup lang="ts">
import { inject } from 'vue'
import type { Actor, AnyActorLogic } from 'xstate'
import UiButton from '@/components/ui-kit/UiButton.vue'

const formActor = inject<Actor<AnyActorLogic>>('formActor')

const onSubmit = (_e: Event) => {
  if (!formActor) { return }
  formActor.send({ type: 'PREVIOUS' })
}
</script>

<template>
  <UiButton
    style-type="secondary"
    @click.prevent="onSubmit"
  />
</template>

<style lang="scss">
</style>
