<template>
	<div class="flex columns-2 p-4 w-full h-full">
		<div class="flex flex-col w-3/5">
			<div v-for="(def, index) in classDefinitions" :key="index">
				<ClassDefinition :dataProp="def"></ClassDefinition>
			</div>
		</div>
		<div class="flex flex-col">
			hello2
		</div>
	</div>
</template>

<script>
import ClassDefinition from './ClassDefinition.vue';
export default {
	data() {
		return {
			classDefinitions: [
				{
					accessMod: { name: 'public', code: 'public' },
					abstract: false,
					name: '',
					superclass: null,
					fields: [
						{
							accessMod: { name: 'private', code: 'private' },
							transient: false,
							type: null,
							name: ''
						},
					]
				}
			]
		};
	},
	components: {
		ClassDefinition
	}
}
</script>


<style scoped>
</style>
