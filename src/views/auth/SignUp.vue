<template>
  <div style="width: 100%">
    <n-message-provider></n-message-provider>
    <n-card title="Sig In" size="medium" style="margin: auto">
      <n-form
          :label-width="80"
          :model="formValue"
          :rules="rules"
          :size="size"
          ref="formRef"
          style="text-align: left !important;"
      >
        <n-form-item label="Username" path="username">
          <n-input v-model:value="formValue.username" placeholder="Enter username"/>
        </n-form-item>
        <n-form-item path="password" label="Password">
          <n-input
              v-model:value="formValue.password"
              type="password"
              placeholder="Enter password"
          />
        </n-form-item>
        <n-form-item>
          <n-row :gutter="[0, 24]">
            <n-col :span="24">
              <div style="display: flex; justify-content: flex-end;">
                <a href="/signup">
                  <n-button
                      type="primary"
                      text
                  >
                    Sign In
                  </n-button>
                </a>
                <n-button
                    style="margin-left: 1em;"
                    @click.prevent="signIn()"
                    type="primary"
                >
                  Register
                </n-button>
              </div>
            </n-col>
          </n-row>
        </n-form-item>
      </n-form>
    </n-card>
  </div>
</template>

<script>
import {defineComponent, ref} from 'vue'
import { useMessage } from 'naive-ui'

export default defineComponent({
  setup () {
    const formRef = ref(null)
    const message = useMessage()
    return {
      formRef,
      size: ref('medium'),
      formValue: ref({
        email: '',
        username: '',
        password: ''
      }),
      rules: {
        username: {
          required: true,
          message: 'Username is required',
          trigger: 'blur'
        },
        password: {
          required: true,
          message: 'Password is required',
          trigger: ['blur']
        }
      },
      signIn () {
        this.formRef.validate((errors) => {
          if (!errors) {
            this.axios.post("auth/", this.formValue)
            message.success('Valid')
          } else {
            console.log(errors)
          }
        })
      }
    }
  }
})
</script>

<style scoped>
.n-card {
  max-width: 400px;
  background-color: aliceblue;
}
</style>
