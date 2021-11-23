<template>
  <n-config-provider :locale="enUS" :date-locale="dateEnUS">
    <router-view></router-view>
  </n-config-provider>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { enUS, dateEnUS } from 'naive-ui'

@Options({
  components: {},
  data: function () {
    return {
      enUS: enUS,
      dateEnUS: dateEnUS,
    }
  }
})

export default class App extends Vue {}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
