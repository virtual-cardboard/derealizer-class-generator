class Util {
	convertStringToHTML(s) {
		return "<pre class='whitespace-pre-wrap'>" +
			s.replaceAll('	', '&#9;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('\n', '<br>') + "</pre>";
	}
	convertTypeToString(type) {
		if (type.name === 'List') {
			return `List<${type.parameter ? this.convertPrimitiveToWrapper(type.parameter) : 'Object'}>`;
		}
		else if (type.name === 'optional') return this.convertPrimitiveToWrapper(type.parameter);
		else if (type.name === 'obj') return type.parameter.name;
		else return type.name;
	}
	convertPrimitiveToWrapper(type) {
		switch (type.name) {
			case 'int':
				return 'Integer';
			case 'long': case 'short': case 'byte': case 'boolean': case 'double': case 'float': case 'String':
				return type.name.substring(0, 1).toUpperCase() + type.name.substring(1);
			default:
				return this.convertTypeToString(type);
		}
	}
}

module.exports = new Util();
