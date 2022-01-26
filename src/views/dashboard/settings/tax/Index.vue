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
          title="Add New Tax"
      >
        <n-form
            :label-width="80"
            :model="formValue"
            :rules="rules"
            :size="size"
            ref="formRef"
        >
          <n-form-item label="Description" path="description">
            <n-input v-model:value="formValue.description" placeholder="Enter description"/>
          </n-form-item>
          <n-form-item path="value" label="Tax Value">
            <n-input
                v-model:value="formValue.value"
                type="number"
                placeholder="Enter value"
            />
          </n-form-item>
          <n-form-item path="type" label="Tax Type">
            <n-select
                v-model:value="formValue.type"
                filterable
                placeholder="Select TAX TYPE"
                :options="selectOptions"
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
import {h, defineComponent, ref, reactive} from 'vue'
import { mapMutations } from 'vuex'
// import {END_POINTS} from '@/shared/constants/endpoints'

export default defineComponent({
  components: {search, AddSharp},
  setup () {
    // const {data} = context.axios.get(END_POINTS.SETTINGS.TAX.GET)
    // console.log(context)
    const formRef = ref(null)
    const initialFormState = {
      description: '',
      value: '',
      type: ''
    }
    const formValue = ref(initialFormState)
    const showModal = ref(false)
    const message = useMessage()
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
    const openEditorModal = (vla) => {
      console.log(vla)
      message.warning("This opens the editor modal")
    }
    const openDeleteModal = (vla) => {
      console.log(vla)
      message.warning("This opens the delete modal")
    }
    const closeEditor = () => {
      Object.assign(formValue.value, initialFormState)
      showModal.value = false
    }
    return {
      formRef,
      loading: false,
      selectOptions,
      data: taxItems,
      columns: createColumns({openEditorModal,openDeleteModal}),
      pagination: paginationReactive,
      showModal,
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
        Object.assign(formValue, initialFormState)
        showModal.value = false
      },
      saveTax() {
        taxItems.value.unshift({
          key: taxItems.value.length + 1,
          id: "TAX0001" + formValue.value.value,
          description: formValue.value.description,
          value: formValue.value.value,
          type: formValue.value.type
        })
        message.success('Tax was created successfully')
        closeEditor()
      },
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