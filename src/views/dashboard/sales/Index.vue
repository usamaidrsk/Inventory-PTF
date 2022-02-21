<template>
  <n-grid :x-gap="12" :y-gap="0" :cols="4" class="pt-0">
    <n-grid-item :span="2" class="my-0">
      <div class="header-section pt-2 text-secondary font-bold text-current font-mono text-lg">
          MANAGE INVOICES
      </div>
    </n-grid-item>
    <n-grid-item :span="2">
      <div class="header-section flex flex-1 flex-row justify-end">
        <search :search-data="data" :reset-search="resetSearch" which-data="Invoice" @results="handleSearch"/>
        <n-button color="#0aa699" class="ml-4">
          <template #icon>
            <n-icon>
              <add-sharp />
            </n-icon>
          </template>
          New Invoice
        </n-button>
      </div>
    </n-grid-item>
    <n-grid-item :span="4" class="pt-0 mt-0">
      <n-divider />
      <div class="content-section mt-0">
        <n-tabs type="line" class="mt-0 pt-0">
          <n-tab-pane name="overdue" tab="OVERDUE">
            <n-data-table
                :columns="columns"
                :data="searchResults.length ? searchResults : data"
                :pagination="pagination"
                style="min-height: 50vh !important;"
            />
          </n-tab-pane>
          <n-tab-pane name="due" tab="DUE">
            <n-data-table
                :columns="columns"
                :data="searchResults.length ? searchResults : data"
                :pagination="pagination"
                style="min-height: 50vh !important;"
            />
          </n-tab-pane>
          <n-tab-pane name="unpaid" tab="UNPAID">
            <n-data-table
                :columns="columns"
                :data="searchResults.length ? searchResults : data"
                :pagination="pagination"
                style="min-height: 50vh !important;"
            />
          </n-tab-pane>
          <n-tab-pane name="Drafts" tab="DRAFTS">
            <n-data-table
                :columns="columns"
                :data="searchResults.length ? searchResults : data"
                :pagination="pagination"
                style="min-height: 50vh !important;"
            />
          </n-tab-pane>
          <n-tab-pane name="overpaid" tab="OVERPAID">
            <n-data-table
                :columns="columns"
                :data="searchResults.length ? searchResults : data"
                :pagination="pagination"
                style="min-height: 50vh !important;"
            />
          </n-tab-pane>
        </n-tabs>
      </div>
    </n-grid-item>
  </n-grid>
</template>

<script>
import Search from "@/components/Search";
import {AddSharp} from '@vicons/ionicons5'
import { NButton, useMessage } from 'naive-ui'
import {h, defineComponent, ref, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { mapMutations } from 'vuex'
import axios from '@/plugins/axios'
import {renderTableTitles, currencyValue} from "@/shared/utilz/Index";
import {apiEndPoints} from "@/shared/constants/endPoints/Index";
import moment from 'moment';

export default defineComponent({
  components: {Search, AddSharp},
  setup () {
    const message = useMessage()
    const store = useStore()
    const createColumns = ({openInvoiceDetailsModal}) => {
      return [
        {
          title: renderTableTitles('INVOICE No'),
          key: 'invoice_number',
          fixed: 'left',
          render (row) {
            return h(
                'div',
                {},
                {
                  default: () => row.invoice_number
                }
            )
          }
        },
        {
          title: renderTableTitles('DATE'),
          key: 'value',
          fixed: 'left',
          render (row) {
            return h(
                'div',
                {},
                {
                  default: () => row.date
                }
            )
          }
        },
        {
          title: renderTableTitles('No OF ITEMS'),
          key: 'type',
          fixed: 'left',
          render (row) {
            return h(
                'div',
                {},
                {
                  default: () => row.number_of_items
                }
            )
          }
        },
        {
          title: renderTableTitles('AMOUNT'),
          key: 'type',
          fixed: 'left',
          render (row) {
            return h(
                'div',
                {},
                {
                  default: () => currencyValue(row.amount)
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
                    onClick: () => openInvoiceDetailsModal(row)
                  },
                  { default: () => 'Details' }
              )
            ]
            )
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
    const invoices = ref( [])
    const searchResults = ref( [])
    const resetSearch = ref( null)

    onMounted(async () => {
      store.commit('spinner/SET_SPINNER_STATUS', true)
      try{
        const { data} = await axios.get(apiEndPoints().SALES.INVOICE.GET)
        invoices.value = data.map((item, index) => ({
          invoice_number: item.invoice_id,
          date: moment(item.date).format("YYYY-MM-DD"),
          number_of_items: item.items,
          amount: item.amount || 1000,
          key: index
        }))
      } catch (e) {
        message.warning(e.response?.data?.detail || "Something went wrong")
      }
      store.commit('spinner/SET_SPINNER_STATUS', false)
    })
    const openInvoiceDetailsModal = async (item) => {
      store.commit('spinner/SET_SPINNER_STATUS', true)
      try{
        const { data} = await axios.get(apiEndPoints().SALES.INVOICE.GET_ONE(item.invoice_number))
        console.log(data)
      } catch (e) {
        message.warning(e.response?.data?.detail || "Something went wrong")
      }
      store.commit('spinner/SET_SPINNER_STATUS', false)
    }
    return {
      loading: false,
      data: invoices,
      searchResults,
      resetSearch,
      columns: createColumns({openInvoiceDetailsModal}),
      pagination: paginationReactive,
      ...mapMutations({
        setSpinner: "spinner/SET_SPINNER_STATUS",
      }),
      ...mapMutations({
        setSpinner: "spinner/SET_SPINNER_STATUS",
      }),
      handleSearch(event) {
        resetSearch.value = null
        searchResults.value = event
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