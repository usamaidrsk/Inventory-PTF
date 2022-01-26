<template>
  <div>
    <n-input v-model:value="searchValue" type="text" placeholder="Search" :loading="loading" />
  </div>
</template>

<script>
import {ref, defineComponent} from "vue";

export default defineComponent({
  props: {
    customClass: {
      type: String,
      required: true
    },
    searchData: {
      type: Object,
      default: () => ({}),
      required: true
    }
  },
  setup (props) {
    const data = ref(props.searchData)
    const customClasses = ref(props.customClass)
    const loading = ref(false)
    const searchValue = ref('')
    return {
      data,
      customClasses,
      loading,
      searchValue
    }
  }
})
</script>

<style scoped>

</style>
