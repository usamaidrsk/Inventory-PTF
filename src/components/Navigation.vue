<template>
  <n-layout >
    <n-layout-header position="fixed" bordered style="display: flex; align-items: center; flex-direction: row; justify-content: space-between;">
      <h2 class="ml-4 text-secondary font-bold">PICK && PAY</h2>
      <div>
        <n-menu mode="horizontal" style="margin-right: 3em" :inverted="inverted" :options="menuOptions" />
      </div>
    </n-layout-header>
  </n-layout>
</template>

<script>
import { defineComponent } from 'vue'
// import { useRouter } from 'vue-router'
// import { useStore } from 'vuex'
import { Notifications, LogOutOutline as LogoutIcon } from '@vicons/ionicons5'
import { Email, UserAvatar, Password } from '@vicons/carbon'
import { renderIcon } from  '@/shared/utilz/Index'
// import { useMessage } from 'naive-ui'

export default defineComponent({
  setup () {
    // const message = useMessage()
    // const router = useRouter()
    // const store = useStore()
    // async function logout() {
    //   this.setAuth(false)
    //   store.commit('auth/setAuth', {login: false})
    //   message.success("Logged out successfully")
    //   await router.push({name: "signin"})
    // }
    // const renderLogoutBtn = ({logout}) => {
    //   return  h(NButton, {
    //         onClick: () => logout()},
    //       'Logout')
    // }
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
            // label: renderLogoutBtn({logout}),
            label: 'Logout',
            key: 'logout',
            icon: renderIcon(LogoutIcon)
          }
        ]
      }
    ]
    return {
      inverted: false,
      menuOptions
    }
  }
})
</script>
<style scoped>

</style>
