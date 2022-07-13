<template>
	<dropdown v-model="mutableModelValue" :options="typeOptions" option-label="name" :filter="true" />
	<FieldType v-if="this.mutableModelValue && 'parameter' in this.mutableModelValue" v-model="parameter"
		ref="parameterField" />
</template>


<script>
export default {
	props: ['modelValue'],
	emits: ['update:modelValue'],
	data() {
		return {
			mutableModelValue: null,
			parameter: null,
			typeOptions: [
				{ name: 'long' },
				{ name: 'int' },
				{ name: 'short' },
				{ name: 'byte' },
				{ name: 'boolean' },
				{ name: 'double' },
				{ name: 'float' },
				{ name: 'String' },

				{ name: 'List', parameter: null },
				{ name: 'optional', parameter: null },
				{ name: 'obj', parameter: null },
			]
		}
	},
	methods: {
	},
	computed: {

	},
	created() {
		this.mutableModelValue = this.modelValue;
	},
	watch: {
		mutableModelValue(newMutableModelValue) {
			if (this.$refs.parameterField) {
				this.$refs.parameterField.mutableModelValue = null;
			}
			this.$emit('update:modelValue', newMutableModelValue);
		},
		parameter(newParameter) {
			if (this.mutableModelValue) this.mutableModelValue.parameter = newParameter;
		}
	},
}
</script>
