<template>
  <div>
    <dropdown v-model="classDefinition.accessMod" :options="classAccessModOptions" option-label="name"/>
    <span class="field-checkbox">
			<checkbox id="abstractCheckbox" v-model="classDefinition.abstract"
                :binary="true"/>
			<label for="abstractCheckbox">Abstract</label>
		</span>
    <input-text v-model="classDefinition.name" :class="!classDefinition.name && 'p-invalid'" placeholder="Name"/>
    <dropdown v-model="classDefinition.superClass" :filter="true"
              :options="$store.getters.allAbstractClasses" :showClear="true"
              filterPlaceholder="Find..." option-label="name" placeholder="Superclass (optional)"/>

    <Button class="p-button-plain p-button-rounded p-button-text float-right" icon="pi pi-times"
            @click="$emit('delete')"/>

    <div class="border-l-2 border-gray-400 pl-4 p-1 ml-4">
      <div v-for="(field, index) in classDefinition.fields" :key="field.accessMod.name + index" class="m-1 my-2">
        <dropdown v-model="field.accessMod" :options="accessModOptions" option-label="name"/>
        <checkbox id="transientCheckbox" v-model="field.transient" :binary="true"/>
        <label for="transientCheckbox">Transient </label>
        <FieldType v-model="field.type"/>
        <input-text v-model="field.name" :class="!field.name && 'p-invalid'" placeholder="Name"/>
        <Button class="p-button-plain p-button-rounded p-button-text" icon="pi pi-times" @click="deleteField(index)"/>
      </div>
      <Button class="text-[#4caf50] m-2" icon="pi pi-plus" label="New Field" @click="newField"/>
    </div>
  </div>
</template>


<script>
import FieldType from './FieldType.vue';

export default {
  props: {
    classDef: { type: Object, required: true },
  },
  emits: ['delete'],
  data() {
    return {
      classDefinition: null,
      classAccessModOptions: [
        { name: 'private' },
        { name: 'public' },
        { name: 'package-private' }
      ],
      accessModOptions: [
        { name: 'private' },
        { name: 'public' },
        { name: 'protected' },
        { name: 'package-private' }
      ]
    };
  },
  methods: {
    newField() {
      this.classDefinition.fields.push({
        accessMod: this.accessModOptions[0],
        transient: false,
        type: { name: 'int' },
        name: ''
      })
    },
    deleteField(index) {
      this.classDefinition.fields.splice(index, 1);
    }
  },
  created() {
    this.classDefinition = this.classDef;
  },
  watch: {
    classDefinition() {
      if (this.classDefinition.abstract) {
        this.classDefinition.superClass = null;
      }
    }
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
