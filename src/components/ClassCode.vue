<template>
    <div class="bg-slate-200 shadow-lg border">
        <TabView>
            <TabPanel v-for="(def, index) in classDefinitions" :key="index" :header="def.name + '.java'">
                <div class="bg-slate-300 p-2 m-1 rounded-lg font-mono">
                    <div v-html="generateClassCode(def)"></div>
                </div>
                <div class="flex justify-end mt-4">
                    <Button label="Copy to Clipboard" icon="pi pi-copy" @click="newField"
                        class="p-button-outlined p-button-warning" />
                </div>
            </TabPanel>
        </TabView>
    </div>
</template>

<script>
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

export default {
    props: {
        classDefs: { type: Array, required: true }
    },
    data() {
        return {
            classDefinitions: null,
            currentClass: null,
        }
    },
    methods: {
        generateClassCode() {
            return `Hi!!`;
        },
    },
    created() {
        this.classDefinitions = this.classDefs;
        this.currentClass = this.classDefinitions.length ? this.classDefinitions[0] : null;
    },
    components: {
        TabView, TabPanel
    }
}
</script>
