import { defineConfig } from 'histoire'
import { HstVue } from '@histoire/plugin-vue'

export default defineConfig({
  plugins: [
    HstVue()
  ],
  setupFile: './src/story/histoire.setup.ts',
  theme: {
    title: 'Form UI kit'
  }
})
