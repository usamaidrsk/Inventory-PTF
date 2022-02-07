<template>
  <div>
    <n-modal :show="showEditorModal">
      <n-card
          style="width: 75%; height: 90%"
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
            :disabled="isViewMode && !isEditing"
            size="medium"
            ref="formRef"
        >
          <n-grid :x-gap="12" :y-gap="2" :cols="2">
            <n-grid-item>
              <n-grid :x-gap="12" :y-gap="2" :cols="4">
                <n-grid-item :span="3">
                  <n-form-item :span="12" label="Product Name" path="name">
                    <n-input placeholder="Enter Product Name"   v-model:value="formValue.name"/>
                  </n-form-item>
                </n-grid-item>
                <n-grid-item>
                  <n-form-item :span="12" label="Product SKU" path="sku_id">
                    <n-input
                        placeholder="Enter SKU"
                        v-model:value="formValue.sku_id"
                        :disabled="isViewMode"
                    />
                  </n-form-item>
                </n-grid-item>
              </n-grid>
            </n-grid-item>
            <n-grid-item>
              <n-form-item :span="12" label="Product Description" path="description">
                <n-input
                    v-model:value="formValue.description"
                    placeholder="Enter Product Description"
                    type="textarea"
                    :autosize="{
                      minRows: 1,
                      maxRows: 5
                    }"
                />
              </n-form-item>
            </n-grid-item>
            <n-grid-item>
              <n-form-item path="buying_price" label="Buying Price">
                <n-input-number
                    v-model:value="formValue.buying_price"
                    :min="1"
                    placeholder="Enter Buying Price"
                    clearable
                    class="w-full"
                >
                  <template #suffix>UGX</template>
                </n-input-number>
              </n-form-item>
            </n-grid-item>
            <n-grid-item>
              <n-form-item path="selling_price" label="Selling Price">
                <n-input-number
                    v-model:value="formValue.selling_price"
                    :min="1"
                    placeholder="Enter Selling Price"
                    clearable
                    class="w-full"
                >
                  <template #suffix>UGX</template>
                </n-input-number>
              </n-form-item>
            </n-grid-item>
            <n-grid-item>
              <n-form-item path="discount" label="Discount Rate">
                <n-input-number
                    v-model:value="formValue.discount"
                    :min="0"
                    :max="100"
                    placeholder="Enter Discount Rate"
                    clearable
                    class="w-full"
                >
                  <template #suffix>%</template>
                </n-input-number>
              </n-form-item>
            </n-grid-item>
            <n-grid-item>
              <n-form-item path="stock_threshold" label="Low Stock Threshold">
                <n-input-number
                    v-model:value="formValue.stock_threshold"
                    :min="0"
                    placeholder="Enter Threshold"
                    clearable
                    class="w-full"
                >
                </n-input-number>
              </n-form-item>
            </n-grid-item>
            <n-grid-item>
              <n-form-item path="stock_level" label="Initial Stock">
                <n-input-number
                    v-model:value="formValue.stock_level"
                    :min="0"
                    placeholder="Enter Initial Stock"
                    clearable
                    class="w-full"
                >
                </n-input-number>
              </n-form-item>
            </n-grid-item>
            <n-grid-item>
              <n-form-item
                  :span="12"
                  label="Taxes"
                  path="tax"
              >
                <n-select
                    placeholder="Select Taxes"
                    v-model:value="formValue.tax"
                    :default-value="taxValue"
                    :options="taxes"
                    filterable
                    clearable
                    multiple
                />
              </n-form-item>
            </n-grid-item>
            <n-grid-item>
              <n-form-item
                  :span="12"
                  label="Product Category"
                  path="category"
              >
                <n-select
                    v-model:value="formValue.category"
                    placeholder="Select Category"
                    :default-value="categoryValue"
                    filterable
                    clearable
                    :options="categories"
                />
              </n-form-item>
            </n-grid-item>
            <n-grid-item>
              <n-form-item
                  :span="12"
                  label="Product Brand"
                  path="brand"
              >
                <n-select
                    v-model:value="formValue.brand"
                    placeholder="Select Brand"
                    :default-value="brandValue"
                    filterable
                    clearable
                    :options="brands"
                />
              </n-form-item>
            </n-grid-item>
          </n-grid>
        </n-form>
      </n-card>
    </n-modal>
  </div>
</template>
<script>
import {h, ref, defineComponent, onMounted, toRefs, computed, watchEffect } from "vue";
import {apiEndPoints} from "@/shared/constants/endPoints/Index";
import axios from '@/plugins/axios'
import {NButton, useMessage} from "naive-ui";
import {useStore} from "vuex"

export default defineComponent({
  emits: ['saveProduct', 'closeModal', 'openDeleteModal'],
  props: {
    showEditorModal: {
      type: Boolean,
      required: true,
      default: false
    },
    isViewMode: {
      type: Boolean,
      required: false,
      default: false
    },
    product: {
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
    const taxes = ref(null)
    const categories = ref(null)
    const brands = ref(null)
    const taxValue = ref([])
    const brandValue = ref(null)
    const categoryValue = ref(null)
    const isEditing = ref(false)
    const initialFormState = {
      sku_id: null,
      name: null,
      description: null,
      selling_price: null,
      buying_price: null,
      stock_threshold: null,
      stock_level: null,
      discount: null,
      brand: null,
      category: null,
      tax: null
    }
    const formValue = ref(initialFormState)
    watchEffect(() => {
      if(stateProps.isViewMode.value) {
        const {
          name, sku_id, description, selling_price,
          buying_price, stock_threshold, stock_level,
          discount, tax, brand, category
        } = stateProps.product.value
        formValue.value.name = name
        formValue.value.sku_id = sku_id
        formValue.value.description = description
        formValue.value.selling_price = selling_price
        formValue.value.buying_price = buying_price
        formValue.value.stock_level = stock_level
        formValue.value.stock_threshold = stock_threshold
        formValue.value.discount = discount
        taxValue.value = []
        if(tax.length) {
          tax.forEach(x => {
            taxValue.value.push(x.id)
          })
        }
        brandValue.value = brand?.id || null
        categoryValue.value = category?.id || null

        console.log(taxValue.value, brandValue.value, categoryValue.value)
      }
      else formValue.value = initialFormState
    })
    const fetchTaxes = async () => {
      try{
        const { data} = await axios.get(apiEndPoints().SETTINGS.TAX.GET)
        taxes.value = data.map((v) => ({
          label: v.description.toUpperCase(),
          value: v.id
        }))
      } catch (e) {
        message.warning(e.response?.data?.detail || "Something went wrong")
      }
    }
    const fetchCategories = async () => {
      try{
        const { data} = await axios.get(apiEndPoints().PRODUCTS.CATEGORY.GET)
        categories.value = data.map((v) => ({
          label: v.name.toUpperCase(),
          value: v.id
        }))
      } catch (e) {
        message.warning(e.response?.data?.detail || "Something went wrong")
      }
    }
    const fetchBrands = async () => {
      try{
        const { data} = await axios.get(apiEndPoints().PRODUCTS.BRAND.GET)
        brands.value = data.map((v) => ({
          label: v.name.toUpperCase(),
          value: v.id
        }))
      } catch (e) {
        message.warning(e.response?.data?.detail || "Something went wrong")
      }
    }
    const clearForm = () => {
      formValue.value.sku_id = null
      formValue.value.name = null
      formValue.value.description = null
      formValue.value.selling_price = null
      formValue.value.buying_price = null
      formValue.value.stock_threshold = null
      formValue.value.stock_level = null
      formValue.value.discount = null
      formValue.value.brand = null
      formValue.value.category = null
      formValue.value.tax = null
    }
    const closeModal = () => {
      isEditing.value = false
      context.emit('closeModal')
    }
    const showDeleteModal = () => {
      context.emit('openDeleteModal')
    }
    const activateEditing = () => {
      isEditing.value = true
    }
    const  saveProduct = () => {
      formRef.value.validate(async (errors) => {
        if (!errors) {
          store.commit('spinner/SET_SPINNER_STATUS', true)
          loading.value = true
          const { name, description, stock_threshold, stock_level, discount, tax } = formValue.value
          const postData = {
            ...formValue.value,
            name: name.toUpperCase(),
            description: description ? description.toUpperCase() : 'NO DESCRIPTION PROVIDED',
            stock_threshold: stock_threshold || 0,
            stock_level: stock_level || 0,
            discount: discount || 0,
            tax: tax || [],
            ...isEditing.value ? {id: stateProps.product.value.id} : {}
          }
          try {
            const AXIOS_METHOD = isEditing.value ? 'patch' : 'post'
            const {data} = await axios[AXIOS_METHOD](apiEndPoints().PRODUCTS[isEditing.value ? 'UPDATE' : 'CREATE'],postData)
            context.emit("saveProduct", {...data, ...isEditing.value ? {key: stateProps.product.value.key} : {}})
            store.commit('spinner/SET_SPINNER_STATUS', false)
            loading.value = false
            message.success(`Product was ${isEditing.value ? 'edited' : 'created'} successfully`)
            clearForm()
            closeModal()
          } catch (e) {
            console.log(e)
            store.commit('spinner/SET_SPINNER_STATUS', false)
            loading.value = false
            message.warning(e.response?.data?.detail || "Something went wrong")
          }
        } else {
          message.warning("Please enter required fields")
        }
      })
    }
    const initialButtons  = computed(() => {
      return [
        h(NButton, {color: "#0aa699", disabled: loading.value, onClick: () => saveProduct()},
            {default: () => 'Create'}),
        h(NButton, {class: "ml-2", onClick: () => closeModal()}, {default: () => 'Cancel'}),
      ]
    })
    const productViewButtons = computed(() => {
      return [
        h(NButton,
            { color: "#0aa699", style: { display: isEditing.value ? 'none' : 'initial' },
              onClick: () => activateEditing()}, { default: () => 'Edit' }),
        h(NButton,
            { color: "#0aa699", class: "ml-2", style: {display: isEditing.value ? 'initial' : 'none'},
              disabled: loading.value, onClick: () => saveProduct()}, { default: () => 'Save' }),
        h(NButton, {color: "red", class: "ml-2", onClick: () => showDeleteModal()}, {default: () => 'Delete'}),
        h(NButton, {class: "ml-2", onClick: () => closeModal()}, {default: () => 'Cancel'}),
      ]
    })
    const renderCardTitle = ({ isViewMode, initialButtons, productViewButtons, product }) => {
      return h('div', {}, [
        h('div', {class: "flex flex-row"}, [
          h('h1',{class: "flex-none font-semibold"}, `${ isViewMode ? product.name : 'Add New Product'}`),
          h('div', {class: "justify-self-end ml-auto"}, [ isViewMode ? productViewButtons.value : initialButtons.value])
        ])
      ])
    }
    const title = computed(() => {
      return renderCardTitle({
        isViewMode: stateProps.isViewMode.value,
        initialButtons, productViewButtons,
        product: stateProps.product.value
      })
    })
    onMounted( async () => {
      await fetchTaxes()
      await fetchCategories()
      await fetchBrands()
    })
    return {
      formRef,
      categoryValue,
      brandValue,
      taxValue,
      formValue,
      taxes,
      brands,
      categories,
      isEditing,
      loading,
      size: ref('medium'),
      rules: {
        sku_id: {
          required: true,
          message: 'SKU is required',
          trigger: ['blur', 'input']
        },
        name: {
          required: true,
          message: 'Product name is required',
          trigger: ['blur', 'input']
        },
        description: {
          required: false,
        },
        selling_price: {
          type: 'number',
          required: true,
          trigger: ['blur', 'change'],
          message: 'Selling Price is required'
        },
        buying_price: {
          type: 'number',
          required: true,
          trigger: ['blur', 'change'],
          message: 'Buying price is required'
        },
        stock_threshold: {
          required: false,
        },
        stock_level: {
          required: false,
        },
        discount: {
          required: false,
        },
        brand: {
          type: 'number',
          required: true,
          trigger: ['blur', 'change'],
          message: 'Product brand is required'
        },
        category: {
          type: 'number',
          required: true,
          trigger: ['blur', 'change'],
          message: 'Product category is required'
        },
        tax: {
          type: 'array',
          required: false,
        },
      },
      title,
    }
  }
})
</script>

<style scoped>

</style>