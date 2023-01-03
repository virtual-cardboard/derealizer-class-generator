<template>
  <div class="sticky top-0 left-0 h-screen bg-gray-500 text-white p-2">
    <div class="justify-center items-center p-1">
      <button @click="collapse" :class="`flex justify-center content-center transition-all hover:bg-green-400 p-3 rounded-full`">
        <font-awesome-icon icon="fa-solid fa-bars"/>
      </button>
    </div>
    <div :class="`${open ? 'hidden' : 'block'}`">
      <NavButton icon="home" to="/">Home</NavButton>
      <NavButton icon="gears" to="/generate">Generator</NavButton>
    </div>
  </div>
</template>


<script>
import NavButton from "./NavButton.vue";

export default {
  components: {
    NavButton,
  },
  data() {
    return {
      open: false
    }
  },
  methods: {
    collapse() {
      this.open = !this.open;
    },
  }
}
</script>