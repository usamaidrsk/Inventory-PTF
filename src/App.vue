<template>
  <n-config-provider :locale="enUS" :date-locale="dateEnUS">
    <n-message-provider>
      <div class="spinnerStyles" v-if="$store.state.spinner.isSpinning">
        <n-spin size="large" :show="$store.state.spinner.isSpinning"/>
      </div>
    <router-view></router-view>
    </n-message-provider>
  </n-config-provider>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { enUS, dateEnUS } from 'naive-ui'
import {mapGetters, mapMutations} from "vuex";

@Options({
  components: {},
  data: function () {
    return {
      enUS: enUS,
      dateEnUS: dateEnUS,
    }
  },
  async created() {
    if (!this.isAuthenticated) {
      localStorage.removeItem("refresh_token");
      this.setAuth(false);
      await this.$router.push('/')
    }
  },
  computed: {
    ...mapGetters({
      isAuthenticated: "auth/GET_IS_AUTHENTICATED"
    })
  },
  methods: {
    ...mapMutations({
      setAuth: "auth/SET_AUTH"
    }),
  }
})

export default class App extends Vue {}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.spinnerStyles {
  position: fixed;
  width: 98%;
  padding-top: 1em;
  display: flex;
  justify-content: right;
}
</style>
