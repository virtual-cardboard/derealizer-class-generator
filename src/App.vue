<template>
  <div class="flex columns-2">
    <NavBar></NavBar>
    <div class="flex flex-col w-full">
      <router-view></router-view>
      <Toast/>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/navbar/NavBar.vue";
import Toast from 'primevue/toast';

export default {
  components: {
    NavBar,
    Toast,
  },
}

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
