<template>
	<div class="flex columns-2 p-4 w-full h-screen">
		<div class="flex flex-col w-3/5 pr-8">
			<div class="m-4">
				<Button label="Export" icon="pi pi-download" @click="exportClasses" :disabled="!classDefinitions.length"
					class="p-button-secondary" />
				<a id="downloadAnchor" class="hidden" download="classes.json">This is the hidden download anchor.</a>
			</div>
			<div v-for="(def, index) in classDefinitions" :key="index" class="p-4">
				<ClassDefinition :dataProp="def" @delete="deleteClass(def)"></ClassDefinition>
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
				name: 'NewClass',
				superClass: '',
				fields: []
			});
		},
		deleteClass(def) {
			this.classDefinitions = this.classDefinitions.filter(d => d !== def);
		},
		exportClasses() {
			const downloadAnchor = document.getElementById("downloadAnchor");

			downloadAnchor.setAttribute('href', URL.createObjectURL(new Blob([JSON.stringify(this.classDefinitions)])));
			downloadAnchor.click();
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
