<template>
  <n-grid :x-gap="12" :y-gap="4" :cols="4">
    <n-grid-item :span="1">
      <div class="header-section pt-4 text-secondary font-bold text-current font-mono text-lg">
        Products
      </div>
    </n-grid-item>
    <n-grid-item :span="3">
      <div class="header-section flex flex-1 flex-row justify-end">
        <search :search-data="data" :reset-search="resetSearch" which-data="Product" @results="handleSearch"/>
        <n-button color="#0aa699" class="ml-4" @click="handleBrandCategoryClick('Category')">
          Categories
        </n-button>
        <n-button color="#0aa699" class="ml-4" @click="handleBrandCategoryClick('Brand')">
          Brands
        </n-button>
        <n-button color="#0aa699" class="ml-4" @click="newProduct()">
          <template #icon>
            <n-icon>
              <add-sharp />
            </n-icon>
          </template>
          New Product
        </n-button>
      </div>
    </n-grid-item>
    <n-grid-item :span="4">
      <n-divider />
      <div class="content-section">
        <n-data-table
            :columns="columns"
            :data="searchResults.length ? searchResults : data"
            :pagination="pagination"
            style="min-height: 67vh !important;"
        />
      </div>
    </n-grid-item>
  </n-grid>
  <details-modal
      v-if="showEditorModal"
      :show-editor-modal="showEditorModal"
      :is-view-mode="isViewMode"
      :product="selectedProduct"
      @closeModal="handleDetailsModalClose"
      @saveProduct="handleProduct"
      @openDeleteModal="handleOpenDeleteModal"
  />
  <delete-modal
      :show-delete-modal="showDeleteModal"
      @closeModal="handleDetailsModalClose"
      @delete="handleProductDelete"
  />
  <brand-category-modal
      v-if="showBrandCategoryModal"
      :show-modal="showBrandCategoryModal"
      :data-type="brandOrCategory"
      @closeModal="handleDetailsModalClose"
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
import DetailsModal from './DetailsModal'
import DeleteModal from "./DeleteModal";
import BrandCategoryModal from "./BrandCategoryModal"
export default defineComponent({
  components: {BrandCategoryModal, DeleteModal, Search, AddSharp, DetailsModal},
  setup () {
    const store = useStore()
    const message = useMessage()
    const selectedProduct = ref(null)
    const loading = ref(false)
    const isViewMode = ref(false)
    const showEditorModal = ref(false)
    const showDeleteModal = ref(false)
    const showBrandCategoryModal = ref(false)
    const brandOrCategory = ref(null)
    const createColumns = ({ expandViewModal }) => {
      return [
        {
          title: renderTableTitles('SKU'),
          key: 'sku_id',
          fixed: 'left',
        },
        {
          title: renderTableTitles('NAME'),
          key: 'name',
          fixed: 'left',
        },
        {
          title: renderTableTitles('DESCRIPTION'),
          key: 'description',
          fixed: 'left'
        },
        {
          title: renderTableTitles('BUYING PRICE'),
          key: 'buying_price',
          fixed: 'left',
          render (row) {
            return h(
                'div', {},
                {
                  default: () => currencyValue(row.buying_price)
                }
            )
          }
        },
        {
          title: renderTableTitles('SELLING PRICE'),
          key: 'selling_price',
          fixed: 'left',
          render (row) {
            return h(
                'div',
                {},
                {
                  default: () => currencyValue(row.selling_price)
                }
            )
          }
        },
        {
          title: renderTableTitles('STOCK'),
          key: 'stock_level',
          fixed: 'left'
        },
        {
          title: renderTableTitles('ACTIONS'),
          key: 'actions',
          fixed: 'left',
          render (row) {
            return h('div', {}, [
              h(NButton, {
                    size: 'small',
                    color: "#0aa699",
                    onClick: () => expandViewModal(row)
                  },
                  { default: () => 'View' }
              )
            ])
          }
        }
      ]
    }
    const paginationReactive = reactive({
      page: 1,
      pageSize: 10,
      showSizePicker: true,
      pageSizes: [10, 15, 20],
      onChange: (page) => {
        paginationReactive.page = page
      },
      onUpdatePageSize: (pageSize) => {
        paginationReactive.pageSize = pageSize
        paginationReactive.page = 1
      }
    })
    const products = ref( [])
    const searchResults = ref( [])
    const resetSearch = ref("")

    onMounted(async () => {
      try{
        store.commit('spinner/SET_SPINNER_STATUS', true)
        const { data} = await axios.get(apiEndPoints().PRODUCTS.GET)
        products.value = data.map((item, index) => ({
          description: item.description.toString().toUpperCase(),
          name: item.name.toString().toUpperCase(),
          ...item,
          key: index
        }))
        store.commit('spinner/SET_SPINNER_STATUS', false)
      } catch (e) {
        store.commit('spinner/SET_SPINNER_STATUS', false)
        message.warning(e.response?.data?.detail || "Something went wrong")
      }
    })
    const handleBrandCategoryClick = (val) => {
      showBrandCategoryModal.value = true
      brandOrCategory.value = val
    }
    const expandViewModal = (item) => {
      showEditorModal.value = true
      isViewMode.value = true
      selectedProduct.value = item
    }

    return {
      loading,
      data: products,
      searchResults,
      resetSearch,
      columns: createColumns({expandViewModal}),
      pagination: paginationReactive,
      showEditorModal,
      selectedProduct,
      isViewMode,
      showDeleteModal,
      showBrandCategoryModal,
      brandOrCategory,
      handleBrandCategoryClick,
      ...mapMutations({
        setSpinner: "spinner/SET_SPINNER_STATUS",
      }),
      newProduct() {
        showEditorModal.value = true;
        isViewMode.value = false
      },
      handleSearch(event) {
        resetSearch.value = ""
        searchResults.value = event
      },
      handleOpenDeleteModal() {
        showEditorModal.value = false
        showDeleteModal.value = true
      },
      async handleProductDelete() {
        store.commit('spinner/SET_SPINNER_STATUS', true)
        loading.value = true
        try {
          await axios.delete(apiEndPoints().PRODUCTS.DELETE(selectedProduct.value.id))
          products.value = products.value.filter(item => item.sku_id !== selectedProduct.value.sku_id)
          showDeleteModal.value = false
          selectedProduct.value = null
          store.commit('spinner/SET_SPINNER_STATUS', false)
          message.success('Product was deleted successfully')
          searchResults.value = []
          resetSearch.value = ""
        } catch (e) {
          store.commit('spinner/SET_SPINNER_STATUS', false)
          loading.value = false
          message.warning(e.response?.data?.detail || "Something went wrong")
        }
      },
      handleProduct(event) {
        if (isViewMode.value) {
          products.value = products.value.map(item => {
            if(item.key === event.key) return event
            else return item
          })
        } else {
          products.value = [{...event, key: products.value.length + 1}, ...products.value]
        }
        isViewMode.value = false
      },
      handleDetailsModalClose() {
        showEditorModal.value = false
        showDeleteModal.value = false
        showBrandCategoryModal.value = false
        isViewMode.value = false
        selectedProduct.value = null
        brandOrCategory.value = null
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