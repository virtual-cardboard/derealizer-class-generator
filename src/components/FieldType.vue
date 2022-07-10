<template>
	<dropdown :modelValue="modelValue" @change="change($event)" :options="typeOptions" option-label="name"
		:filter="true" />
	<FieldType v-if="modelValue && modelValue.parameter" v-model="parameter" />
</template>


<script>
export default {
	props: ['modelValue'],
	emits: ['update:modelValue'],
	data() {
		return {
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

				{ name: 'repeated', parameter: true },
				{ name: 'optional', parameter: true },
				{ name: 'obj', parameter: true },
			]
		}
	},
	methods: {
		change(event) {
			this.$emit('update:modelValue', event.value);
		}
	},
}
</script>
