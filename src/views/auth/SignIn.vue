<template>
  <div class="container">
    <n-card title="Sign In" size="medium">
      <n-form
          :label-width="80"
          :model="formValue"
          :rules="rules"
          :size="size"
          ref="formRef"
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
              <div style="display: flex; justify-content: space-between;">
                <router-link to="#" #="{ navigate, href }" custom>
                  <n-a :href="href" @click="navigate">Don't have account? Sign Up</n-a>
                </router-link>
                <n-button
                    style="margin-left: 1em;"
                    :disabled="loading"
                    @click.prevent="signIn()"
                    type="primary"
                >
                  Sign In
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
import { mapMutations } from 'vuex'
export default defineComponent({
  setup () {
    const formRef = ref(null)
    const message = useMessage()
    return {
      formRef,
      loading: false,
      size: ref('medium'),
      formValue: ref({
        username: '',
        password: ''
      }),
      rules: {
        username: {
          required: true,
          message: 'Username is required',
          trigger: ['blur', 'input']
        },
        password: {
          required: true,
          message: 'Password is required',
          trigger: ['blur', 'input']
        }
      },
      ...mapMutations({
        setSpinner: "spinner/SET_SPINNER_STATUS"
      }),
      signIn() {
      this.formRef.validate(async (errors) => {
        if (!errors) {
          this.setSpinner(true)
          this.loading = true
          try {
            await this.axios.post("auth/", this.formValue)
            this.setSpinner(false)
            this.loading = false
            message.success('Signed in successfully')
          } catch (e) {
            this.setSpinner(false)
            this.loading = false
            message.warning('Something went wrong')
          }
        } else {
          this.setSpinner(true)
          this.setSpinner(false)
          message.warning("Please enter required fields")
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
  background-color: #ceeee1;
}

.n-card::v-deep .n-card-header .n-card-header__main {
  font-size: 1.4em !important;
  font-weight: bolder !important;
  text-align: center !important;
}

.container {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 15vh;
}
</style>
