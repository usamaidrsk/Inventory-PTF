<template>
  <n-grid :x-gap="12" :y-gap="4" :cols="4">
    <n-grid-item :span="2">
      <div class="header-section pt-4 text-secondary font-bold text-current font-mono text-lg">
        TAX SETTINGS
      </div>
    </n-grid-item>
    <n-grid-item :span="2">
      <div class="header-section flex flex-1 flex-row justify-end">
        <search :search-data="data" :custom-class="''" which-data="Tax" @results="handleSearch"/>
        <n-button color="#0aa699" class="ml-4" @click="showEditorModal = true">
          <template #icon>
            <n-icon>
              <add-sharp />
            </n-icon>
          </template>
          New Tax
        </n-button>
      </div>
    </n-grid-item>
    <n-grid-item :span="4" class="">
      <n-divider />
      <div class="content-section">
        <n-data-table
            :columns="columns"
            :data="searchResults.length ? searchResults : data"
            :pagination="pagination"
        />
      </div>
    </n-grid-item>
  </n-grid>
  <div>
    <n-modal :show="showEditorModal">
      <n-card
          style="width: 40%; height: 80%"
          :bordered="false"
          size="huge"
          role="dialog"
          aria-modal="true"
          :title="`${isEditing ? 'Edit Tax' : 'Add New Tax'}`"
      >
        <n-form
            :label-width="80"
            :model="formValue"
            :rules="rules"
            size="medium"
            ref="formRef"
        >
          <n-form-item label="Tax Name" path="description">
            <n-input
                v-model:value="formValue.description"
                placeholder="Enter Tax name"
                clearable
            />
          </n-form-item>
          <n-form-item path="value" label="Tax Value">
            <n-input-number
                v-model:value="formValue.taxValue"
                :min="1"
                :max="100"
                placeholder="Enter Tax Value"
                clearable
                class="w-full"
            >
              <template #suffix>%</template>
            </n-input-number>
          </n-form-item>
          <n-form-item path="type" label="Tax Type">
            <n-select
                v-model:value="formValue.type"
                filterable
                placeholder="Select Tax Type"
                :options="selectOptions"
                clearable
            />
          </n-form-item>
          <n-form-item>
            <n-row :gutter="[0, 24]">
              <n-col :span="24">
                <div class="flex flex-row justify-end">
                  <n-button @click.prevent="closeEditor()">
                    Cancel
                  </n-button>
                  <n-button
                      :disabled="loading"
                      @click.prevent="saveTax()"
                      type="primary"
                      color="#0aa699"
                      class="ml-3"
                  >
                    Save
                  </n-button>
                </div>
              </n-col>
            </n-row>
          </n-form-item>
        </n-form>
      </n-card>
    </n-modal>
    <n-modal :show="showDeleteModal">
      <n-card
          style="width: 40%; height: 40%"
          :bordered="false"
          size="huge"
          role="dialog"
          aria-modal="true"
          title="Delete Tax"
      >
        <div class="text-md font-semibold text-current font-serif mb-2">
          Are you sure on deleting this Tax ?
        </div>
        <div class="text-sm font-light font-italic mb-6">
          All products that have been implementing this Tax,
          will not be taxed after this action
        </div>
        <n-row :gutter="[0, 24]">
          <n-col :span="24">
            <div class="flex flex-row justify-end">
              <n-button @click.prevent="closeEditor()">
                Cancel
              </n-button>
              <n-button
                  :disabled="loading"
                  @click.prevent="deleteTax()"
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
import search from "@/components/search";
import {AddSharp} from '@vicons/ionicons5'
import { NTag, NButton, useMessage } from 'naive-ui'
import {h, defineComponent, ref, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { mapMutations } from 'vuex'
import axios from '@/plugins/axios'
import {renderTableTitles} from "@/shared/utilz/Index";
import {apiEndPoints} from "@/shared/constants/endPoints/Index";

export default defineComponent({
  components: {search, AddSharp},
  setup () {
    const message = useMessage()
    const store = useStore()
    const formRef = ref(null)
    const initialFormState = {
      description: null,
      taxValue: null,
      type: null
    }
    const formValue = ref(initialFormState)
    const selectedTax = ref(null)
    const isEditing = ref(false)
    const showEditorModal = ref(false)
    const showDeleteModal = ref(false)
    const createColumns = ({ openEditorModal, openDeleteModal }) => {
      return [
        {
          title: renderTableTitles('TAX NAME'),
          key: 'description',
          fixed: 'left',
        },
        {
          title: renderTableTitles('TAX VALUE'),
          key: 'value',
          fixed: 'left',
          render (row) {
            return h(
                'div',
                {},
                {
                  default: () => row.value + '%'
                }
            )
          }
        },
        {
          title: renderTableTitles('PRODUCT PRICE'),
          key: 'type',
          fixed: 'left',
          render (row) {
            return h(
                NTag,
                {
                  type: 'info'
                },
                {
                  default: () => row.type
                }
            )
          }
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
                    onClick: () => openEditorModal(row)
                  },
                  { default: () => 'Edit' }
              ),
              h(NButton, {
                    size: 'small',
                    class: 'ml-3',
                    color: 'red',
                    onClick: () => openDeleteModal(row)
                  },
                  { default: () => 'Delete' }
              )])
          }
        }
      ]
    }
    const paginationReactive = reactive({
      page: 1,
      pageSize: 10,
      showSizePicker: true,
      pageSizes: [5, 10, 15],
      onChange: (page) => {
        paginationReactive.page = page
      },
      onUpdatePageSize: (pageSize) => {
        paginationReactive.pageSize = pageSize
        paginationReactive.page = 1
      }
    })
    const taxItems = ref( [])
    const searchResults = ref( [])

    onMounted(async () => {
      store.commit('spinner/SET_SPINNER_STATUS', false)
      try{
        const { data} = await axios.get(apiEndPoints().SETTINGS.TAX.GET)
        taxItems.value = data.map((item, index) => ({
          type: item.type.toUpperCase(),
          description: item.description.toUpperCase(),
          value: item.value,
          id: item.id,
          key: index
        }))
      } catch (e) {
        message.warning(e.response?.data?.detail || "Something went wrong")
      }
    })
    const openEditorModal = (item) => {
      selectedTax.value = item
      formValue.value = {
        description: item.description,
        taxValue: item.value,
        type: item.type
      }
      showEditorModal.value = true
      isEditing.value = true
    }
    const openDeleteModal = (item) => {
      selectedTax.value = item
      showDeleteModal.value = true
    }
    return {
      formRef,
      loading: false,
      selectOptions: [
        {
          label: "EXCLUSIVE",
          value: 'EXCLUSIVE',
        },
        {
          label: 'INCLUSIVE',
          value: 'INCLUSIVE'
        }],
      data: taxItems,
      searchResults,
      columns: createColumns({openEditorModal,openDeleteModal}),
      pagination: paginationReactive,
      showEditorModal,
      showDeleteModal,
      isEditing,
      formValue,
      size: ref('medium'),
      rules: {
        description: {
          required: true,
          message: 'Tax name is required',
          trigger: ['blur', 'input']
        },
        taxValue: {
          required: true,
          message: 'Tax value is required',
          trigger: ['blur', 'input']
        },
        type: {
          required: true,
          message: 'Tax type is required',
          trigger: ['blur', 'input']
        }
      },
      ...mapMutations({
        setSpinner: "spinner/SET_SPINNER_STATUS",
      }),
      closeEditor() {
        showEditorModal.value = false
        showDeleteModal.value = false
        isEditing.value = false
        selectedTax.value = null
        Object.assign(formValue.value, initialFormState)
      },
      ...mapMutations({
        setSpinner: "spinner/SET_SPINNER_STATUS",
      }),
      handleSearch(event) {
        searchResults.value = event
      },
      async deleteTax() {
        this.setSpinner(true)
        this.loading = true
        try {
          await axios.delete(apiEndPoints().SETTINGS.TAX.DELETE(selectedTax.value.id))
          taxItems.value = taxItems.value.filter(item => item.id !== selectedTax.value.id)
          this.setSpinner(false)
          this.loading = false
          message.success('Tax was deleted successfully')
          this.closeEditor()
        } catch (e) {
          this.setSpinner(false)
          this.loading = false
          message.warning(e.response?.data?.detail || "Something went wrong")
        }
      },
      saveTax() {
        this.formRef.validate(async (errors) => {
          if (!errors) {
            this.setSpinner(true)
            this.loading = true
            const {description, taxValue: value, type} = formValue.value
            try {
              const AXIOS_METHOD = isEditing.value ? 'patch' : 'post'
              const {data} = await this.axios[AXIOS_METHOD](
                  apiEndPoints().SETTINGS.TAX[isEditing.value ? 'UPDATE' : 'CREATE'],
                  {
                    type,
                    description: description.toUpperCase(),
                    value: Number(value),
                    ...isEditing.value ? {id: selectedTax.value.id } : {},
                  })
              if (isEditing.value) {
                taxItems.value = taxItems.value.map((item) => {
                  if (selectedTax.value.id === item.id) return data
                  else return {...item}
                })
              } else taxItems.value = [data, ...taxItems.value]
              this.setSpinner(false)
              this.loading = false
              message.success(`Tax was ${isEditing.value ? 'edited' : 'created'} successfully`)
              this.closeEditor()
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
.header-section {
  height: 2.5em;
  margin: 0 2em;
}
.content-section {
  margin: 0 2em;
  height: 100%;
}
</style>