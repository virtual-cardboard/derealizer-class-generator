const Util = require('./Util');
const Constants = require('./Constants');

class EnumCodeGenerator {
  generateEnumCode(classDefinition, classDefinitions) {
    try {
      const str = this.doGenerateEnumCode(classDefinition, classDefinitions);
      const indexOfImportantPart = str.indexOf("public enum");
      return Util.convertStringToHTML(str.substring(0, 7) + "...\n\n" + str.substring(indexOfImportantPart));
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  doGenerateEnumCode(classDefinition, classDefinitions) {
    const enumName = classDefinition.name + "Enum";
    const classPaths = Constants.fullClassPaths;
    const {
      Derealizable,
      DerealizerEnum,
    } = Constants.classes;

    // Generate import statements
    let s = `
import ${classPaths.Derealizable};
import ${classPaths.DerealizerEnum};

public enum ${enumName} implements ${DerealizerEnum} {

`;

    // Generate enum values
    for (const classDef of classDefinitions) {
      if (classDef.superClass === classDefinition) {
        if (classDef.abstract) {
          s += `	${Util.toSnakeCase(classDef.name)}(${classDef.name}.class, ${classDef.name}Enum.class),\n`;
        } else {
          s += `	${Util.toSnakeCase(classDef.name)}(${classDef.name}.class),\n`;
        }
      }
    }

    s += `	;

	private final Class<? extends ${Derealizable}> objClass;
	private final Class<? extends ${DerealizerEnum}> derealizerEnum;

	${enumName}(Class<? extends ${Derealizable}> objClass) {
		this(objClass, null);
	}

	${enumName}(Class<? extends ${Derealizable}> objClass, Class<? extends ${DerealizerEnum}> derealizerEnum) {
		this.objClass = objClass;
		this.derealizerEnum = derealizerEnum;
	}

	@Override
	public Class<? extends ${Derealizable}> objClass() {
		return objClass;
	}

	@Override
	public Class<? extends ${DerealizerEnum}> derealizerEnum() {
		return derealizerEnum;
	}

}`;

    return s;
  }
}

module.exports = new EnumCodeGenerator();
