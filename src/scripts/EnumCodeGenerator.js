const Util = require('./Util');

class EnumCodeGenerator {
	generateEnumCode(enumName, classDefinitions, settings) {
		try {
			const str = this.doGenerateEnumCode(enumName, classDefinitions, settings);
			const indexOfImportantPart = str.indexOf("public enum");
			return Util.convertStringToHTML(str.substring(0, 7) + "...\n\n" + str.substring(indexOfImportantPart));
		} catch (error) {
			console.log(error);
			return null;
		}
	}

	doGenerateEnumCode(enumName, classDefinitions, settings) {
		if (!enumName) {
			throw "No enum name";
		}
		const serializationDataTypePath = "derealizer.datatype.SerializationDataType";
		const serializationFormatEnumPath = "derealizer.format.SerializationFormatEnum";
		const fieldNamesPath = "derealizer.format.FieldNames";
		const serializablePath = "derealizer.format.Serializable";

		// Generate import statements
		let s = `import static ${serializationDataTypePath}.BOOLEAN;
import static ${serializationDataTypePath}.BYTE;
import static ${serializationDataTypePath}.LONG;
import static ${serializationDataTypePath}.INT;
import static ${serializationDataTypePath}.SHORT;
import static ${serializationDataTypePath}.STRING_UTF8;
import static ${serializationDataTypePath}.optional;
import static ${serializationDataTypePath}.pojo;
import static ${serializationDataTypePath}.repeated;

import ${serializationFormatEnumPath};
import ${fieldNamesPath};
import ${serializablePath};

public enum ${enumName} implements SerializationFormatEnum {

`;

		// Generate enum values
		for (const classDef of classDefinitions) {
			if (settings.id) {
				s += `	${Util.toSnakeCase(classDef.name)}(${classDef.id}, ${classDef.name}.class),\n`;
			} else {
				s += `	${Util.toSnakeCase(classDef.name)}(${classDef.name}.class),\n`;
			}
		}

		// Generate fields
		s += "	;\n\n" +
				"	private final Class<? extends Serializable> serializableClass;\n";
		if (settings.id) {
			s += "	private final short id;\n";
		}

		// Generate constructor
		if (settings.id) {
			s += `
	${enumName}(short id, Class<? extends Serializable> serializableClass) {
		this.id = id;
		this.serializableClass = serializableClass;
	}
`;
		} else {
			s += `
	${enumName}(Class<? extends Serializable> serializableClass) {
		this.serializableClass = serializableClass;
	}
`;
		}

		// Generate id getter if needed
		if (settings.id) {
			s += `
	@Override
	public short getId() {
		return id;
	}
`;
		}

		// Generate serializable class getter
		s += `
	@Override
	public Class<? extends Serializable> getSerializableClass() {
		return serializableClass;
	}
	
}
`;
		return s;
	}
}

module.exports = new EnumCodeGenerator();
