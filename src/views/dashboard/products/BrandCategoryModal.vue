<template>
  <div>
    <n-modal :show="showModal">
      <n-card
          style="width: 50%; min-height: 90%;"
          :bordered="false"
          size="huge"
          role="dialog"
          aria-modal="true"
          :title="title"
      >
        <n-grid :x-gap="12" :y-gap="2" :cols="1" >
          <n-grid-item v-if="items.length">
            <div class="h-96">
              <n-data-table
                  :columns="columns"
                  :data="searchResults.length ? searchResults : data"
                  :pagination="pagination"
                  style="min-height: 40% !important;"
                  class="h-full"
              />
            </div>
          </n-grid-item>
          <n-grid-item v-else>
            <div class="h-96 text-lg font-semibold text-center py-auto" style="color: #0aa699">
              There are no {{ dataType === "Brand" ? "brands" : 'categories' }} created
            </div>
          </n-grid-item>
          <n-grid-item>
            <n-form
                :label-width="80"
                :model="formValue"
                :rules="rules"
                size="medium"
                ref="formRef"
            >
              <n-grid :x-gap="12" :y-gap="2" :cols="4">
                <n-grid-item :span="3">
                  <n-form-item :span="12" :label="`${dataType} Name`" path="name">
                    <n-input :placeholder="`Enter ${dataType} Name`"   v-model:value="formValue.name"/>
                  </n-form-item>
                </n-grid-item>
                <n-grid-item>
                  <n-form-item :span="12">
                    <n-button
                        :disabled="loading"
                        type="primary"
                        color="#0aa699"
                        class="ml-3"
                        @click="saveItem()"
                    >
                      <template #icon v-if="!isEditing">
                        <n-icon>
                          <add-sharp />
                        </n-icon>
                      </template>
                      <template #icon v-else>
                        <n-icon>
                          <save-outline />
                        </n-icon>
                      </template>
                      {{ isEditing ? "Save" : "Create"}}
                    </n-button>
                  </n-form-item>
                </n-grid-item>
              </n-grid>
            </n-form>
          </n-grid-item>
        </n-grid>
      </n-card>
    </n-modal>
  </div>
</template>
<script>
import {h, ref, defineComponent, onMounted, computed, reactive, toRefs } from "vue";
import {mapMutations, useStore} from "vuex";
import {apiEndPoints} from "@/shared/constants/endPoints/Index";
import axios from '@/plugins/axios'
import {NButton, useMessage} from "naive-ui";
import Search from "@/components/Search";
import {AddSharp, SaveOutline} from "@vicons/ionicons5";
import {renderTableTitles} from "@/shared/utilz/Index";
import DeletePopConfirm from "./DeletePopConfirm"

export default defineComponent({
  components: {AddSharp, SaveOutline},
  emits: ['closeModal'],
  props: {
    showModal: {
      type: Boolean,
      required: true,
      default: false
    },
    dataType: {
      type: String,
      required: true,
      default: ''
    }
  },
  setup (props, context) {
    const {dataType} = toRefs(props)
    const message = useMessage()
    const store = useStore()
    const formRef = ref(null)
    const loading = ref(false)
    const items = ref([])
    const searchResults = ref( [])
    const resetSearch = ref(null)
    const isEditing = ref(false)
    const selectedItem = ref(null)
    const initialFormState = { name: null }
    const formValue = ref(initialFormState)
    const createColumns = ({ activateEdit, deleteItem, dataType }) => {
      return [
        {
          title: renderTableTitles(`${dataType.toUpperCase()} NAME`),
          key: 'name',
          fixed: 'left',
        },
        {
          title: renderTableTitles('ACTIONS'),
          key: 'actions',
          fixed: 'left',
          render (row) {
            return h('div', {}, [
              h(NButton, {
                    size: 'small',
                    color: '#0aa699',
                    onClick: () => activateEdit(row)
                  },
                  { default: () => 'Edit' }
              ),
              h(DeletePopConfirm, { dataType: dataType, onConfirmDelete() { return deleteItem(row) } })
            ])
          }
        }
      ]
    }
    const paginationReactive = reactive({
      page: 1,
      pageSize: 5,
      showSizePicker: false,
      pageSizes: [5],
      onChange: (page) => {
        paginationReactive.page = page
      },
      onUpdatePageSize: (pageSize) => {
        paginationReactive.pageSize = pageSize
        paginationReactive.page = 1
      }
    })

    const clearForm = () => {
      formValue.value.name = null
    }
    const fetchItems = async () => {
      try{
        const { data} = await axios.get(apiEndPoints().PRODUCTS[dataType.value.toUpperCase()].GET)
        items.value = data.map((v) => ({
          name: v.name.toUpperCase(),
          id: v.id
        }))
      } catch (e) {
        message.warning(e.response?.data?.detail || "Something went wrong")
      }
    }
    const closeModal = () => {
      isEditing.value = false
      selectedItem.value = null
      formValue.value.name = null
      items.value = []
      context.emit('closeModal')
    }

    const activateEdit = (item) => {
      selectedItem.value = item
      formValue.value.name = String(item.name)
      isEditing.value = true
    }
    const deleteItem = async (item) => {
      store.commit('spinner/SET_SPINNER_STATUS', true)
      loading.value = true
      try {
        await axios.delete(apiEndPoints().PRODUCTS[dataType.value.toUpperCase()].DELETE(item.id))
        items.value = items.value.filter(itm => itm.id !== item.id)
        store.commit('spinner/SET_SPINNER_STATUS', false)
        loading.value = false
        message.success(`${dataType.value} was deleted successfully`)
        searchResults.value = []
        resetSearch.value = ''
      } catch (e) {
        store.commit('spinner/SET_SPINNER_STATUS', false)
        loading.value = false
        message.warning(e.response?.data?.detail || "Something went wrong")
      }
    }
    const handleSearch = (event) => {
      resetSearch.value = null
      searchResults.value = event
    }
    const renderCardTitle = ({ handleSearch, closeModal, dataType }) => {
      return h('div', {}, [
        h('div', {class: "flex flex-row"}, [
          h('h1',{class: "flex-none font-semibold"},
              `Product ${dataType === "Brand" ? "Brands" : 'Categories'}`),
          h('div', {class: "justify-self-end ml-auto flex flex-row ml-10"}, [
              h(Search, { searchData: items, resetSearch: resetSearch, whichData: dataType, onResults (event) { return handleSearch(event) }}, ''),
              h(NButton, {class: "ml-2", onClick: () => closeModal()}, {default: () => 'Close'})
          ])
        ])
      ])
    }
    const title = computed(() => {
      return renderCardTitle({ handleSearch, closeModal, dataType: dataType.value })
    })
    onMounted( async () => {
      await fetchItems()
    })
    return {
      formRef,
      formValue,
      items,
      isEditing,
      loading,
      data: items,
      pagination: paginationReactive,
      searchResults,
      columns: createColumns({activateEdit,deleteItem, dataType: dataType.value }),
      size: ref('medium'),
      rules: {
        name: {
          required: true,
          message: `${dataType.value} name is required`,
          trigger: ['blur', 'input']
        }
      },
      title,
      ...mapMutations({
        setSpinner: "spinner/SET_SPINNER_STATUS",
      }),
      saveItem() {
        this.formRef.validate(async (errors) => {
          if (!errors) {
            this.setSpinner(true)
            this.loading = true
            try {
              const AXIOS_METHOD = isEditing.value ? 'patch' : 'post'
              const {data} = await this.axios[AXIOS_METHOD](
                  apiEndPoints().PRODUCTS[dataType.value.toUpperCase()][isEditing.value ? 'UPDATE' : 'CREATE'], {
                    name: formValue.value.name.toUpperCase(),
                    ...isEditing.value ? {id: selectedItem.value.id} : {}
                  })
              if (isEditing.value) {
                items.value = items.value.map((item) => {
                  if (selectedItem.value.id === item.id) return data
                  else return {...item}
                })
              } else items.value = [data, ...items.value]
              this.setSpinner(false)
              this.loading = false
              clearForm()
              selectedItem.value = null
              message.success(`${dataType.value} was ${ isEditing.value ? 'edited' : 'created'} successfully`)
              isEditing.value = false
              searchResults.value = []
              resetSearch.value = ''
            } catch (e) {
              this.setSpinner(false)
              this.loading = false
              message.warning(e.response?.data?.detail || "Something went wrong")
            }
          } else {
            message.warning("Please enter required fields")
          }
        })
      }
    }
  }
})
</script>

<style scoped>

</style>
