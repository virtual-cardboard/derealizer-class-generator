<template>
    <div>
        <!-- <label for="abstractCheckbox">Abstract</label>
        <input type="checkbox" id="abstractCheckbox" v-model="data.abstract">
        <label for="nameInput">Name</label>
        <input type="text" v-model="data.name" id="nameInput" class="nameInput">
        <div class="border-l-2 border-gray-600 pl-4 p-1 ml-4">
            <div v-for="(field, index) in data.fields" :key="index">
                <input type="checkbox" id="transientCheckbox" v-model="field.transient">
                {{ field }}
            </div>
        </div> -->
    </div>
</template>


<script>

export default {
    props: {
        dataProp: Object,
    },
    data() {
        return {
            data: null,
        };
    },
    created() {
        this.data = this.dataProp;
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
