<template>
	<div class="bg-slate-200 shadow-lg border">
		<TabView v-model:activeIndex="activeIndex" scrollable>
			<TabPanel v-for="(def, index) in classDefinitions" :key="index" :header="def.name + '.java'">
				<div class="bg-slate-300 p-2 m-1 rounded-lg font-mono">
					<div v-html="ClassCodeGenerator.generateClassCode(def) || 'Incomplete class definition'" id="code"></div>
				</div>
				<div v-if="ClassCodeGenerator.generateClassCode(def)" class="flex justify-end mt-4">
					<Button label="Copy to Clipboard" icon="pi pi-copy" class="p-button-outlined p-button-warning"
						@click="ClassCodeGenerator.copyToClipboard()" />
				</div>
			</TabPanel>
		</TabView>
	</div>
</template>

<script>
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import ClassCodeGenerator from '@/scripts/ClassCodeGenerator';

export default {
	props: {
		enumName: { type: String, required: true },
		classDefs: { type: Array, required: true }
	},
	data() {
		return {
			classDefinitions: null,
			activeIndex: 0,
			ClassCodeGenerator: ClassCodeGenerator
		}
	},
	methods: {
	},
	created() {
		this.classDefinitions = this.classDefs;
	},
	watch: {
		classDefs() {
			this.classDefinitions = this.classDefs;
		}
	},
	components: {
		TabView, TabPanel
	}
}
</script>

<style scoped>
</style>
