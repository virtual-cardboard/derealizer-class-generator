const Util = require('./Util');
const Constants = require('./Constants');

class ClassCodeGenerator {
    generateAbstractClassSerializerCode(enumName, abstractClassDefinition) {
        try {
            return Util.convertStringToHTML(this.doGenerateAbstractClassSerializerCode(enumName, abstractClassDefinition));
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    doGenerateAbstractClassSerializerCode(enumName, abstractClassDefinition) {
        if (!abstractClassDefinition) return "";
        const snakeCaseClassName = Util.toSnakeCase(abstractClassDefinition.name);
        let s = `import static java.lang.reflect.Modifier.isAbstract;

import java.lang.reflect.Constructor;
import java.util.List;

public class ${abstractClassDefinition.name}Serializer {

	@SuppressWarnings("unchecked")
	private static final Constructor<? extends ${abstractClassDefinition.name}>[] ${snakeCaseClassName}_CONSTRUCTORS = new Constructor[Short.MAX_VALUE];

	private static final List<Class<? extends ${Constants.classes.SerializationFormatEnum}>> SERIALIZATION_FORMAT_ENUMS = new ArrayList<>();
	
	static {
		SERIALIZATION_FORMAT_ENUMS.add(${enumName}.class);
		
		for (Class<? extends SerializationFormatEnum> enumClass : SERIALIZATION_FORMAT_ENUMS) {
			for (SerializationFormatEnum enumVal : enumClass.getEnumConstants()) {
				@SuppressWarnings("unchecked")
				Class<? extends ${abstractClassDefinition.name}> clazz = (Class<? extends ${abstractClassDefinition.name}>) enumVal.serializableClass();
				if (clazz == null) {
					throw new RuntimeException("No POJO class defined for " + enumVal + ". " +
							"Try using " + SerializationClassGenerator.class.getSimpleName() +
							" or the derealizer class generator to generate a POJO class for you.");
				}
				if (isAbstract(clazz.getModifiers())) {
					continue;
				}

				try {
					short id = ((HasId) enumVal).id();
					if (id == -1) {
						throw new RuntimeException("No id set for " + ${enumName}.class.getSimpleName() + "." + enumVal + ".");
					}
					${snakeCaseClassName}_CONSTRUCTORS[id] = clazz.getConstructor();
				} catch (NoSuchMethodException e) {
					System.err.println("Could not find no-arg constructor in class " + clazz.getSimpleName());
					e.printStackTrace();
				} catch (SecurityException e) {
					e.printStackTrace();
				}
			}
		}
	}
	
	public static ${abstractClassDefinition.name} deserialize(SerializationReader reader) {
		if (reader.bytesRemaining() < 2) {
			throw new IllegalArgumentException("Invalid number of bytes in packet: " + reader.bytesRemaining());
		}
		int id = reader.readShort();
		if (id < 0 || id >= ${snakeCaseClassName}_CONSTRUCTORS.length) {
			throw new IllegalArgumentException("Invalid id: " + id);
		}
		Constructor<? extends ${abstractClassDefinition.name}> constructor = ${snakeCaseClassName}_CONSTRUCTORS[id];

		if (constructor == null) {
			System.err.println("No constructor found for class with id: " + id);
			System.err.println("Maybe you forgot to add the enum to the list of SerializationFormatEnums?");
			return null;
		}

		try {
			${abstractClassDefinition.name} obj = constructor.newInstance();
			obj.read(reader);
			return obj;
		} catch (Exception e) {
			System.err.println("Could not create " + constructor.getDeclaringClass().getSimpleName()
					+ " from constructor.");
			e.printStackTrace();
		}

		return null;
	}
	
}`;

        return s;
    }

}

module.exports = new ClassCodeGenerator();
