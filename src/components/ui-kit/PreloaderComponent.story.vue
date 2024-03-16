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

<docs lang="md">
## PreloaderComponent: An ui kit preloader component.

- Can be used as wrapper for other component. Root can be rendered as provided component.
- Display spinner and block interaction by overlay (on loading state).
- Сomponent is made based on the [Design System 1.4.1](https://www.figma.com/community/file/1255349027535859598).

### Component API

#### @Props

| Name     | Description                                                      | Default |
|----------|------------------------------------------------------------------|---------|
| renderAs | Render root element as provided component. `string \| Component` | 'div'   |
| loading  | Activate loading state of component. `boolean`                   | false   |

### Component usage

```vue
<template>
  <PreloaderComponent
    render-as="div"
    :loading="true"
  >
    <span>Input slot</span>
  </PreloaderComponent>
</template>
```
</docs>
