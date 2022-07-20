<template>
	<div v-if="classDefinitions.length" class="decorate">
		<TabView v-model:activeIndex="activeIndex" scrollable>
			<TabPanel :header="enumName + '.java'">
				<div class="code-container">
					<div v-html="EnumCodeGenerator.generateEnumCode(enumName, classDefinitions, settings) ||
						'Incomplete class definitions'"></div>
				</div>
				<div v-if="EnumCodeGenerator.generateEnumCode(enumName, classDefinitions, settings)"
						 class="flex justify-end mt-4">
					<Button class="p-button-outlined p-button-warning" icon="pi pi-copy" label="Copy to Clipboard"
									@click="Util.copyToClipboard(EnumCodeGenerator.doGenerateEnumCode(enumName, classDefinitions, settings))"/>
				</div>
			</TabPanel>
			<TabPanel v-for="(def, index) in classDefinitions" :key="index" :header="def.name + '.java'">
				<div class="code-container">
					<div v-html="ClassCodeGenerator.generateClassCode(enumName, def) || 'Incomplete class definition'"></div>
				</div>
				<div v-if="ClassCodeGenerator.generateClassCode(enumName, def)" class="flex justify-end mt-4">
					<Button class="p-button-outlined p-button-warning" icon="pi pi-copy" label="Copy to Clipboard"
									@click="Util.copyToClipboard(ClassCodeGenerator.doGenerateClassCode(enumName, def))"/>
				</div>
			</TabPanel>
		</TabView>
	</div>
	<div v-else class="border-0 decorate gradient-1">
		<div class="p-20 text-center text-2xl">
			You have no classes yet.<br/>
			Click "New Class" to create one!
		</div>
	</div>
	<div v-if="abstractClasses.length" class="decorate my-4">
		<TabView scrollable>
			<TabPanel v-for="(def, index) in abstractClasses" :key="index" :header="def.name + 'Serializer.java'">
				<div class="code-container">
					<div
						v-html="AbstractClassSerializerCodeGenerator.generateAbstractClassSerializerCode(enumName, def) || 'Incomplete class definition'"></div>
				</div>
				<div v-if="AbstractClassSerializerCodeGenerator.generateAbstractClassSerializerCode(enumName, def)"
						 class="flex justify-end mt-4">
					<Button class="p-button-outlined p-button-warning" icon="pi pi-copy" label="Copy to Clipboard"
									@click="Util.copyToClipboard(AbstractClassSerializerCodeGenerator.doGenerateAbstractClassSerializerCode(enumName, def))"/>
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
import AbstractClassSerializerCodeGenerator from '@/scripts/AbstractClassSerializerCodeGenerator';
import Util from '@/scripts/Util';

export default {
	props: {
		classDefs: {type: Array, required: true},
		enumName: {type: String, required: true},
		settings: {type: Object, required: true},
	},
	data() {
		return {
			classDefinitions: null,
			activeIndex: 0,
			ClassCodeGenerator: ClassCodeGenerator,
			EnumCodeGenerator: EnumCodeGenerator,
			AbstractClassSerializerCodeGenerator: AbstractClassSerializerCodeGenerator,
			Util: Util,
		}
	},
	computed: {
		abstractClasses() {
			return this.classDefs.filter(def => def.abstract);
		},
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

.code-container {
	@apply bg-slate-300 p-2 m-1 rounded-lg font-mono md:max-h-80 lg:max-h-[500px] overflow-auto;
}

.gradient-1 {
	background-color: hsla(0, 0%, 100%, 1);
	background-image: radial-gradient(at 0% 100%, hsla(333, 100%, 90%, 1) 0px, transparent 50%),
	radial-gradient(at 83% 0%, hsla(196, 65%, 62%, 1) 0px, transparent 50%),
	radial-gradient(at 69% 100%, hsla(222, 100%, 71%, 1) 0px, transparent 50%),
	radial-gradient(at 23% 0%, hsla(160, 100%, 68%, 1) 0px, transparent 50%);
}

.decorate {
	@apply shadow-2xl rounded-lg overflow-clip;
}

</style>
