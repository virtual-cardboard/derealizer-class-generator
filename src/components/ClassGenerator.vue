<template>
	<div class="flex columns-2 p-4 w-full h-screen">
		<div class="flex flex-col w-3/5 pr-8">
			<div class="m-4">
				<Button label="Export" icon="pi pi-download" @click="exportClasses" :disabled="!classDefinitions.length"
					class="p-button-secondary mr-4" />

				<a id="downloadAnchor" class="hidden" download="classes.json">This is the hidden download anchor.</a>

				<Button label="Import" icon="pi pi-upload" @click="() => this.$refs.uploadInput.click()"
					class="p-button-secondary mr-4" />
				<input ref="uploadInput" type="file" accept=".json" @change="e => parseClassesJsonFile(e)" class="hidden">

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
		},
		parseClassesJsonFile(e) {
			if (!e.target.files.length) {
				return;
			}
			const file = e.target.files[0];
			const reader = new FileReader();
			reader.readAsText(file, 'UTF-8');

			reader.onLoad = readerEvent => {
				var content = readerEvent.target.result;
				try {
					this.classDefinitions = JSON.parse(content);
				} catch (error) {
					alert(error.toString());
				}
			}
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
