<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
import {Options, Vue} from "vue-class-component";

@Options({
  name: "Index",
  data: function () {
    return {

    }
  }
})
export default class Settings extends Vue {}
</script>

<style scoped>

</style>