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
        <n-button color="#0aa699" class="ml-4" @click="showEditorModal = true">
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
          <n-tab-pane name="paid" tab="PAID">
            <n-data-table
                :columns="columns"
                :data="searchResults.length ? searchResults : paidInvoices"
                :pagination="pagination"
                style="min-height: 55vh !important;"
            />
          </n-tab-pane>
          <n-tab-pane name="unpaid" tab="UNPAID">
            <n-data-table
                :columns="columns"
                :data="searchResults.length ? searchResults : unPaidInvoices"
                :pagination="pagination"
                style="min-height: 55vh !important;"
            />
          </n-tab-pane>
          <n-tab-pane name="due" tab="DUE">
            <n-data-table
                :columns="columns"
                :data="searchResults.length ? searchResults : dueInvoices"
                :pagination="pagination"
                style="min-height: 55vh !important;"
            />
          </n-tab-pane>
          <n-tab-pane name="overdue" tab="OVERDUE">
            <n-data-table
                :columns="columns"
                :data="searchResults.length ? searchResults : overDueInvoices"
                :pagination="pagination"
                style="min-height: 55vh !important;"
            />
          </n-tab-pane>
        </n-tabs>
      </div>
    </n-grid-item>
  </n-grid>
  <editor-modal
      v-if="showEditorModal"
      :show-editor-modal="showEditorModal"
      :is-edit-mode="isEditingMode"
      :invoice="selectedInvoice"
      @closeModal="handleEditorModalClose"
      @invoiceAction="handleInvoiceAction"
  />
  <delete-modal
      v-if="showDeleteModal"
      :show-delete-modal="showDeleteModal"
      @closeModal="handleDeleteModalClose"
      @delete="handleInvoiceDelete"
  />
  <view-modal
      v-if="showViewModal"
      :show-view-modal="showViewModal"
      :invoice-id="selectedInvoice.invoice_id"
      @closeModal="showViewModal = false"
      @openEditModal="handleOpenEditModal"
      @openDeleteModal="handleOpenDeleteModal"
  />
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
import EditorModal from "./EditorModal";
import ViewModal from "./ViewModal";
import DeleteModal from "./DeleteModal"

export default defineComponent({
  components: {ViewModal, Search, AddSharp, EditorModal, DeleteModal},
  setup () {
    const message = useMessage()
    const store = useStore()
    const loading = ref(false)
    const isEditingMode = ref(false)
    const showEditorModal = ref(false)
    const showDeleteModal = ref(false)
    const showViewModal = ref(false)
    const selectedInvoice = ref(null)
    const invoices = ref( [])
    const overDueInvoices = ref( [])
    const dueInvoices = ref( [])
    const unPaidInvoices = ref( [])
    const paidInvoices = ref( [])
    const searchResults = ref( [])
    const resetSearch = ref( "")
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
          key: 'items',
          fixed: 'left',
          render (row) {
            return h(
                'div',
                {},
                {
                  default: () => row.items
                }
            )
          }
        },
        {
          title: renderTableTitles('AMOUNT'),
          key: 'amount',
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
                  { default: () => 'Expand View' }
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

    onMounted(async () => {
      store.commit('spinner/SET_SPINNER_STATUS', true)
      try{
        const { data} = await axios.get(apiEndPoints().SALES.INVOICE.GET)
        invoices.value = data.map((item, index) => ({
          ...item,
          invoice_number: item.invoice_number.toUpperCase(),
          date: moment(item.date).format("YYYY-MM-DD"),
          due_date: moment(item.date).format("YYYY-MM-DD"),
          number_of_items: item.items,
          amount: item.total_amount,
          key: index
        }))
        paidInvoices.value = invoices.value.filter(x => x.paid === true)
        unPaidInvoices.value = invoices.value.filter(x => x.paid === false)
        overDueInvoices.value = unPaidInvoices.value.filter(x =>
            moment(x.due_date).format("YYYY-MM-DD") > moment(new Date()).format("YYYY-MM-DD"))
        dueInvoices.value = unPaidInvoices.value.filter(x =>
            moment(x.due_date).format("YYYY-MM-DD") === moment(new Date()).format("YYYY-MM-DD"))
      } catch (e) {
        message.warning(e.response?.data?.detail || "Something went wrong")
      }
      store.commit('spinner/SET_SPINNER_STATUS', false)
    })
    const openInvoiceDetailsModal = async (item) => {
      showViewModal.value = true
      selectedInvoice.value = item
    }
    return {
      loading: false,
      data: invoices,
      unPaidInvoices,
      paidInvoices,
      overDueInvoices,
      dueInvoices,
      searchResults,
      resetSearch,
      showEditorModal,
      selectedInvoice,
      showViewModal,
      showDeleteModal,
      isEditingMode,
      columns: createColumns({openInvoiceDetailsModal}),
      pagination: paginationReactive,
      ...mapMutations({
        setSpinner: "spinner/SET_SPINNER_STATUS",
      }),
      handleSearch(event) {
        resetSearch.value = ""
        searchResults.value = event
      },
      handleEditorModalClose() {
        selectedInvoice.value = null
        showEditorModal.value = false
        isEditingMode.value = false
      },
      handleDeleteModalClose() {
        selectedInvoice.value = null
        showDeleteModal.value = false
      },
      handleInvoiceAction() {
      //
      },
      handleOpenDeleteModal(event) {
        selectedInvoice.value = event.value
        showDeleteModal.value = true
      },
      handleOpenEditModal(event) {
        showEditorModal.value = true
        selectedInvoice.value = {
          ...event.value,
          items: event.value.items.map(itm => {
                const x = {
                  ...itm,
                  item_id: itm.item_id.id,
                  item: {
                    ...itm.item_id,
                    tax: []
                  }
                }
                itm.item_id.tax.forEach((tx, i) => {
                  x.item.tax[i] = {}
                  x.item.tax[i].id = tx.id
                  x.item.tax[i].description = tx.description
                  x.item.tax[i].value = tx.value
                  x.item.tax[i].type = tx.type
                })
            return x
          })}
        isEditingMode.value = true
      },
      async handleInvoiceDelete() {
        store.commit('spinner/SET_SPINNER_STATUS', true)
        loading.value = true
        try {
          await axios.delete(apiEndPoints().SALES.INVOICE.DELETE(selectedInvoice.value.invoice_id))
          paidInvoices.value = invoices.value.filter(item => item.invoice_id !== selectedInvoice.value.invoice_id)
          unPaidInvoices.value = invoices.value.filter(item => item.invoice_id !== selectedInvoice.value.invoice_id)
          dueInvoices.value = invoices.value.filter(item => item.invoice_id !== selectedInvoice.value.invoice_id)
          overDueInvoices.value = invoices.value.filter(item => item.invoice_id !== selectedInvoice.value.invoice_id)
          showDeleteModal.value = false
          selectedInvoice.value = null
          store.commit('spinner/SET_SPINNER_STATUS', false)
          message.success('Invoice was deleted successfully')
          searchResults.value = []
          resetSearch.value = ""
        } catch (e) {
          store.commit('spinner/SET_SPINNER_STATUS', false)
          loading.value = false
          message.warning(e.response?.data?.detail || "Something went wrong")
        }
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