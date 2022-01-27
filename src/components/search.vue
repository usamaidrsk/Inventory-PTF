<template>
  <div>
    <n-input
        v-model:value="searchValue"
        type="text"
        :class="customClass"
        :placeholder="`${'Search for a ' + whichData}`"
        :loading="loading"
        @keyup="handleSearchStop"
        @input="handleSearchInput"
        @blur="handleSearchStop"
    />
  </div>
</template>

<script>
import {ref, defineComponent, toRefs } from "vue";

export default defineComponent({
  emits: ['results'],
  props: {
    customClass: {
      type: String,
      required: true
    },
    whichData: {
      type: String,
      required: true
    },
    searchData: {
      type: Array,
      default: () => ([]),
      required: true
    }
  },
  setup (props, context) {
    const {searchData, whichData } = toRefs(props)
    const loading = ref(false)
    const searchValue = ref('')
    return {
      loading,
      searchValue,
      handleSearchStop() {
        loading.value = false
      },
      handleSearchInput (value) {
        loading.value = true
        if(whichData.value === 'Tax') {
          const results = searchData.value.filter((tax) =>
              tax.description.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
              tax.type.toLowerCase().indexOf(value.toLowerCase()) !== -1
          )
          context.emit('results', results)
        }
      }
    }
  }
})
</script>

<style scoped>

</style>
