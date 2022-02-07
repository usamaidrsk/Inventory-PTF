<template>
  <n-popconfirm @positive-click="emitDeleteItem" negative-text="Cancel">
    <template #trigger>
      <n-button size="small" color="red" class="ml-2">
        Delete
      </n-button>
    </template>
    <span style="width: 30vw">
      Are you sure? After this action, this {{ dataType.toLowerCase() }} won't be available for future products
    </span>
  </n-popconfirm>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  emits: ['confirmDelete'],
  props: {
    dataType: {
      required: true,
      type: String,
      default: 'item'
    }
  },
  setup (_, context) {
    return {
      emitDeleteItem() {
        context.emit("confirmDelete")
      }
    }
  }
})
</script>

<style scoped>

</style>
