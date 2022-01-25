<template>
  <n-grid :x-gap="12" :y-gap="4" :cols="4">
    <n-grid-item :span="2">
      <div class="header-section">
        TAX SETTINGS
      </div>
    </n-grid-item>
    <n-grid-item :span="2">
      <div class="header-section flex flex-1 flex-row justify-end">
        <search :search-data="[]" :custom-class="''"></search>
        <n-button color="#0aa699" class="ml-4">
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
    <!-- editor modal -->
  </div>
</template>

<script>
import search from "@/components/search";
import {AddSharp} from '@vicons/ionicons5'
import { NTag, NButton, useMessage } from 'naive-ui'
import {h, defineComponent, ref} from 'vue'
import { mapMutations } from 'vuex'
// import {END_POINTS} from '@/shared/constants/endpoints'

export default defineComponent({
  components: {search, AddSharp},
  setup () {
    // const {data} = context.axios.get(END_POINTS.SETTINGS.TAX.GET)
    // console.log(data, context)
    const formRef = ref(null)
    const message = useMessage()
    const createColumns = ({ sendMail }) => {
      return [
        {
          title: 'ID',
          key: 'id'
        },
        {
          title: 'Description',
          key: 'description'
        },
        {
          title: 'Value',
          key: 'value',
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
          render (row) {
            return h('div', {}, [
                h(NButton, {
                    size: 'small',
                    color: '#0aa699',
                    onClick: () => sendMail(row)
                  },
                { default: () => 'Edit' }
                ),
              h(NButton, {
                    size: 'small',
                    class: 'ml-3',
                    color: 'red',
                    onClick: () => sendMail(row)
                },
                { default: () => 'Delete' }
            )])
          }
        }
      ]
    }
    const createData = ref( [
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
    const sendMail = (vla) => {
      console.log(vla)
      message.warning("Please enter required fields")
    }
    return {
      formRef,
      loading: false,
      data: createData,
      columns: createColumns({sendMail}),
      pagination: {
        pageSize: 10
      },
      size: ref('medium'),
      formValue: ref({
        username: '',
        password: ''
      }),
      rules: {
        username: {
          required: true,
          message: 'Username is required',
          trigger: ['blur', 'input']
        },
        password: {
          required: true,
          message: 'Password is required',
          trigger: ['blur', 'input']
        }
      },
      ...mapMutations({
        setSpinner: "spinner/SET_SPINNER_STATUS",
      }),
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