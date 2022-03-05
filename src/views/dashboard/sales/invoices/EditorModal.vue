<template>
  <div>
    <n-modal :show="showEditorModal">
      <n-card
          style="width: 85%; height: 90%"
          :bordered="false"
          size="huge"
          role="dialog"
          aria-modal="true"
          :title="title"
      >
        <n-form
            :label-width="80"
            :model="formValue"
            :rules="rules"
            size="medium"
            ref="formRef"
        >
          <n-grid :x-gap="12" :y-gap="2" :cols="12">
            <n-grid-item :span="4">
              <n-form-item :span="12" label="Client Name" path="customer">
                <n-input
                    v-model:value="formValue.customer"
                    placeholder="Clients Name or Phone Number"
                    type="text"
                />
              </n-form-item>
            </n-grid-item>
            <n-grid-item :span="8">
              <div  class="flex flex-row justify-between">
                <n-form-item :span="12" label="Date" path="date">
                  <n-date-picker
                      v-model:value="formValue.date"
                      :default-value="Date.now()"
                      type="date"
                      clearable
                      placeholder="Enter date"
                      @update:value="handleAnyFormUpdates()"
                  />
                </n-form-item>
                <n-form-item :span="12" label="Status" path="paid">
                  <n-checkbox :checked="formValue.paid">
                    Fully Paid
                  </n-checkbox>
                </n-form-item>
                <n-form-item :span="12" label="Due Date" path="due_date">
                  <n-date-picker
                      v-model:value="formValue.due_date"
                      :default-value="formValue.date"
                      placeholder="Ender due date"
                      type="date"
                      clearable
                      :disabled="formValue.paid"
                      :is-date-disabled="dueDateDisabled"
                      @update:value="handleAnyFormUpdates()"
                  />
                </n-form-item>
              </div>
            </n-grid-item>
            <n-grid-item :span="12">
              <n-card
                  :bordered="true"
                  size="huge"
                  role="dialog"
                  class="mb-4"
                  aria-modal="true"
                  title="Items List"
              >
                <n-dynamic-input
                    v-model:value="formValue.items"
                    @create="onCreate"
                    @update:value="handleAnyFormUpdates()"
                    show-sort-button
                    #="{ index, value }"
                >
                  <n-grid :x-gap="12" :y-gap="2" :cols="12">
                    <n-grid-item :span="3">
                      <n-form-item
                          :span="12"
                          label="Item"
                          :path="`items[${index}].item_id`"
                          :rule="itemIdRule"
                      >
                        <n-select
                            v-model:value="formValue.items[index].item_id"
                            placeholder="Search Item"
                            filterable
                            :options="productOptions"
                            remote
                            :clear-filter-after-select="false"
                            @search="handleItemSearch"
                            :render-label="renderProductLabel"
                            :render-tag="renderProductTag"
                            @update:value="setProductItem(value, index)"
                        >
                          <template #action>
                            <n-button color="#0aa699" class="mx-auto" size="tiny" @click="openCreateProductModal(index)">
                              Create Product
                            </n-button>
                          </template>
                        </n-select>
                      </n-form-item>
                    </n-grid-item>
                    <n-grid-item :span="2">
                      <div>Description</div>
                      <div class="text-slate-500 font-thin text-ellipsis" style="font-size: .7em;">
                        {{ formValue.items[index].item.description || '############' }}
                      </div>
                    </n-grid-item>
                    <n-grid-item :span="2">
                      <n-form-item
                          :path="`items[${index}].unit_price`"
                          label="Unit Price"
                          :rule="unitPriceRule"
                      >
                        <n-input-number
                            v-model:value="formValue.items[index].unit_price"
                            :min="formValue.items[index].minimum_price || 500"
                            placeholder="Unit Price"
                            class="w-full"
                            :show-button="false"
                            @update:value="handleAnyFormUpdates()"
                        >
                          <template #suffix>UGX</template>
                        </n-input-number>
                      </n-form-item>
                    </n-grid-item>
                    <n-grid-item :span="2">
                      <n-form-item
                          :path="`items[${index}].units`"
                          label="Units"
                          :rule="unitsRule"
                      >
                        <n-input-number
                            v-model:value="formValue.items[index].units"
                            :min="1"
                            :max="formValue.items[index].item.stock_level"
                            placeholder="Units"
                            class="w-full"
                            :show-button="false"
                            @update:value="handleAnyFormUpdates()"
                        >
                        </n-input-number>
                      </n-form-item>
                    </n-grid-item>
                    <n-grid-item :span="1">
                      <n-form-item
                          :path="`items[${index}].discount`"
                          label="Discount"
                      >
                        <n-input-number
                            v-model:value="formValue.items[index].discount"
                            :min="0"
                            :max="100"
                            placeholder="Discount"
                            class="w-full"
                            :show-button="false"
                            @update:value="handleAnyFormUpdates()"
                        >
                          <template #suffix>%</template>
                        </n-input-number>
                      </n-form-item>
                    </n-grid-item>
                    <n-grid-item :span="2">
                      <div style="margin-top: 0; text-align: center">Sub-totals</div>
                      <div
                          class="text-slate-500 font-thin text-ellipsis"
                          style="font-size: .8em; font-weight: 800; text-align: center"
                          v-if="formValue.items[index].item_id"
                      >
                        <div
                          v-html="generateSubTotals(
                              formValue.items[index].item,
                              formValue.items[index].discount,
                              formValue.items[index].units,
                              formValue.items[index].unit_price,
                              index
                          )"
                        ></div>
                      </div>
                    </n-grid-item>
                  </n-grid>
              </n-dynamic-input>
              </n-card>
            </n-grid-item>
            <n-grid-item :span="4">
              <n-form-item path="amount_paid" label="Amount Paid">
                <n-input-number
                    v-model:value="formValue.amount_paid"
                    :min="0"
                    :max="formValue.total_amount"
                    placeholder="Amount Paid"
                    clearable
                    class="w-full"
                    :show-button="false"
                    @update:value="handleAnyFormUpdates()"
                >
                  <template #suffix>UGX</template>
                </n-input-number>
              </n-form-item>
            </n-grid-item>
            <n-grid-item :span="8">
              <div class="text-right" v-if="formValue.items.length > 0">
                <div style="font-weight: 800; font-size: 1.4em">Invoice Summary</div>
                <div
                    style="font-size:.8em; font-weight: 600"
                    v-html="generateStatement()"
                >
                </div>
              </div>
            </n-grid-item>
          </n-grid>
        </n-form>
      </n-card>
    </n-modal>
    <create-product-modal
        v-if="showCreateProductModal"
        :is-view-mode="false"
        :show-editor-modal="showCreateProductModal"
        @closeModal="handleCloseCreateProductModal"
        @saveProduct="handleProduct"
    />
  </div>
</template>
<script>
import {h, ref, defineComponent, onMounted, toRefs, computed } from "vue";
import {apiEndPoints} from "@/shared/constants/endPoints/Index";
import axios from '@/plugins/axios'
import {NButton, useMessage} from "naive-ui";
import {useStore} from "vuex"
import { currencyValue } from "@/shared/utilz/Index";
import DetailsModal from '../../products/DetailsModal.vue'
import moment from "moment";

export default defineComponent({
  emits: ['invoiceAction', 'closeModal'],
  components: { CreateProductModal: DetailsModal},
  props: {
    showEditorModal: {
      type: Boolean,
      required: true,
      default: false
    },
    isEditMode: {
      type: Boolean,
      required: false,
      default: false
    },
    invoice: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  setup (props, context) {
    const stateProps = toRefs(props)
    const message = useMessage()
    const store = useStore()
    const formRef = ref(null)
    const loading = ref(false)
    const products = ref([])
    const copyProducts = ref([])
    const showCreateProductModal = ref(false)
    const createItemIndex = ref(null)
    const isFistInitializer = ref(false)
    const isEditing = ref(stateProps.isEditMode.value)
    const initialFormState = {
      invoice_id: isEditing.value ? stateProps.invoice.value.invoice_id : null,
      customer: isEditing.value ? stateProps.invoice.value.customer : null,
      date: isEditing.value ? Number(new Date(stateProps.invoice.value.date)) : Number(new Date()),
      due_date: isEditing.value ? Number(new Date(stateProps.invoice.value.due_date)) : Number(new Date()),
      paid: isEditing.value ? stateProps.invoice.value.paid : false,
      amount_paid: isEditing.value ? stateProps.invoice.value.amount_paid : 0,
      total_amount: isEditing.value ? stateProps.invoice.value.total_amount : 0,
      balance: isEditing.value ? stateProps.invoice.value.balance : 0,
      items: []
    }
    if(isEditing.value) {
      isFistInitializer.value = true
      stateProps.invoice.value.items.forEach((item, i) => {
        initialFormState.items[i] = {}
        initialFormState.items[i].item_id = item.item_id
        initialFormState.items[i].item = item.item
        initialFormState.items[i].units = item.units
        initialFormState.items[i].unit_price = item.unit_price
        initialFormState.items[i].subtotal = item.subtotal
        initialFormState.items[i].discount = item.discount
        initialFormState.items[i].profit = item.profit
        initialFormState.items[i].exclusiveTax = item.exclusiveTaxVal
        item.tax_revenue.forEach((tax, j) => {
          initialFormState.items[i].taxRevenue = []
          initialFormState.items[i].taxRevenue[j] = {}
          initialFormState.items[i].taxRevenue[j].id = tax.id
          initialFormState.items[i].taxRevenue[j].amount = tax.amount
          initialFormState.items[i].taxRevenue[j].type = tax.type
        })
      })
    }
    const formValue = ref(initialFormState)
    const fetchProducts = async () => {
      try{
        const { data} = await axios.get(apiEndPoints().PRODUCTS.GET)
        products.value = data.filter(x => x.stock_level > 0).map((v) => ({
          ...v,
          label: v.name.toUpperCase(),
          value: v.id,
          description: v.description.toLowerCase()
        }))
        copyProducts.value = products.value.slice(0, 4)
      } catch (e) {
        message.warning(e.response?.data?.detail || "Something went wrong")
      }
    }
    onMounted( async () => {
      await fetchProducts()
    })
    const clearForm = () => {
    //
    }
    const closeModal = () => {
      isEditing.value = false
      formValue.value = null
      context.emit('closeModal')
    }

    const  createUpdateInvoice = () => {
      formRef.value.validate(async (errors) => {
        if (!errors) {
          store.commit('spinner/SET_SPINNER_STATUS', true)
          loading.value = true
          const {due_date, date, customer} = formValue.value
          const postData = {
            customer: customer ? customer.toString().toUpperCase() : "",
            date: moment(formValue.value.date).format("YYYY-MM-DD"),
            due_date: due_date < date ? moment(date).format("YYYY-MM-DD") :
                moment(due_date).format("YYYY-MM-DD"),
            paid: formValue.value.paid,
            amount_paid: formValue.value.amount_paid,
            total_amount: formValue.value.total_amount,
            balance: formValue.value.balance,
            items: formValue.value.items.map(item => ({
              item_id: item.item_id,
              units: item.units,
              unit_price: item.unit_price,
              subtotal: item.subtotal,
              discount: item.discount,
              profit: item.profit,
              taxRevenue: item.taxRevenue,
            }))
          }
          if(isEditing.value) postData.invoice_id = formValue.value.invoice_id
          try {
            const AXIOS_METHOD = isEditing.value ? 'patch' : 'post'
            const {data} = await axios[AXIOS_METHOD](apiEndPoints().SALES.INVOICE[isEditing.value ? 'UPDATE' : 'CREATE'],postData)
            // context.emit("saveProduct", {...data, ...isEditing.value ? {key: stateProps.product.value.key} : {}})
            console.log(data)
            store.commit('spinner/SET_SPINNER_STATUS', false)
            loading.value = false
            message.success(`Invoice was ${isEditing.value ? 'edited' : 'created'} successfully`)
            clearForm()
            closeModal()
          } catch (e) {
            store.commit('spinner/SET_SPINNER_STATUS', false)
            loading.value = false
            message.warning(e.response?.data?.detail || "Something went wrong")
          }
        } else {
          message.warning("Please enter required fields")
        }
      })
    }

    const renderProductLabel = (option) => {
      return h("div", {
        style: {
          width: "100%",
          display: "flex",
          flexDirection: "column"
        }}, [
          h("div",{}, {default: ()=> option.label}),
          h("div", {
            style: {
              fontWeight: 200,
              fontSize: ".7em",
              display: "inline-grid",
              "grid-template-columns": "100px 100px"
            }}, [
              h("div",{}, {default: ()=> currencyValue(option.selling_price)}),
              h("div",{}, {default: ()=> option.stock_level + " Available"}),
          ]),
      ])
    }

    const renderProductTag = ({option}) => {
      return h( "div", {}, { default: () => option.label })
    }

    const setProductItem = (value, index) => {
      const selectedItem = products.value.filter(x => x.id === formValue.value.items[index].item_id)
      formValue.value.items[index].item =  selectedItem[0]
      formValue.value.items[index].unit_price = selectedItem[0].selling_price >= 500 ? selectedItem[0].selling_price : 500
      formValue.value.items[index].discount = selectedItem[0].discount
      formValue.value.items[index].units = 1
      isFistInitializer.value = false
    }

    const renderCardTitle = ({ isEditMode, invoice }) => {
      return h('div', {}, [
        h('div', {class: "flex flex-row"}, [
          h('h1',{class: "flex-none font-semibold"}, `${ isEditMode ? invoice.invoice_number : 'New Invoice'}`),
          h('div', {class: "justify-self-end ml-auto"}, [
            h(NButton, {color: "#0aa699",
                  disabled: loading.value || !formValue.value.items[0]?.item_id, onClick: () => createUpdateInvoice()},
                {default: () => isEditMode ? "Save" : 'Create'}),
            h(NButton, {class: "ml-2", onClick: () => closeModal()}, {default: () => 'Cancel'}),
          ])
        ])
      ])
    }

    const title = computed(() => {
      return renderCardTitle({
        isEditMode: stateProps.isEditMode.value,
        invoice: stateProps.invoice.value
      })
    })
    return {
      formRef,
      formValue,
      productOptions: copyProducts,
      isEditing,
      loading,
      showCreateProductModal,
      renderProductTag,
      renderProductLabel,
      setProductItem,
      dueDateDisabled (timeStamp) {
        let invoiceDate =  new Date(formValue.value.date)
        invoiceDate.setDate(invoiceDate.getDate() - 1)
        return new Date(timeStamp) < invoiceDate
      },
      size: ref('medium'),
      onCreate () {
        return {
          item: {
            brand: null,
            buying_price: null,
            category: null,
            description: null,
            discount: null,
            id: null,
            minimum_price: null,
            name: null,
            selling_price: null,
            sku_id: null,
            stock_level: null,
            stock_threshold: null,
            tax: [{id: null, description: null, value: null, type: null}]
          },
          item_id: null,
          units: 1,
          unit_price: null,
          subtotal: null,
          discount: 0,
          discountValue: 0,
          profit: null,
          taxRevenue: [],
          exclusiveTax: 0
        }
      },
      handleItemSearch: (query) => {
        if (!query.length) {
          copyProducts.value = products.value.slice(0, 4)
          return
        }
        window.setTimeout(() => {
          copyProducts.value = products.value.filter(
              (item) => ~item.label.toLowerCase().indexOf(query.toLowerCase())
          )
        }, 500)
      },
      openCreateProductModal: (index) => {
        showCreateProductModal.value = true
        createItemIndex.value = index
      },
      generateSubTotals: (item, discount, units, unit_price, index) => {
        let discountVal = ((
            (isFistInitializer.value && isEditing.value) ? formValue.value.items[index].discount : discount)
            * unit_price) / 100
        let amount = (isFistInitializer.value && isEditing.value) ?
            formValue.value.items[index].subtotal : (unit_price - discountVal) * units
        let exclusiveTax = formValue.value.items[index].exclusiveTax
        let inclusiveTax = 0
        const taxRevenue = formValue.value.items[index].taxRevenue
        let profit = formValue.value.items[index].profit
        if(!(isEditing.value && isFistInitializer.value)) {
          if(item.tax.length > 0) {
            item.tax.forEach(tax => {
              if(tax.type) {
                const revenue = {
                  id: tax.id,
                  amount: ((tax.value *  unit_price) / 100) * units,
                  type: tax.type
                }
                if(revenue.type.toLowerCase() === "exclusive") {
                  amount += revenue.amount
                  exclusiveTax += revenue.amount
                } else inclusiveTax += revenue.amount
                taxRevenue.push(revenue)
              }
            })
          }
          profit = (amount - exclusiveTax - inclusiveTax) - (item.buying_price * units)
          formValue.value.items[index].taxRevenue = taxRevenue
          formValue.value.items[index].subtotal = amount
          formValue.value.items[index].profit = profit
        }
        formValue.value.items[index].exclusiveTax = exclusiveTax
        formValue.value.items[index].discountValue = discountVal

        return `${
          exclusiveTax > 0 ? `Tax: ${currencyValue(exclusiveTax)} <br /> ` : ''}
          Profit: ${currencyValue(profit)} <br /> Total: ${currencyValue(amount)}`;
      },
      generateStatement: () =>  {
        let totalExclusive = 0
        let totalAmount = 0
        let totalProfits = 0
        let totalDiscounts = 0
        formValue.value.items.forEach(item => {
          totalExclusive += item.exclusiveTax
          totalAmount += item.subtotal
          totalProfits += item.profit
          totalDiscounts += item.discountValue
        })

        formValue.value.total_amount = totalAmount
        formValue.value.balance = totalAmount - formValue.value.amount_paid

        formValue.value.paid = formValue.value.balance <= 0

        return `No. Items: ${formValue.value.items.length} <br />` +
            `Discounts: ${currencyValue(totalDiscounts)} <br />` +
            `Tax Value: ${currencyValue(totalExclusive)} <br />` +
            `Profit Value: ${currencyValue(totalProfits)} <br />` +
            `Total Amount: ${currencyValue(totalAmount)} <br />` +
            `Amount Paid: ${currencyValue(formValue.value.amount_paid || 0)} <br />` +
            `Balance: ${currencyValue(formValue.value.balance || 0)}`
      },
      handleProduct(event) {
        if(event.stock_level === 0) {
          message.warning("Item created has stock level 0, it can't be selected",
              { duration: 5000 }
          )
          return
        }
        products.value.push({
              ...event,
              label: event.name.toUpperCase(),
              value: event.id
            })
        copyProducts.value.pop()
        copyProducts.value.push({
          ...event,
          label: event.name.toUpperCase(),
          value: event.id
        })
        formValue.value.items[createItemIndex.value].item_id = event.id
        setProductItem(event.id, createItemIndex.value)
      },
      handleCloseCreateProductModal() {
        showCreateProductModal.value = false
      },
      handleAnyFormUpdates() {
        isFistInitializer.value = false
      },
      rules: {
        customer: {},
        date: {
          type: "number",
          required: true,
          message: 'Date is required',
          trigger: ['blur', 'input', 'change']
        },
        due_date: {
          type: "number",
          required: true,
          message: 'Due date is required',
          trigger: ['blur', 'input', 'change']
        },
        paid: {
          required: true
        },
        amount_paid: {
          type: "number",
          required: true,
          message: 'Amount paid is required',
          trigger: ['blur', 'input', 'change']
        },
        balance: {},
      },
      itemIdRule: {
        type: 'number',
        required: true,
        trigger: ['change', 'blur'],
        message: 'A product is required'
      },
      unitsRule: {
        type: 'number',
        required: true,
        trigger: ['blur', 'change'],
        message: 'Units are required',
      },
      unitPriceRule: {
        type: 'number',
        required: true,
        trigger: ['blur', 'change'],
        message: 'Unit price is required'
      },
      title,
    }
  }
})
</script>
<style scoped>
</style>