const Util = require('./Util');
const Constants = require('./Constants');

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
        const {
            Derealizable,
            FieldNames,
            SerializationDataType,
            SerializationFormatEnum,
        } = Constants.fullClassPaths;

        // Generate import statements
        let s = `import static ${SerializationDataType}.BOOLEAN;
import static ${SerializationDataType}.BYTE;
import static ${SerializationDataType}.LONG;
import static ${SerializationDataType}.INT;
import static ${SerializationDataType}.SHORT;
import static ${SerializationDataType}.STRING_UTF8;
import static ${SerializationDataType}.optional;
import static ${SerializationDataType}.pojo;
import static ${SerializationDataType}.repeated;

import ${SerializationFormatEnum};
import ${FieldNames};
import ${Derealizable};

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
            "	private final Class<? extends Derealizable> serializableClass;\n";
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
	public short id() {
		return id;
	}
`;
        }

        // Generate serializable class getter
        s += `
	@Override
	public Class<? extends Serializable> serializableClass() {
		return serializableClass;
	}
	
}
`;
        return s;
    }
}

module.exports = new EnumCodeGenerator();
