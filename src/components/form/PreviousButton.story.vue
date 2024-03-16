<script setup lang="ts">
import { logEvent } from 'histoire/client'
import PreviousButton from '@/components/form/PreviousButton.vue'
import LogMachine from '@/story/LogMachine.vue'
</script>

<template>
  <Story
    title="Components/Form/PreviousButton"
    auto-props-disabled
  >
    <Variant title="Playground">
      <div class="story-sandbox__container">
        <LogMachine
          @machine-event="logEvent('Machine Event', $event)"
        >
          <PreviousButton
            label="Previous step"
          />
        </LogMachine>
      </div>
    </Variant>
  </Story>
</template>

<style lang="scss" scoped>
.story-sandbox__container {
  width: fit-content;
}
</style>
