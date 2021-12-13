<template>
    <n-layout-sider
        bordered
        show-trigger
        collapse-mode="width"
        :collapsed-width="72"
        :width="250"
        :native-scrollbar="false"
        style="max-height: 87vh; overflow: hidden; overflow-y: auto"
    >
      <n-menu
          style=""
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :options="menuOptions"
      />
    </n-layout-sider>
</template>

<script>
import { h, defineComponent, resolveComponent } from 'vue'
import {NIcon} from 'naive-ui'
import {
    HomeOutline as Home, SettingsOutline as Settings, DocumentTextOutline as Template, PeopleOutline as Employees,
    CashOutline as Accounting, BusinessOutline as Inventory,
  HelpBuoy as Help,
} from '@vicons/ionicons5'
import { ShoppingCatalog as Sales, Finance, User, Purchase } from '@vicons/carbon'
function renderIcon (icon) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

function renderRouterLink (to, labelName, params = null ) {
  return () => h(
      resolveComponent('router-link'),
      { to: { name: to, params: params } }, null,
      labelName
  )
}

const menuOptions = [
  {
    label: renderRouterLink('dashboard', 'Dashboard'),
    key: 'dashboard',
    icon: renderIcon(Home)
  },
  {
    label: 'Sales',
    key: 'sales',
    icon: renderIcon(Sales),
    disabled: false,
    children: [
      {
        label: 'Manage Invoices',
        key: 'manage-invoices'
      },
      {
        label: 'Create Invoices',
        key: 'create-invoices'
      },
      {
        label: 'Estimates',
        key: 'estimates'
      },
      {
        label: 'Credit Notes',
        key: 'credit-notes'
      },
      {
        label: 'Refund Receipts',
        key: 'refund-receipts'
      },
      {
        label: 'Recurring Invoices',
        key: 'recurring-invoices'
      },
      {
        label: 'Client Payments',
        key: 'client-payments'
      },
      {
        label: 'Sales Settings',
        key: 'sales-settings'
      }
    ]
  },
  {
    label: 'Clients',
    key: 'clients',
    icon: renderIcon(User),
    disabled: false,
    children: [
      {
        label: 'Manage Clients',
        key: 'manage-clients'
      },
      {
        label: 'Add New Client',
        key: 'add-new-client'
      },
      {
        label: 'Contacts List',
        key: 'contacts-list'
      },
      {
        label: 'Client Settings',
        key: 'client-settings'
      },
      {
        label: 'Refund Receipts',
        key: 'refund-receipts'
      }
    ]
  },
  {
    label: 'Inventory',
    key: 'inventory',
    icon: renderIcon(Inventory),
    disabled: false,
    children: [
      {
        label: 'Product & Services',
        key: 'product-and-services'
      },
      {
        label: 'Price List',
        key: 'price-list'
      },
      {
        label: 'Warehouses',
        key: 'warehouses'
      },
      {
        label: 'Manage Stock Takings',
        key: 'manage-stock-takings'
      },
      {
        label: 'Inventory Settings',
        key: 'inventory-settings'
      }
    ]
  },
  {
    label: 'Purchases',
    key: 'purchases',
    icon: renderIcon(Purchase),
    disabled: false,
    children: [
      {
        label: 'Manage Purchase Invoices',
        key: 'manage-purchase-invoices'
      },
      {
        label: 'Purchase Refunds',
        key: 'purchase-refunds'
      },
      {
        label: 'Manage Suppliers',
        key: 'manage-suppliers'
      },
      {
        label: 'Purchase Invoice Settings',
        key: 'purchase-invoice-settings'
      },
      {
        label: 'Supplier Settings',
        key: 'supplier-settings'
      }
    ]
  },
  {
    label: 'Finance',
    key: 'finance',
    icon: renderIcon(Finance),
    disabled: false,
    children: [
      {
        label: 'Expenses',
        key: 'expenses'
      },
      {
        label: 'Incomes',
        key: 'incomes'
      },
      {
        label: 'Treasuries & Bank Accounts',
        key: 'treasuries-and-bank-accounts'
      },
      {
        label: 'Finance Settings',
        key: 'finance-settings'
      },
    ]
  },
  {
    label: 'Accounting',
    key: 'accounting',
    icon: renderIcon(Accounting),
    disabled: false,
    children: [
      {
        label: 'Journal Entries',
        key: 'journal-entries'
      },
      {
        label: 'Chart Of Accounts',
        key: 'chart-of-accounts'
      },
      {
        label: 'Cost Centers',
        key: 'cost-centers'
      },
      {
        label: 'Assets',
        key: 'assets'
      },
      {
        label: 'Accounting Settings',
        key: 'accounting-settings'
      }
    ]
  },
  {
    label: 'Employees',
    key: 'employees',
    icon: renderIcon(Employees),
    disabled: false,
    children: [
      {
        label: 'Manage Employees',
        key: 'manage-employees'
      },
      {
        label: 'Manage Employee Roles',
        key: 'manage-employee-roles'
      },
      {
        label: 'Settings',
        key: 'settings'
      }
    ]
  },
  {
    label: 'Reports',
    key: 'reports',
    icon: renderIcon(Template),
    disabled: false,
    children: [
      {
        label: 'Sales Reports',
        key: 'sales-reports'
      },
      {
        label: 'Purchase Reports',
        key: 'purchase-reports'
      },
      {
        label: 'Accounting Reports',
        key: 'accounting-reports'
      },
      {
        label: "Clients' Reports",
        key: 'client-reports'
      },
      {
        label: 'Store Reports',
        key: 'store-reports'
      },
      {
        label: 'System Activity Log',
        key: 'system-activity-log'
      }
    ]
  },
  {
    label: 'Templates',
    key: 'templates',
    icon: renderIcon(Template),
    disabled: false,
    children: [
      {
        label: 'Printable Templates',
        key: 'printable-templates'
      },
      {
        label: 'Prefilled Templates',
        key: 'prefilled-templates'
      },
      {
        label: 'Email Templates',
        key: 'email-templates'
      },
      {
        label: 'Term & Conditions',
        key: 'term-and-conditions'
      },
      {
        label: 'Manage Files/Documents',
        key: 'manage-files-documents'
      },
      {
        label: 'Auto Reminder Rules',
        key: 'auto-reminder-rules'
      }
    ]
  },
  {
    label: 'Settings',
    key: 'settings',
    icon: renderIcon(Settings),
    disabled: false,
    children: [
      {
        label: 'Account Information',
        key: 'account-information'
      },
      {
        label: 'Account Settings',
        key: 'account-setting'
      },
      {
        label: 'SMTP Settings',
        key: 'smtp-settings'
      },
      {
        label: 'Payment Options',
        key: 'payment-options'
      },
      {
        label: 'Auto Number Settings',
        key: 'auto-number-settings'
      },
      {
        label: 'Tax Settings',
        key: 'tax-settings'
      },
      {
        label: 'Apps Manager',
        key: 'apps-manager'
      },
      {
        label: 'System Logo & Color',
        key: 'system-logo-and-color'
      },
      {
        label: 'API',
        key: 'api'
      }
    ]
  },
  {
    label: 'Help',
    key: 'help',
    icon: renderIcon(Help),
    disabled: false,
    children: [
      {
        label: 'System Manual',
        key: 'system-manual'
      },
      {
        label: 'Submit Feedback',
        key: 'submit-feedback'
      }
    ]
  }
]

export default defineComponent({
  setup () {
    return {
      inverted: false,
      menuOptions
    }
  }
})
</script>
<style scoped>
.sideNav {
  height: 95vh;
  overflow-y: auto;
}
</style>
