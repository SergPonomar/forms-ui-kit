<script setup lang="ts">
import { reactive } from 'vue'
import { logEvent } from 'histoire/client'
import TextInput from '@/components/form/TextInput.vue'

type Props = InstanceType<typeof TextInput>['$props'];

const storyState = reactive<Props>({
  name: 'field-name',
  formName: 'test-id',
  label: 'Label',
  supportText: 'Enter "text"',
  required: false,
  validationFunc: function (val) {
    return val !== 'text' ? 'Error: this not a "text"' : ''
  }
})

</script>

<template>
  <Story
    title="Components/Form/TextInput"
    auto-props-disabled
  >
    <Variant title="Playground">
      <div class="story-sandbox__container">
        <TextInput
          :name="storyState.name"
          :form-id="storyState.formName"
          :label="storyState.label"
          :support-text="storyState.supportText"
          :required="storyState.required"
          :validation-func="storyState.validationFunc"
          @focus="logEvent('focus', $event)"
          @register="logEvent('register', $event)"
        />
      </div>
      <template #controls>
        <HstText
          v-model="storyState.name"
          title="Field name"
        />
        <HstText
          v-model="storyState.formName"
          title="Form id"
        />
        <HstText
          v-model="storyState.label"
          title="Label"
        />
        <HstText
          v-model="storyState.supportText"
          title="Support text"
        />
        <HstCheckbox
          v-model="storyState.required"
          title="Required"
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
