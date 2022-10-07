<template>
  <div class="flex p-2 w-full overflow-x-clip">
    <div class="flex-1 w-3/5 max-w-[60%] pr-8">
      <div class="m-4">
        <Button :disabled="!$store.state.classDefinitions.length" class="p-button-secondary mr-4" icon="pi pi-upload"
                label="Export"
                @click="exportClasses"/>

        <a id="downloadAnchor" class="hidden" download="classes.json">This is the hidden download anchor.</a>

        <Button class="p-button-secondary mr-4" icon="pi pi-download" label="Import"
                @click="() => this.$refs.uploadInput.click()"/>
        <input ref="uploadInput" accept=".json" class="hidden" type="file" @change="e => parseClassesJsonFile(e)">

      </div>
      <div v-for="(def, index) in $store.state.classDefinitions" :key="`${$store.state.numChanges}-${index}`"
           class="p-4">
        <ClassDefinition :classDef="def" @delete="() => deleteClass(index)"></ClassDefinition>
      </div>
      <Button class="text-[#4caf50] m-4" icon="pi pi-plus" label="New Class" @click="newClass"/>
    </div>
    <div class="flex-1 w-2/5 max-w-[40%] p-1 pb-20">
      <ClassCode/>
      <EnumCode/>
    </div>
  </div>
</template>

<script>
import ClassDefinition from './ClassDefinition.vue';
import ClassCode from './ClassCode.vue';
import EnumCode from "@/components/EnumCode";

export default {
  data() {
    return {
      enumName: 'MySerializationFormats',
      settings: {},
    };
  },
  methods: {
    newClass() {
      this.$store.commit('addClassDefinitions', {
        id: -1,
        accessMod: { name: 'public' },
        abstract: false,
        name: 'NewClass',
        superClass: null,
        fields: []
      });
    },
    deleteClass(index) {
      const classDefinitions = [ ...this.$store.state.classDefinitions ];
      classDefinitions.splice(index, 1);
      this.$store.commit('setClassDefinitions', classDefinitions);

      this.$store.commit('increaseNumChanges');
    },
    exportClasses() {
      const downloadAnchor = document.getElementById("downloadAnchor");

      let json = JSON.stringify({
        enumName: this.enumName,
        classDefinitions: this.$store.state.classDefinitions,
        settings: this.settings,
      });
      downloadAnchor.setAttribute('href', URL.createObjectURL(new Blob([ json ])));
      downloadAnchor.click();
    },
    parseClassesJsonFile(e) {
      const file = e.target.files[0];
      this.$refs.uploadInput.value = null;

      const reader = new FileReader();

      // Clear the class definitions array
      this.$store.commit("setClassDefinitions", []);

      reader.onloadend = () => {
        /**
         * The file contents
         * @type {string}
         */
        const content = reader.result;
        try {
          let parsed = JSON.parse(content);
          this.$store.commit("setClassDefinitions", parsed.classDefinitions);
          this.enumName = parsed.enumName;
          this.settings = parsed.settings;
        } catch (error) {
          alert("Could not import file:\n" + error.toString());
        }
      };
      reader.readAsText(file);
    }
  },
  computed: {
    allAbstractClasses() {
      return this.$store.getters.allClassDefinitions.filter(def => def.abstract);
    },
    duplicateClassName() {
      const names = this.$store.state.classDefinitions.map(def => def.name);
      const seen = {};
      for (const name of names) {
        if (seen[name]) {
          return name;
        }
        seen[name] = 1;
      }
      return null;
    }
  },
  created() {
  },
  components: {
    ClassDefinition,
    ClassCode,
    EnumCode,
  }
}
</script>


<style scoped>
</style>
