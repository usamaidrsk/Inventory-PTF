<template>
  <n-layout >
    <n-layout-header
        position="fixed"
        bordered
        class="flex flex-row justify-between align-middle py-3"
        style="background-color: #0aa699"
    >
      <h2 class="ml-4 mt-2 text-secondary font-bold text-current font-mono text-lg">PICK && PAY</h2>
      <div>
        <n-menu mode="horizontal" class="mr-4" :inverted="inverted" :options="menuOptions" @update="handleOptionSelect"/>
      </div>
    </n-layout-header>
  </n-layout>
</template>

<script>
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Notifications, LogOutOutline as LogoutIcon } from '@vicons/ionicons5'
import { UserAvatar, Password } from '@vicons/carbon'
import { renderIcon } from  '@/shared/utilz/Index'
import { useMessage } from 'naive-ui'

export default defineComponent({
  setup () {
    const message = useMessage()
    const router = useRouter()
    const store = useStore()
    async function logout() {
      store.commit('auth/setAuth', {login: false})
      message.success("Logged out successfully")
      await router.push({name: "signin"})
    }
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
          // {
          //   label: 'Change Email',
          //   key: 'change-email',
          //   icon: renderIcon(Email)
          // },
          {
            label: 'Change Password',
            key: 'change-password',
            icon: renderIcon(Password)
          },
          {
            label: 'Logout',
            key: 'logout',
            icon: renderIcon(LogoutIcon)
          }
        ]
      }
    ]
    return {
      handleOptionSelect(key) {
        if(key === "logout") {
          logout()
        }
      },
      inverted: false,
      menuOptions,
    }
  }
})
</script>
<style scoped>

</style>
