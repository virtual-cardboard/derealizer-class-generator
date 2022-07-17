<template>
	<div class="flex columns-2 p-4 w-full h-screen">
		<div class="flex flex-col w-3/5 pr-8">
			<div v-for="(def, index) in classDefinitions" :key="index" class="p-4">
				<ClassDefinition :dataProp="def" @delete="() => deleteClass(def)"></ClassDefinition>
			</div>
			<Button label="New Class" icon="pi pi-plus" @click="newClass" class="text-[#4caf50] m-4" />
		</div>
		<div v-if="classDefinitions.length" class="flex flex-col w-2/5">
			<ClassCode :classDefs="classDefinitions" />
		</div>
	</div>
</template>

<script>
import ClassDefinition from './ClassDefinition.vue';
import ClassCode from './ClassCode.vue';
export default {
	data() {
		return {
			classDefinitions: []
		};
	},
	methods: {
		newClass() {
			this.classDefinitions.push({
				accessMod: { name: 'public', code: 'public' },
				abstract: false,
				name: '',
				superClass: '',
				fields: [
					{
						accessMod: { name: 'private', code: 'private' },
						transient: false,
						type: null,
						name: ''
					},
				]
			});
		},
		deleteClass(def) {
			this.classDefinitions = this.classDefinitions.filter(d => d !== def);
		}
	},
	components: {
		ClassDefinition,
		ClassCode
	}
}
</script>


<style scoped>
</style>
