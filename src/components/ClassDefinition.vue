<template>
	<div>
		<dropdown v-model="data.accessMod" :options="accessModOptions" option-label="name" />
		<span class="field-checkbox">
			<checkbox v-model="data.abstract" id="abstractCheckbox" :binary="true" />
			<label for="abstractCheckbox">Abstract</label>
		</span>
		<input-text v-model="data.name" placeholder="Name" />

		<Button icon="pi pi-times" class="p-button-plain p-button-rounded p-button-text float-right"
			@click="$emit('delete')" />

		<div class="border-l-2 border-gray-400 pl-4 p-1 ml-4">
			<div v-for="(field, index) in data.fields" :key="index" class="m-1 my-2">
				<dropdown v-model="field.accessMod" :options="accessModOptions" option-label="name" />
				<checkbox id="transientCheckbox" v-model="field.transient" :binary="true" />
				<label for="transientCheckbox">Transient </label>
				<FieldType v-model="field.type" />
				<input-text v-model="field.name" placeholder="Name" />
				<Button icon="pi pi-times" class="p-button-plain p-button-rounded p-button-text" />
			</div>
			<Button label="New Field" icon="pi pi-plus" @click="newField" class="text-[#4caf50] m-2" />
		</div>
	</div>
</template>


<script>
import FieldType from './FieldType.vue';

export default {
	props: {
		dataProp: Object,
	},
	emits: ['delete'],
	data() {
		return {
			data: null,
			accessModOptions: [
				{ name: 'private', code: 'private' },
				{ name: 'public', code: 'public' },
				{ name: 'protected', code: 'protected' },
				{ name: 'package-private', code: '' }
			]
		};
	},
	methods: {
		newField() {
			this.data.fields.push({
				accessMod: { name: 'private', code: 'private' },
				transient: false,
				type: null,
				name: ''
			})
		},
	},
	created() {
		this.data = this.dataProp;
	},
	computed: {
		console: () => console
	},
	components: {
		FieldType,
	},
}
</script>


<style scoped>
label {
	@apply mr-1;
}

.p-inputtext {
	@apply mx-1;
}

.p-checkbox {
	@apply mb-2.5 mx-1;
}

.p-dropdown {
	@apply mx-1 rounded-md;
}
</style>
