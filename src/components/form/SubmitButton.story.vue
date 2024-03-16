<script setup lang="ts">
import { reactive } from 'vue'
import { logEvent } from 'histoire/client'
import SubmitButton from '@/components/form/SubmitButton.vue'
import LogMachine from '@/story/LogMachine.vue'

type SubmitButtonProps = InstanceType<typeof SubmitButton>['$props']
type LogMachineProps = InstanceType<typeof LogMachine>['$props']
type Props = SubmitButtonProps & LogMachineProps

const storyState = reactive<Props>({
  next: false,
  state: 'idle'
})

const logMachineStateOptions: { label: string, value: Props['state'] }[] = [
  {
    label: 'Idle',
    value: 'idle'
  },
  {
    label: 'Error',
    value: 'error'
  }
]
</script>

<template>
  <Story
    title="Components/Form/SubmitButton"
    auto-props-disabled
  >
    <Variant title="Playground">
      <div class="story-sandbox__container">
        <LogMachine
          :state="storyState.state"
          @machine-event="logEvent('Machine Event', $event)"
        >
          <SubmitButton
            :next="storyState.next"
            label="Submit"
          />
        </LogMachine>
      </div>
      <template #controls>
        <HstCheckbox
          v-model="storyState.next"
          title="Next step button"
        />
        <HstSelect
          v-model="storyState.state"
          title="FormActor state"
          :options="logMachineStateOptions"
        />
      </template>
    </Variant>
  </Story>
</template>

<style lang="scss" scoped>
.story-sandbox__container {
  width: fit-content;
}
</style>
