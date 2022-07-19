const Util = require('./Util');

class ClassCodeGenerator {
	generateClassCode(classDefinition) {
		try {
			return Util.convertStringToHTML(this.doGenerateClassCode(classDefinition));
		} catch (error) {
			console.log(error);
			return null;
		}
	}
	doGenerateClassCode(classDefinition) {
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
			s += `	${field.accessMod.code} ${Util.convertTypeToString(field.type)} ${field.name};\n`;
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
	}
}

module.exports = new ClassCodeGenerator();
