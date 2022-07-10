<template>
	<div class="flex columns-2 p-4 w-full h-screen">
		<div class="flex flex-col w-3/5">
			<div v-for="(def, index) in classDefinitions" :key="index">
				<ClassDefinition :dataProp="def"></ClassDefinition>
			</div>
		</div>
		<div class="flex flex-col w-2/5">
			<ClassCode :class-defs="classDefinitions" class="" />
		</div>
	</div>
</template>

<script>
import ClassDefinition from './ClassDefinition.vue';
import ClassCode from './ClassCode.vue';
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
		ClassDefinition,
		ClassCode
	}
}
</script>


<style scoped>
</style>
