const Util = require('./Util');

class ClassCodeGenerator {
	generateClassCode(enumName, classDefinition) {
		try {
			return Util.convertStringToHTML(this.doGenerateClassCode(enumName, classDefinition));
		} catch (error) {
			console.log(error);
			return null;
		}
	}

	doGenerateClassCode(enumName, classDefinition) {
		if (!classDefinition) return "";
		let s = "";
		s += "import derealizer.format.Serializable;\n";
		s += "import java.util.List;\n\n";
		if (!classDefinition.superClass) {
			s += `public ${classDefinition.abstract ? "abstract " : ""}class ${classDefinition.name} implements Serializable {\n`;
		} // TODO: extend superclasses...
		s += "\n";
		let fields = classDefinition.fields;
		for (const field of fields) {
			s += `	${field.accessMod.code} ${field.transient ? "transient " : ""}${Util.convertTypeToString(field.type)} ${field.name};\n`;
		}
		s += "\n";
		// No-arg constructor
		s += `	public ${classDefinition.name}() {\n`;
		s += "	}\n\n";
		// Constructor
		if (fields.length > 0) {
			s += `	public ${classDefinition.name}(${fields.map(f => Util.convertTypeToString(f.type) + ' ' + f.name).join(', ')}) {\n`;
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
		s += "	@Override\n";
		s += "	public SerializationFormatEnum formatEnum() {\n";
		s += `		return ${enumName};\n`;
		s += "	}\n\n";
		// Read
		s += "	@Override\n";
		s += "	public void read(SerializationReader reader) {\n";
		// TODO: Call super.read if needed
		// if (isImplemented(pojoBaseClass, "read", SerializationReader.class)) {
		//     s += "		super.read(reader);\n";
		// }
		for (const field of fields) {
			if (!field.transient) s += this.toReadMethod(field.name, field.type);
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
			if (!field.transient) s += this.toWriteMethod(field.name, field.type);
		}
		s += "	}\n\n";
		// Getters
		for (const field of fields) {
			s += `	public ${Util.convertTypeToString(field.type)} ${field.name}() {\n`;
			s += `		return ${field.name};\n`;
			s += "	}\n";
			s += "\n";
		}
		s += "}\n";
		return s;
	}

	toReadMethod(name, type, numIndents = 0, variablesCount = 0, listName = null) {
		let indents = "		";
		for (let i = 0; i < numIndents; i++) {
			indents += "	";
		}
		if (listName == null) {
			// Set a field
			switch (type.name) {
				case 'long':
				case 'int':
				case 'short':
				case 'byte':
				case 'boolean':
				case 'double':
				case 'float':
				case 'String':
					return `${indents}this.${name} = reader.read${Util.toProperCase(type.name)}();\n`;
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
					return `${indents}this.${name} = new ${Util.toProperCase(param.name)}();\n` +
							`${indents}this.${name}.read(reader);\n`;
				}
				default:
					console.log(type);
					throw new Error("Unhandled serialization field type: " + type);
			}
		} else {
			// Add something to a list
			switch (type.name) {
				case 'long':
				case 'int':
				case 'short':
				case 'byte':
				case 'boolean':
				case 'double':
				case 'float':
				case 'String':
					return `${indents}${listName}.add(reader.read${Util.toProperCase(type.name)}());\n`;
				case 'List': {
					const param = type.parameter;
					const iterVariable = "i" + variablesCount;
					const numVariable = "size" + variablesCount;
					const newListName = "list" + variablesCount;
					return `${indents}List<${Util.convertPrimitiveToWrapper(param)}> ${newListName} = new ArrayList<>();\n` +
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
					const objVarName = "pojo" + variablesCount;
					return `${indents}${param.name} ${objVarName} = new ${param.name}();\n` +
							`${indents}${objVarName}.read(reader);\n` +
							`${indents}${listName}.add(${objVarName});\n`;
				}
				default:
					throw new Error("Unhandled serialization field type: " + type + "\nCould not add type to list " + listName);
			}
		}
	}

	toWriteMethod(name, type, numIndents = 0, variablesCount = 0) {
		let indents = "		";
		for (let i = 0; i < numIndents; i++) {
			indents += "	";
		}

		switch (type.name) {
			case 'long':
			case 'int':
			case 'short':
			case 'byte':
			case 'boolean':
			case 'double':
			case 'float':
			case 'String':
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
	}


}

module.exports = new ClassCodeGenerator();
