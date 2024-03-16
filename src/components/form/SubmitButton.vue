<script setup lang="ts">
import { useSelector } from '@xstate/vue'
import { inject, computed } from 'vue'
import type { Actor, AnyActorLogic } from 'xstate'
import UiButton from '@/components/ui-kit/UiButton.vue'

interface Props {
  next?: boolean,
}

const props = withDefaults(defineProps<Props>(), {
  next: false
})

const formActor = inject<Actor<AnyActorLogic>>('formActor')
const formState = formActor ? useSelector(formActor, snapshot => snapshot.value) : undefined
const isValid = computed(() => formState && formState.value !== 'error')

const onSubmit = (_e: Event) => {
  if (!formActor) { return }
  if (props.next) {
    formActor.send({ type: 'TRYNEXT' })
  } else {
    formActor.send({ type: 'TRYSUBMIT' })
  }
}
</script>

<template>
  <UiButton
    :state="!isValid? 'disabled' : undefined"
    @click.prevent="onSubmit"
  />
</template>

<style lang="scss">
</style>
