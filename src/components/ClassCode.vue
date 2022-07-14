<template>
	<div class="bg-slate-200 shadow-lg border">
		<TabView>
			<TabPanel v-for="(def, index) in classDefinitions" :key="index" :header="def.name + '.java'">
				<div v-if="def === currentClass" class="bg-slate-300 p-2 m-1 rounded-lg font-mono">
					<div v-html="doGenerateClassCode(def)" id="code"></div>
				</div>
				<div class="flex justify-end mt-4">
					<Button label="Copy to Clipboard" icon="pi pi-copy" class="p-button-outlined p-button-warning"
						@click="copyToClipboard()" />
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
				return "<pre>" + this.generateClassCode(classDefinition).replaceAll('	', '&#9;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('\n', '<br>') + "</pre>";
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
				s += this.toReadMethod(field.name, field.type);
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
				s += this.toWriteMethod(field.name, field.type);
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
			return s;
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
				case 'long': case 'short': case 'byte': case 'boolean': case 'double': case 'float': case 'String':
					return type.name.substring(0, 1).toUpperCase() + type.name.substring(1);
				default:
					return this.convertTypeToString(type);
			}
		},

		toReadMethod(name, type, numIndents = 0, variablesCount = 0, listName = null) {
			let indents = "		";
			for (let i = 0; i < numIndents; i++) {
				indents += "	";
			}
			if (listName == null) {
				// Set a field
				switch (type.name) {
					case 'long': case 'int': case 'short': case 'byte': case 'boolean': case 'double': case 'float': case 'String':
						return `${indents}this.${name} = reader.read${this.toCamelCase(type.name)}();\n`;
					case 'List': {
						const param = type.parameter;
						const iterVariable = "i" + variablesCount;
						const numVariable = "size" + variablesCount;
						let s = `${indents}this.${name} = new ArrayList<>();\n` +
							`${indents}for (byte ${iterVariable} = 0, ${numVariable} = reader.readByte(); ${iterVariable} < ${numVariable}; ${iterVariable}++) {\n` +
							this.toReadMethod(null, param, numIndents + 1, variablesCount + 1, name) +
							indents + "}\n";
						return s;
					}
					case 'optional': {
						const param = type.parameter;
						return indents + "if (reader.readBoolean()) {\n" +
							this.toReadMethod(name, param, numIndents + 1, variablesCount, listName) +
							indents + "}\n";
					}
					case 'obj': {
						const param = type.parameter;
						const objClassName = this.toCamelCase(param.name);
						return `${indents}this.${name} = new ${objClassName}();\n` +
							`${indents}this.${name}.read(reader);\n`;
					}
					default:
						console.log(type);
						throw new Error("Unhandled serialization field type: " + type);
				}
			} else {
				// Add something to a list
				switch (type.name) {
					case 'long': case 'int': case 'short': case 'byte': case 'boolean': case 'double': case 'float': case 'String':
						return `${indents}${listName}.add(reader.read${this.toCamelCase(type.name)}());\n`;
					case 'List': {
						const param = type.parameter;
						const iterVariable = "i" + variablesCount;
						const numVariable = "size" + variablesCount;
						const newListName = "list" + variablesCount;
						return `${indents}List<${this.convertPrimitiveToWrapper(param)}> ${newListName} = new ArrayList<>();\n` +
							`${indents}for (byte ${iterVariable} = 0, ${numVariable} = reader.readByte(); ${iterVariable} < ${numVariable}; ${iterVariable}++) {\n` +
							this.toReadMethod(null, param, numIndents + 1, variablesCount + 1, name) +
							`${indents}}\n` +
							`${indents}${name}.add(${newListName});\n`;
					}
					case 'optional': {
						const param = type.parameter;
						return `${indents}if (reader.readBoolean()) {\n` +
							`${this.toReadMethod(name, param, numIndents + 1, variablesCount, listName)}` +
							`${indents}} else {\n` +
							`${indents}	${listName}.add(null);\n` +
							`${indents}}\n`;
					}
					case 'obj': {
						const param = type.parameter;
						const objClassName = this.toCamelCase(param.name);
						const objVarName = "pojo" + variablesCount;
						return `${indents}${objClassName} ${objVarName} = new ${objClassName}();\n` +
							`${indents}${objVarName}.read(reader);\n` +
							`${indents}${listName}.add(${objVarName});\n`;
					}
					default:
						throw new Error("Unhandled serialization field type: " + type + "\nCould not add type to list " + listName);
				}
			}
		},

		toWriteMethod(name, type, numIndents = 0, variablesCount = 0) {
			let indents = "		";
			for (let i = 0; i < numIndents; i++) {
				indents += "	";
			}

			switch (type.name) {
				case 'long': case 'int': case 'short': case 'byte': case 'boolean': case 'double': case 'float': case 'String':
					return indents + "writer.consume(" + name + ");\n";
				case 'List': {
					const param = type.parameter;
					const iterVariable = "i" + variablesCount;
					return `${indents}writer.consume((byte) ${name}.size());\n` +
						`${indents}for (int ${iterVariable} = 0; ${iterVariable} < ${name}.size(); ${iterVariable}++) {\n` +
						this.toWriteMethod(name + ".get(" + iterVariable + ")", param, numIndents + 1, variablesCount + 1) +
						`${indents}}\n`;
				}
				case 'optional': {
					const param = type.parameter;
					return `${indents}if (${name} == null) {\n` +
						`${indents}	writer.consume(false);\n` +
						`${indents}} else {\n` +
						`${indents}	writer.consume(true);\n` +
						this.toWriteMethod(name, param, numIndents + 1, variablesCount) +
						`${indents}}\n`;
				}
				case 'obj':
					return indents + name + ".write(writer);\n";
				default:
					throw new Error("Unhandled SerializationDataType: " + type.name + "\nCould not interpret data type as a field type.");
			}
		},

		toCamelCase(s) {
			const parts = s.split("_");
			let camelCaseString = "";
			for (const part of parts) {
				camelCaseString += this.toProperCase(part);
			}
			return camelCaseString;
		},

		toProperCase(s) {
			if (!s.trim()) {
				return s;
			}
			return s.substring(0, 1).toUpperCase() + s.substring(1).toLowerCase();
		},
		copyToClipboard() {
			navigator.clipboard.writeText(this.generateClassCode(this.currentClass));
		}
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
