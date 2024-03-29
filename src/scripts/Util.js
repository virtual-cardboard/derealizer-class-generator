class Util {
  convertStringToHTML(s) {
    // return "<pre class='whitespace-pre-wrap'>" +
    // 	s.replaceAll('	', '&#9;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('\n', '<br>') + "</pre>";
    return s;
  }

  convertTypeToString(type) {
    if (type.name === 'List') {
      return `List<${type.parameter ? this.convertPrimitiveToWrapper(type.parameter) : 'Object'}>`;
    } else if (type.name === 'optional') return this.convertPrimitiveToWrapper(type.parameter);
    else if (type.name === 'obj') return type.parameter.name;
    else return type.name;
  }

  convertPrimitiveToWrapper(type) {
    switch (type.name) {
      case 'int':
        return 'Integer';
      case 'long':
      case 'short':
      case 'byte':
      case 'boolean':
      case 'double':
      case 'float':
      case 'String':
        return type.name.substring(0, 1).toUpperCase() + type.name.substring(1);
      default:
        return this.convertTypeToString(type);
    }
  }

  copyToClipboard(text, toast) {
    navigator.clipboard.writeText(text);
    toast.add({ severity: "success", summary: "Copied to clipboard!", life: 3000 });
  }

  downloadJavaFile(text, fileName) {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', fileName);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  toCamelCase(s) {
    const parts = s.split("_");
    let camelCaseString = "";
    for (const part of parts) {
      camelCaseString += this.toProperCase(part);
    }
    return camelCaseString;
  }

  toSnakeCase(s) {
    const re = /[A-Z]/g;
    let match;
    const wordStartIndices = [];
    while ((match = re.exec(s)) != null) {
      wordStartIndices.push(match.index);
    }
    let snakeCaseString = "";
    for (let i = 0; i < wordStartIndices.length; i++) {
      if (i !== wordStartIndices.length - 1) {
        snakeCaseString += s.substring(wordStartIndices[i], wordStartIndices[i + 1]) + "_";
      } else {
        snakeCaseString += s.substring(wordStartIndices[i]);
      }
    }
    return snakeCaseString.toUpperCase();
  }

  toProperCase(s) {
    if (!s.trim()) {
      return s;
    }
    return s.substring(0, 1).toUpperCase() + s.substring(1).toLowerCase();
  }
}

module.exports = new Util();
