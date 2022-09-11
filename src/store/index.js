import { createStore } from 'vuex';

const store = createStore({
    state() {
        return {
            classDefinitions: [],
        }
    },
    mutations: {
        setClassDefinitions(state, classDefinitions) {
            state.classDefinitions = classDefinitions;
        },
        addClassDefinitions(state, ...classDefinitions) {
            state.classDefinitions.push(...classDefinitions);
        }
    }
})

export default store;
