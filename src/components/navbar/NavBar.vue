<template>
  <div class="sticky top-0 h-screen w-60 min-w-[60px] bg-gray-500 text-white p-2">
    <div class="justify-center items-center m-2">
      <div class="w-10 h-10 rounded-full justify-center items-center
			hover:bg-green-400 active:bg-green-500 cursor-pointer transition-all">
        <font-awesome-icon icon="fa-solid fa-bars"/>
      </div>
    </div>
    <NavButton icon="home" to="/">Home</NavButton>
    <NavButton icon="gears" to="/generate">Generator</NavButton>
  </div>
</template>


<script>
import NavButton from "./NavButton.vue";

export default {
  components: {
    NavButton,
  }
}

</script>
