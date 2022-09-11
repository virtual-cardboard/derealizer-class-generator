<template>
  <dropdown v-model="mutableModelValue" :options="typeOptions" filter option-label="name"/>
  <FieldType v-if="showParameter" ref="parameterField" v-model="parameter"/>
  <dropdown v-else-if="showObjDropdown" v-model="mutableModelValue.parameter"
            :options="$store.getters.allClassDefinitions" filter option-label="name"/>
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
  methods: {},
  computed: {
    showParameter() {
      return this.mutableModelValue && 'parameter' in this.mutableModelValue && this.mutableModelValue.name !== "obj";
    },
    showObjDropdown() {
      return this.mutableModelValue && 'parameter' in this.mutableModelValue && this.mutableModelValue.name === "obj";
    },
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
