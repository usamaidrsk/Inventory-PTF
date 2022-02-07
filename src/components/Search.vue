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
import {ref, defineComponent, toRefs, watch } from "vue";

export default defineComponent({
  emits: ['results'],
  props: {
    customClass: {
      type: String,
      required: false
    },
    whichData: {
      type: String,
      required: true
    },
    searchData: {
      default: () => ([]),
      required: true
    },
    resetSearch: {
      default: '',
      required: true
    }
  },
  setup (props, context) {
    const {searchData, whichData, resetSearch } = toRefs(props)
    const loading = ref(false)
    const searchValue = ref('')
    watch(resetSearch, (value) =>  {
      if(value === '') {
        searchValue.value = value
      }
    })
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
        if(whichData.value === 'Product') {
          const results = searchData.value.filter((product) =>
              product.name.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
              product.description.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
              product.sku_id.toLowerCase().indexOf(value.toLowerCase()) !== -1
          )
          context.emit('results', results)
        }
        if(whichData.value === 'Brand' || whichData.value  === 'Category') {
          const results = searchData.value.filter((item) =>
              item.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
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
