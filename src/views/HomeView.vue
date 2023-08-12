<template>
  <div>
    <div class="text-white gradient text-center lg:py-40 md:py-32">
      <h1 class="text-3xl">Derealizer Class Generator</h1>
      <h2 class="pb-">Generate serializable Java objects.</h2>
    </div>
    <div class="lg:px-80 md:px-40 py-10 leading-loose indent-8">
      <h2 class="text-center p-5 indent-0">About</h2>
      <p>Welcome to the Derealizer Class Generator!</p>
      <p>Derealizer is an open-source library that serializes and deserializes Java objects. It was
        specifically made for sending packets over the network for multiplayer games (see
        <a href="https://github.com/virtual-cardboard/nengen">Nengen</a>), but can also be used for other
        purposes.
      </p>
      <p>This website is for generating boilerplate Java serialization code for projects using Derealizer. Click the
        "Generator" link on the left side panel to start generating code!</p>
      <p>Check out <a href="https://github.com/virtual-cardboard/derealizer">Derealizer's source code</a>, or <a
          href="https://github.com/virtual-cardboard/derealizer-class-generator">this website's source code</a>.</p>
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
  background-image: radial-gradient(at 1% 74%, hsla(183, 73%, 77%, 1) 0px, transparent 50%),
  radial-gradient(at 17% 75%, hsla(225, 97%, 68%, 1) 0px, transparent 50%),
  radial-gradient(at 87% 25%, hsla(240, 100%, 80%, 1) 0px, transparent 50%),
  radial-gradient(at 44% 25%, hsla(195, 100%, 79%, 1) 0px, transparent 50%),
  radial-gradient(at 34% 87%, hsla(261, 67%, 68%, 1) 0px, transparent 50%),
  radial-gradient(at 80% 61%, hsla(155, 100%, 66%, 1) 0px, transparent 50%);
}

a {
  text-decoration: underline;
  cursor: pointer;
}
</style>
