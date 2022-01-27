<template>
    <n-layout-sider
        bordered
        show-trigger
        collapse-mode="width"
        :collapsed-width="72"
        :width="250"
        :native-scrollbar="false"
        style="max-height: 87vh; overflow: hidden; overflow-y: auto;"
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
import { defineComponent } from 'vue'
import {
  HomeOutline as Home,
  SettingsOutline as Settings,
  BusinessOutline as Inventory,
  HelpBuoy as Help,
} from '@vicons/ionicons5'
import {renderIcon, renderRouterLink} from  '@/shared/utilz/Index'

const menuOptions = [
  {
    label: renderRouterLink('home_dashboard', 'Dashboard'),
    key: 'dashboard',
    icon: renderIcon(Home)
  },
  {
    label: 'Inventory',
    key: 'inventory',
    icon: renderIcon(Inventory),
    disabled: false,
    children: [
      {
        label: renderRouterLink('products', "Products"),
        key: 'products'
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
        label:  renderRouterLink('tax', 'Tax Settings'),
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
