<template>
    <div class="bg-slate-200 shadow-lg border">
        <TabView>
            <TabPanel v-for="(def, index) in classDefinitions" :key="index" :header="def.name + '.java'">
                <div v-if="def === currentClass" class="bg-slate-300 p-2 m-1 rounded-lg font-mono">
                    <div v-html="doGenerateClassCode(def)" id="code"></div>
                </div>
                <div class="flex justify-end mt-4">
                    <Button label="Copy to Clipboard" icon="pi pi-copy" class="p-button-outlined p-button-warning" />
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
        doGenerateClassCode(classDefinition) {
            try {
                return this.generateClassCode(classDefinition);
            } catch (error) {
                console.log(error);
                return 'Waiting for user input...';
            }
        },
        generateClassCode(classDefinition) {
            if (!classDefinition) return "";
            let s = "";
            // s += formatEnum.getClass().getPackage() + ".pojo;\n\n";
            // s += "import static " + formatEnum.getClass().getName() + "." + e.name() + ";\n\n";
            s += "import derealizer.format.Serializable;\n";
            s += "import java.util.List;\n\n";
            if (!classDefinition.superClass) {
                s += `public class ${classDefinition.name} implements Serializable {\n`;
            } // TODO: extend superclasses...
            s += "\n";
            let fields = classDefinition.fields;
            for (const field of fields) {
                s += `	${field.accessMod.code} ${this.convertTypeToString(field.type)} ${field.name};\n`;
            }
            s += "\n";
            // No-arg constructor
            s += `	public ${classDefinition.name}() {\n`;
            s += "	}\n\n";
            // Constructor
            if (fields.length > 0) {
                s += `	public ${classDefinition.name}(${fields.map(f => this.convertTypeToString(f.type) + ' ' + f.name).join(', ')}) {\n`;
                for (const field of fields) {
                    s += `		this.${field.name} = ${field.name};\n`;
                }
                s += "	}\n";
            }
            // byte[] Constructor
            s += "\n";
            s += `	public ${classDefinition.name}(byte[] bytes) {\n`;
            s += "		read(new SerializationReader(bytes));\n";
            s += "	}\n\n";
            // TODO: Format enum getter
            // s += "	@Override\n";
            // s += "	public " + formatEnum.getClass().getSimpleName() + " formatEnum() {\n";
            // s += "		return " + e.name() + ";\n";
            // s += "	}\n\n";
            // Read
            s += "	@Override\n";
            s += "	public void read(SerializationReader reader) {\n";
            // TODO: Call super.read if needed
            // if (isImplemented(pojoBaseClass, "read", SerializationReader.class)) {
            //     s += "		super.read(reader);\n";
            // }
            for (const field of fields) {
                // TODO: Make a toReadMethod() function
                s += this.toReadMethod(field);
            }
            s += "	}\n\n";
            // Write
            s += "	@Override\n";
            s += "	public void write(SerializationWriter writer) {\n";
            // TODO: Call super.write if needed
            // if (isImplemented(pojoBaseClass, "write", SerializationWriter.class)) {
            //     s += "		super.write(writer);\n";
            // }
            for (const field of fields) {
                // TODO: Make a toWriteMethod() function
                s += this.toWriteMethod(field);
            }
            s += "	}\n\n";
            // Getters
            for (const field of fields) {
                s += `	public ${this.convertTypeToString(field.type)} ${field.name}() {\n`;
                s += `		return ${field.name};\n`;
                s += "	}\n";
                s += "\n";
            }
            s += "}\n";
            return "<pre>" + s.replaceAll('	', '&#9;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('\n', '<br>') + "</pre>";
        },
        convertTypeToString(type) {
            if (type.name === 'List') {
                return `List<${type.parameter ? this.convertPrimitiveToWrapper(type.parameter) : 'Object'}>`;
            }
            else if (type.name === 'optional') return this.convertPrimitiveToWrapper(type.parameter);
            else if (type.name === 'obj') return type.parameter.name || 'Object';
            else return type.name;
        },
        convertPrimitiveToWrapper(type) {
            switch (type.name) {
                case 'int':
                    return 'Integer';
                case 'long': case 'short': case 'byte': case 'boolean': case 'double': case 'float':
                    return type.name.substring(0, 1).toUpperCase() + type.name.substring(1);
                default:
                    return this.convertTypeToString(type);
            }
        },
        toReadMethod(field, /* numIndents = 0, variablesCount = 0, listName = null */) {
            return `		<readMethod for ${field.name}>\n`;
        },
        toWriteMethod(field, /* numIndents = 0, variablesCount = 0, listName = null */) {
            return `		<writeMethod for ${field.name}>\n`;
        },
    },
    created() {
        this.classDefinitions = this.classDefs;
        this.currentClass = this.classDefinitions ? this.classDefinitions[0] : null;
    },
    components: {
        TabView, TabPanel
    }
}
</script>

<style scoped>
</style>
