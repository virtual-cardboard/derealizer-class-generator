<template>
	<div class="bg-slate-200 shadow-lg border">
		<TabView v-model:activeIndex="activeIndex" scrollable>
			<TabPanel :header="enumName + '.java'">
				<div class="bg-slate-300 p-2 m-1 rounded-lg font-mono">
					<div
						id="code"
						v-html="EnumCodeGenerator.generateEnumCode(enumName, classDefinitions, settings) || 'Incomplete class definition'"></div>
				</div>
				<div v-if="EnumCodeGenerator.generateEnumCode(enumName, classDefinitions, settings)"
						 class="flex justify-end mt-4">
					<Button class="p-button-outlined p-button-warning" icon="pi pi-copy" label="Copy to Clipboard"
									@click="Util.copyToClipboard(EnumCodeGenerator.doGenerateEnumCode(enumName, classDefinitions, settings))"/>
				</div>
			</TabPanel>
			<TabPanel v-for="(def, index) in classDefinitions" :key="index" :header="def.name + '.java'">
				<div class="bg-slate-300 p-2 m-1 rounded-lg font-mono">
					<div id="code"
							 v-html="ClassCodeGenerator.generateClassCode(enumName, def) || 'Incomplete class definition'"></div>
				</div>
				<div v-if="ClassCodeGenerator.generateClassCode(enumName, def)" class="flex justify-end mt-4">
					<Button class="p-button-outlined p-button-warning" icon="pi pi-copy" label="Copy to Clipboard"
									@click="Util.copyToClipboard(ClassCodeGenerator.doGenerateClassCode(enumName, def))"/>
				</div>
			</TabPanel>
		</TabView>
	</div>
</template>

<script>
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import ClassCodeGenerator from '@/scripts/ClassCodeGenerator';
import EnumCodeGenerator from '@/scripts/EnumCodeGenerator';
import Util from '@/scripts/Util';

export default {
	props: {
		enumName: {type: String, required: true},
		classDefs: {type: Array, required: true},
		settings: {type: Object, required: true},
	},
	data() {
		return {
			classDefinitions: null,
			activeIndex: 0,
			ClassCodeGenerator: ClassCodeGenerator,
			EnumCodeGenerator: EnumCodeGenerator,
			Util: Util,
		}
	},
	methods: {},
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
