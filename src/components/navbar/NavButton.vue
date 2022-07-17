<template>
	<router-link :to="to">
		<div
			class="rounded-md hover:bg-green-400 active:bg-green-500 p-1 m-1 w-aut cursor-pointer transition-all text-white">
			<font-awesome-icon :icon="['fas', icon]" class="mx-2" />
			<slot>REPLACEME</slot>
		</div>
	</router-link>

</template>


<script>

export default {
	props: {
		to: String,
		icon: String,
	},
}

</script>

<style scoped>
a {
	text-decoration: none;
}
</style>
