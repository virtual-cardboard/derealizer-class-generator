const Util = require('./Util');

class EnumCodeGenerator {
	generateEnumCode(enumName, classDefinitions) {
		try {
			return Util.convertStringToHTML(this.doGenerateEnumCode(enumName, classDefinitions));
		} catch (error) {
			console.log(error);
			return null;
		}
	}
	doGenerateEnumCode(enumName, classDefinitions) {
		if (!enumName) {
			throw "No enum name";
		}
		const serializationDataTypePath = "derealizer.datatype.SerializationDataType";
		const serializationFormatPath = "derealizer.format.SerializationFormat";
		const serializationFormatEnumPath = "derealizer.format.SerializationFormatEnum";
		const fieldNamesPath = "derealizer.format.FieldNames";
		const serializablePath = "derealizer.format.Serializable";
		let s = "import static " + serializationDataTypePath + ".BOOLEAN;\n" +
			"import static " + serializationDataTypePath + ".BYTE;\n" +
			"import static " + serializationDataTypePath + ".LONG;\n" +
			"import static " + serializationDataTypePath + ".INT;\n" +
			"import static " + serializationDataTypePath + ".SHORT;\n" +
			"import static " + serializationDataTypePath + ".STRING_UTF8;\n" +
			"import static " + serializationDataTypePath + ".optional;\n" +
			"import static " + serializationDataTypePath + ".pojo;\n" +
			"import static " + serializationDataTypePath + ".repeated;\n" +
			"import static " + serializationFormatPath + ".types;\n" +
			"\n" +
			"import " + serializationFormatEnumPath + ";\n" +
			"import " + serializationFormatPath + ";\n" +
			"import " + fieldNamesPath + ";\n" +
			"import " + serializablePath + ";\n" +
			"\n" +
			"public enum " + enumName + " implements SerializationFormatEnum {\n\n";
		for (const classDef of classDefinitions) {
			s += "	" + Util.toSnakeCase(classDef.name) + "();";
		}
		// for (SerializationFormatEnum format : formatEnum.getEnumConstants()) {
		// 	Enum <?> e = (Enum <?>) format;
		// 	Queue < SerializationDataType > dataTypes = format.format().dataTypes();
		// 	s += "	@" + FieldNames.class.getSimpleName() + "({ " + commaify(quotify(getFieldNames(format))) + " })\n";
		// 	s += "	" + e.name() + "(types(" + commaify(dataTypes) + "), " + toCamelCase(e.name()) + ".class),\n";
		// }
		// s += "	;\n" +
		// 	"\n" +
		// 	"	private final " + SerializationFormat.class.getSimpleName() + " format;\n" +
		// 	"	private final Class<? extends " + pojoBaseClass.getSimpleName() + "> pojoClass;\n" +
		// 	"\n" +
		// 	"	private " + formatEnum.getSimpleName() + "(" + SerializationFormat.class.getSimpleName() + " format, Class<? extends " + pojoBaseClass.getSimpleName() + "> pojoClass) {\n" +
		// 	"		this.format = format;\n" +
		// 	"		this.pojoClass = pojoClass;\n" +
		// 	"	}\n" +
		// 	"\n" +
		// 	"	@Override\n" +
		// 	"	public " + SerializationFormat.class.getSimpleName() + " format() {\n" +
		// 	"		return format;\n" +
		// 	"	}\n" +
		// 	"\n" +
		// 	"	@Override\n" +
		// 	"	public Class<? extends " + pojoBaseClass.getSimpleName() + "> pojoClass() {\n" +
		// 	"		return pojoClass;\n" +
		// 	"	}\n\n" +
		// 	"}\n";
		return s;
	}
}

module.exports = new EnumCodeGenerator();
