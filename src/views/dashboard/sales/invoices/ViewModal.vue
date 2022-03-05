<template>
  <div>
    <n-modal :show="showViewModal">
      <n-card
          style="width: 65%; height: 90%"
          :bordered="false"
          size="huge"
          role="dialog"
          aria-modal="true"
      >
        <div v-if="invoice.invoice_number">
          <div class="flex flex-row justify-end align-center">
            <div class="flex flex-row align-center">
              <n-dropdown :options="options" @select="handleOptionSelect">
                <n-icon
                    :size="30"
                    color="#0aa699"
                    :component="OverflowMenuHorizontal"
                />
              </n-dropdown>
              <n-button
                  color="#0aa699"
                  @click="closeModal()"
                  class="ml-2"
                  size="small"
              >Close</n-button>
            </div>
          </div>
          <div :id="invoice.invoice_number" class="px-4">
            <div class="text-current font-mono text-lg font-semibold flex align-center">
              {{invoice.invoice_number}}
            </div>
            <n-divider/>
            <div style="font-size: .9em;">
              Customer: <strong>{{invoice.customer ? invoice.customer.toUpperCase() : "No customer was provided"}}</strong><br/>
              Date: <strong>{{invoice.date}}</strong><br/>
              Paid: <strong>{{invoice.paid ? "Paid" : "Not Paid"}}</strong><br/>
              Due Date: <strong>{{invoice.due_date}}</strong><br/>
            </div>
            <n-divider/>
            <div>
              <div class="my-3 text-current font-mono text-lg font-semibold text-center">Items Sold</div>
              <n-divider/>
              <div>
                <div
                    class="grid grid-cols-6 p-2 text-center"
                    v-for="(item, i) in invoice.items"
                    :style="{backgroundColor: i%2 === 1 ? '#e6d4d3': 'white'}"
                    :key="i"
                >
                  <div>
                    <div v-if="i === 0" class="text-current font-mono text-md font-semibold">Item</div>
                    <div class="">{{item.item_id.name}}</div>
                  </div>
                  <div>
                    <div v-if="i === 0" class="text-current font-mono text-md font-semibold">Description</div>
                    <div
                        class=" text-slate-500 font-thin text-ellipsis"
                        style="font-size: .8em;"
                    >
                      {{ item.item_id.description || '############' }}
                    </div>
                  </div>
                  <div>
                    <div v-if="i === 0" class="text-current font-mono text-md font-semibold">Unit Price</div>
                    <div class="">{{currencyValue(item.unit_price)}}</div>
                  </div>
                  <div>
                    <div v-if="i === 0" class="text-current font-mono text-md font-semibold">Units</div>
                    <div class="">{{item.units}}</div>
                  </div>
                  <div>
                    <div v-if="i === 0" class="text-current font-mono text-md font-semibold">Discount %</div>
                    <div class="">{{item.discount}}</div>
                  </div>
                  <div>
                    <div v-if="i === 0" class="text-current font-mono text-md font-semibold text-center">Sub-totals</div>
                    <div
                        class="flex flex-col text-slate-500 font-thin text-ellipsis"
                        style="font-size: .8em; font-weight: 800; text-align: center"
                    >
                      Tax: {{currencyValue(item.exclusiveTaxVal)}} <br/>
                      Profit: {{currencyValue(item.profit)}} <br/>
                      Amount: {{currencyValue(item.subtotal)}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <n-divider/>
            <div class="flex flex-row justify-center mt-4">
              <div>
                <div style="font-weight: 800; font-size: 1.4em">Invoice Summary</div>
                <div style="font-size: .9em; text-align: center; margin-bottom: 2em">
                  No. Items: <strong>{{invoice.items.length}}</strong><br/>
                  Discounts: <strong>{{currencyValue(invoice.totalDiscounts)}}</strong> <br/>
                  Tax Value: <strong>{{currencyValue(invoice.totalTaxValue)}}</strong><br/>
                  Profit Value: <strong>{{currencyValue(invoice.totalProfits)}}</strong><br/>
                  Total Amount: <strong>{{currencyValue(invoice.total_amount)}}</strong><br/>
                  Amount Paid: <strong>{{currencyValue(invoice.amount_paid)}}</strong> <br/>
                  Balance: <strong>{{currencyValue(invoice.balance)}}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </n-card>
    </n-modal>
  </div>
</template>
<script>
import { ref, defineComponent, onMounted, toRefs } from "vue";
import {apiEndPoints} from "@/shared/constants/endPoints/Index";
import axios from '@/plugins/axios'
import {useMessage} from "naive-ui";
import {Pencil} from '@vicons/ionicons5'
import {DocumentPdf, Delete, OverflowMenuHorizontal} from '@vicons/carbon'
// import {FileExcel} from '@vicons/fa'
import {useStore} from "vuex"
import {renderIcon, currencyValue, printPDF} from "@/shared/utilz/Index";

export default defineComponent({
  emits: ['openEditModal', 'closeModal', 'openDeleteModal'],
  props: {
    showViewModal: {
      type: Boolean,
      required: true,
      default: false
    },
    invoiceId: {
      type: Number,
      required: true,
      default: null,
    },
  },
  setup (props, context) {
    const stateProps = toRefs(props)
    const message = useMessage()
    const store = useStore()
    const invoice = ref({
      amount_paid: null,
      balance: null,
      customer: null,
      date: null,
      due_date: null,
      invoice_id: null,
      invoice_number: null,
      item_total: null,
      items: [{
        discount: null,
        id: null,
        invoice: {},
        item_id: {
          brand: null,
          buying_price: null,
          category: null,
          description: null,
          id: null,
          minimum_price: null,
          name: null,
          selling_price: null,
          sku_id: null,
          stock_level: 99,
          stock_threshold: null,
          tax: []
        },
        profit: null,
        subtotal: null,
        tax_revenue: [],
        unit_price: null,
        units: null
      }],
      paid: null,
      total_amount: null
    })
    const loading = ref(false)

    onMounted( async () => {
      try{
        store.commit('spinner/SET_SPINNER_STATUS', true)
        const { data} = await axios.get(apiEndPoints().SALES.INVOICE.GET_ONE(stateProps.invoiceId.value))
        invoice.value = data
        invoice.value.totalDiscounts = 0
        invoice.value.totalTaxValue = 0
        invoice.value.totalProfits = 0
        invoice.value.items.forEach(item => {
          item.exclusiveTaxVal = 0
          invoice.value.totalProfits += item.profit
          invoice.value.totalDiscounts += (item.discount * item.unit_price)/ 100
          item.tax_revenue.forEach(tax => {
            if(tax.type.toLowerCase() === "exclusive") {
              item.exclusiveTaxVal += tax.amount
            }
          })
          invoice.value.totalTaxValue  += item.exclusiveTaxVal
        })
        store.commit('spinner/SET_SPINNER_STATUS', false)
      } catch (e) {
        store.commit('spinner/SET_SPINNER_STATUS', false)
        message.warning(e.response?.data?.detail || "Something went wrong")
      }
    })

    const closeModal = () => {
      context.emit('closeModal')
    }

    return {
      options: [
        {
          label: 'Edit',
          key: 'edit',
          icon: renderIcon(Pencil)
        },
        {
          label: 'PDF',
          key: 'pdf',
          icon: renderIcon(DocumentPdf)
        },
        {
          label: 'Delete',
          key: 'delete',
          icon: renderIcon(Delete)
        }
      ],
      loading,
      invoice,
      closeModal,
      async handleOptionSelect(key) {
        if(key === "edit") {
          delete invoice.value.totalDiscounts
          delete invoice.value.totalTaxValue
          delete invoice.value.totalProfits
          invoice.value.items.forEach(item => {
            delete item.invoice
          })
          context.emit('openEditModal', invoice.value)
          closeModal()
        } else if(key === "delete") {
          closeModal()
          context.emit('openDeleteModal', invoice.value)
        } else if(key === "pdf") {
          store.commit('spinner/SET_SPINNER_STATUS', true)
          await printPDF(
              document.getElementById(invoice.value.invoice_number),
              invoice.value.invoice_number
          )
          store.commit('spinner/SET_SPINNER_STATUS', false)
        }
      },
      OverflowMenuHorizontal,
      currencyValue
    }
  }
})
</script>
<style scoped>
</style>