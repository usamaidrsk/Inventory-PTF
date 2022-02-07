<template>
  <div>
    <n-modal :show="showDeleteModal">
      <n-card
          style="width: 40%; height: 40%"
          :bordered="false"
          size="huge"
          role="dialog"
          aria-modal="true"
          title="Delete Product"
      >
        <div class="text-md font-semibold text-current font-serif mb-2">
          Are you sure on deleting this Product ?
        </div>
        <div class="text-sm font-light font-italic mb-6">
          This Products will be permanently delete, and all transactions
          will not be tracked after this action
        </div>
        <n-row :gutter="[0, 24]">
          <n-col :span="24">
            <div class="flex flex-row justify-end">
              <n-button @click.prevent="closeModal()">
                Cancel
              </n-button>
              <n-button
                  :disabled="loading"
                  @click.prevent="emitDelete()"
                  type="primary"
                  color="red"
                  class="ml-3"
              >
                Delete
              </n-button>
            </div>
          </n-col>
        </n-row>
      </n-card>
    </n-modal>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  emits: ['delete', 'closeModal'],
  props: {
    showDeleteModal: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  setup (props, context) {
    return {
      emitDelete() {
        context.emit('delete')
      },
      closeModal() {
        context.emit('closeModal')
      }
    }
  }
})
</script>

<style scoped>

</style>
