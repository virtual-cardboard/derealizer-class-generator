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
        const classPaths = Constants.fullClassPaths;
        const {
            Derealizable,
            // FieldNames,
            // SerializationDataType,
            // SerializationFormatEnum,
        } = Constants.classes;

        // Generate import statements
        let s = `import static ${classPaths.SerializationDataType}.BOOLEAN;
import static ${classPaths.SerializationDataType}.BYTE;
import static ${classPaths.SerializationDataType}.LONG;
import static ${classPaths.SerializationDataType}.INT;
import static ${classPaths.SerializationDataType}.SHORT;
import static ${classPaths.SerializationDataType}.STRING_UTF8;
import static ${classPaths.SerializationDataType}.optional;
import static ${classPaths.SerializationDataType}.pojo;
import static ${classPaths.SerializationDataType}.repeated;

import ${classPaths.SerializationFormatEnum};
import ${classPaths.FieldNames};
import ${classPaths.Derealizable};

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
            `	private final Class<? extends ${Derealizable}> derealizableClass;\n`;
        if (settings.id) {
            s += "	private final short id;\n";
        }

        // Generate constructor
        if (settings.id) {
            s += `
	${enumName}(short id, Class<? extends ${Derealizable}> derealizableClass) {
		this.id = id;
		this.derealizableClass = derealizableClass;
	}
`;
        } else {
            s += `
	${enumName}(Class<? extends ${Derealizable}> derealizableClass) {
		this.derealizableClass = derealizableClass;
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

        // Generate derealizable class getter
        s += `
	@Override
	public Class<? extends ${Derealizable}> derealizableClass() {
		return derealizableClass;
	}
	
}
`;
        return s;
    }
}

module.exports = new EnumCodeGenerator();
