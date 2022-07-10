<template>
    <div class="flex columns-2 p-4 w-full h-full">
        <div class="flex flex-col w-3/5">
            <div v-for="(def, index) in classDefinitions" :key="index">
                <label for="abstractCheckbox">Abstract</label>
                <input type="checkbox" id="abstractCheckbox" v-model="def.abstract">
                <label for="nameInput">Name</label>
                <input type="text" v-model="def.name" id="nameInput" class="nameInput">
                <div class="border-l-2 border-gray-600 pl-4 p-1 ml-4">
                    <div v-for="(field, index) in def.fields" :key="index">
                        {{ field }}
                    </div>
                </div>
            </div>
        </div>
        <div class="flex flex-col">
            hello2
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            classDefinitions: [
                {
                    abstract: false,
                    accessMod: 'public',
                    name: 'Test',
                    superclass: null,
                    fields: ['field 1', 'field 2']
                }
            ]
        };
    },
}
</script>


<style scoped>
label {
    @apply m-1 ml-2;
}

.nameInput {
    @apply m-2 p-[0.25] border;
}
</style>
