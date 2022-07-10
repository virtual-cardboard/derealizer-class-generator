<template>
  <div>
    <div class="text-white gradient text-center lg:py-40 md:py-32">
      <h1 class="text-3xl">Derealizer Class Generator</h1>
      <h2 class="pb-">Generate serializable Java objects.</h2>
    </div>
    <div class="lg:px-80 md:px-40 py-10">
      <h2 class="text-center p-5">Guide</h2>
      <p>Coming soon...</p>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'HomeView',
}
</script>

<style scoped>
h2 {
  @apply text-xl;
}

.gradient {
  background-color: hsla(197, 100%, 78%, 1);
  background-image:
    radial-gradient(at 1% 74%, hsla(183, 73%, 77%, 1) 0px, transparent 50%),
    radial-gradient(at 17% 75%, hsla(225, 97%, 68%, 1) 0px, transparent 50%),
    radial-gradient(at 87% 25%, hsla(240, 100%, 80%, 1) 0px, transparent 50%),
    radial-gradient(at 44% 25%, hsla(195, 100%, 79%, 1) 0px, transparent 50%),
    radial-gradient(at 34% 87%, hsla(261, 67%, 68%, 1) 0px, transparent 50%),
    radial-gradient(at 80% 61%, hsla(155, 100%, 66%, 1) 0px, transparent 50%);
}
</style>
