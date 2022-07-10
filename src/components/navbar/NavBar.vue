<template>
	<nav class="sticky top-0 h-screen w-60 flex flex-col
		bg-gray-500 text-white p-2">
		<div class="flex justify-center items-center m-2">
			<div class="w-10 h-10 rounded-full flex justify-center items-center
			hover:bg-green-400 active:bg-green-500 cursor-pointer transition-all">
				<font-awesome-icon icon="fa-solid fa-bars" />
			</div>
		</div>
		<NavButton to="/" icon="home">Home</NavButton>
		<NavButton to="/generate" icon="gears">Generator</NavButton>
	</nav>
</template>


<script>
import NavButton from "./NavButton.vue";

export default {
	components: {
		NavButton,
	}
}

</script>
