<template>
  <n-layout >
    <n-layout-header position="fixed" bordered style="display: flex; align-items: center; flex-direction: row; justify-content: space-between;">
      <h2 style="margin-left: 2em">Dashboard</h2>
      <div>
        <n-menu mode="horizontal" style="margin-right: 3em" :inverted="inverted" :options="menuOptions" />
      </div>
    </n-layout-header>
  </n-layout>
</template>

<script>
import { defineComponent } from 'vue'
import { Notifications } from '@vicons/ionicons5'
import { Email, UserAvatar, Locked, Password } from '@vicons/carbon'
import { renderIcon } from  '@/shared/utilz/Index'

const menuOptions = [
  {
    label: 'Notifications',
    key: 'notifications',
    icon: renderIcon(Notifications)
  },
  {
    label: 'Mr Admin',
    key: 'user-name',
    icon: renderIcon(UserAvatar),
    children: [
      {
        label: 'Change Email',
        key: 'change-email',
        icon: renderIcon(Email)
      },
      {
        label: 'Change Password',
        key: 'change-password',
        icon: renderIcon(Password)
      },
      {
        label: 'Logout',
        key: 'logout',
        icon: renderIcon(Locked)
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
