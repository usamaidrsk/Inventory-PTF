<template>
  <n-space vertical size="large">
    <navigation />
    <n-layout has-sider>
      <side-menu />
      <n-layout-content content-style="height: 87vh;">
        <div style="height: 100%; width: 100%;">
          <router-view></router-view>
        </div>
      </n-layout-content>
    </n-layout>
  </n-space>
</template>

<script>
import {Options, Vue} from "vue-class-component";
import SideMenu from "../../components/SideMenu";
import Navigation from "../../components/Navigation";

@Options({
  components: {Navigation, SideMenu}
})

export default class Dashboard extends Vue {}
</script>

<style scoped>

</style>
