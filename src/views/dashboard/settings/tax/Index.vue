<template>
  <n-grid :x-gap="12" :y-gap="4" :cols="4">
    <n-grid-item :span="2">
      <div class="header-section mt-2 pt-4 font-bold text-secondary">
        TAX SETTINGS
      </div>
    </n-grid-item>
    <n-grid-item :span="2">
      <div class="header-section flex flex-1 flex-row justify-end">
        <search :search-data="[]" :custom-class="''"></search>
        <n-button color="#0aa699" class="ml-4" @click="showModal = true">
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
        <n-data-table :columns="columns" :data="data" :pagination="pagination" />
      </div>
    </n-grid-item>
  </n-grid>
  <div>
    <n-modal v-model:show="showModal">
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
            :size="size"
            ref="formRef"
        >
          <n-form-item label="Description" path="description">
            <n-input
                v-model:value="formValue.description"
                placeholder="Enter Tax description"
                clearable
            />
          </n-form-item>
          <n-form-item path="value" label="Tax Value">
            <n-input-number
                v-model:value="formValue.value"
                placeholder="Enter Tax Value"
                style="width: 100%"
                clearable
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
  </div>
</template>

<script>
import search from "@/components/search";
import {AddSharp} from '@vicons/ionicons5'
import { NTag, NButton, useMessage } from 'naive-ui'
import {h, defineComponent, ref, reactive } from 'vue'
import { mapMutations } from 'vuex'
import {END_POINTS} from '@/shared/constants/endpoints'

export default defineComponent({
  components: {search, AddSharp},
  setup () {
    const message = useMessage()
    const formRef = ref(null)
    const initialFormState = {
      description: '',
      value: 0,
      type: ''
    }
    const formValue = ref(initialFormState)
    const editItem = ref(null)
    const isEditing = ref(false)
    const showModal = ref(false)
    const selectOptions = [
      {
        label: "EXCLUSIVE",
        value: 'EXCLUSIVE',
      },
      {
        label: 'INCLUSIVE',
        value: 'INCLUSIVE'
      }]
    const createColumns = ({ openEditorModal, openDeleteModal }) => {
      return [
        {
          title: 'ID',
          key: 'id',
          fixed: 'left'
        },
        {
          title: 'Description',
          key: 'description',
          fixed: 'left',
        },
        {
          title: 'Value',
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
          title: 'Type',
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
          title: 'Action',
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
    const taxItems = ref( [
      {
        key: 0,
        id: "TAX0001",
        description: 'TRANSPORTATION',
        value: 32,
        type: 'EXCLUSIVE'
      },
      {
        key: 1,
        id: "TAX0002",
        description: 'JIJI',
        value: 12,
        type: 'INCLUSIVE'
      },
      {
        key: 2,
        id: "TAX0003",
        description: 'RENT',
        value: 5,
        type: 'EXCLUSIVE'
      },
      {
        key: 3,
        id: "TAX0004",
        description: 'SALARY',
        value: 7,
        type: 'INCLUSIVE'
      },
    ])
    const openEditorModal = (item) => {
      editItem.value = item
      formValue.value = {
        description: item.description,
        value: Number(item.value),
        type: item.type
      }
      showModal.value = true
      isEditing.value = true
    }
    const openDeleteModal = (item) => {
      message.warning(item.description + "will be deleted")
    }
    const closeEditor = () => {
      formValue.value = initialFormState
      showModal.value = false
      isEditing.value = false
      editItem.value = null
    }
    return {
      formRef,
      loading: false,
      selectOptions,
      data: taxItems,
      columns: createColumns({openEditorModal,openDeleteModal}),
      pagination: paginationReactive,
      showModal,
      isEditing,
      size: ref('medium'),
      formValue,
      rules: {
        description: {
          required: true,
          message: 'Tax description is required',
          trigger: ['blur', 'input']
        },
        value: {
          required: true,
          message: 'Tax value is required',
          trigger: ['input']
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
      closeEditor,
      ...mapMutations({
        setSpinner: "spinner/SET_SPINNER_STATUS",
      }),
      async saveTax() {
        this.formRef.validate(async (errors) => {
          if (!errors) {
            this.setSpinner(true)
            const {description, value, type} = formValue.value
            if (isEditing.value) {
              taxItems.value.map((item) => {
                if (editItem.value.id === item.id) {
                  const {key, id} = editItem.value
                  return {
                    key, id,
                    description: description.toUpperCase(),
                    value, type
                  }
                } else return {...item}
              })
              this.setSpinner(false)
            } else {
              taxItems.value.unshift({
                key: taxItems.value.length + 1,
                id: "TAX0001" + value,
                description: description.toUpperCase(),
                value, type
              })
              try {
                await this.axios.post(
                    END_POINTS.SETTINGS.TAX.CREATE,
                    {
                      type,
                      description: description.toUpperCase(),
                      value: Number(value)
                    })
                this.setSpinner(false)
                message.success(`Tax was ${isEditing.value ? 'edited' : 'created'} successfully`)
                closeEditor()
              } catch (e) {
                this.setSpinner(false)
                this.loading = false
                message.warning(e.response?.data?.detail || "Something went wrong")
              }
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