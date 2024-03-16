<script setup lang="ts">
import { reactive } from 'vue'
import PreloaderComponent from '@/components/ui-kit/PreloaderComponent.vue'

type Props = InstanceType<typeof PreloaderComponent>['$props'];

const storyState = reactive<Props>({
  renderAs: 'div',
  loading: true
})

</script>

<template>
  <Story
    title="Ui kit/PreloaderComponent"
    auto-props-disabled
  >
    <Variant title="Playground">
      <div class="story-sandbox__container">
        <PreloaderComponent
          :render-as="storyState.renderAs"
          :loading="storyState.loading"
        >
          <span>Input slot</span>
        </PreloaderComponent>
      </div>
      <template #controls>
        <HstText
          v-model="storyState.renderAs"
          title="Render root as"
        />
        <HstCheckbox
          v-model="storyState.loading"
          title="Loading"
        />
      </template>
    </Variant>
  </Story>
</template>

<style lang="scss" scoped>
.story-sandbox__container {
  width: 100%;
  max-width: 327px;
}
</style>
