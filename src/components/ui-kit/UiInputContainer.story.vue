<script setup lang="ts">
import { reactive } from 'vue'
import UiInputContainer from '@/components/ui-kit/UiInputContainer.vue'

type Props = InstanceType<typeof UiInputContainer>['$props'];

const stateOptions: { label: string, value: Props['state'] }[] = [
  {
    label: 'Default (idle)',
    value: undefined
  },
  {
    label: 'Idle',
    value: 'idle'
  },
  {
    label: 'Editing',
    value: 'editing'
  },
  {
    label: 'Error',
    value: 'error'
  },
  {
    label: 'Disabled',
    value: 'disabled'
  }
]

const storyState = reactive<Props>({
  inputId: 'formId-inputName',
  state: undefined,
  required: false,
  label: 'Label',
  supportText: 'Support text',
  errorText: 'Error text'
})

</script>

<template>
  <Story
    title="Ui kit/UiInputContainer"
    auto-props-disabled
  >
    <Variant title="Playground">
      <div class="story-sandbox__container">
        <UiInputContainer
          :input-id="storyState.inputId"
          :required="storyState.required"
          :state="storyState.state"
          :label="storyState.label"
          :support-text="storyState.supportText"
          :error-text="storyState.errorText"
        >
          <span>Input slot</span>
        </UiInputContainer>
      </div>
      <template #controls>
        <HstText
          v-model="storyState.inputId"
          title="Input id"
        />
        <HstSelect
          v-model="storyState.state"
          title="State"
          :options="stateOptions"
        />
        <HstCheckbox
          v-model="storyState.required"
          title="Required"
        />
        <HstText
          v-model="storyState.label"
          title="Label"
        />
        <HstText
          v-model="storyState.supportText"
          title="Support text"
        />
        <HstText
          v-model="storyState.errorText"
          title="Error text"
        />
      </template>
    </Variant>
  </Story>
</template>

<style lang="scss" scoped>
.story-sandbox__container{
  width: 100%;
  max-width: 327px;
}
</style>
