<script setup lang="ts">
import { inject } from 'vue'

const emit = defineEmits(['injected'])
interface Props {
  injection: string
}
const props = defineProps<Props>()
const injected = inject(props.injection)
emit('injected', injected)
</script>
