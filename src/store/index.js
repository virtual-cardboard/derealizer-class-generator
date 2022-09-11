import { createStore } from 'vuex';
import builtInClasses from '../assets/builtInClasses.json';

const store = createStore({
    state() {
        return {
            /**
             * @type {any[]}
             */
            builtInClassDefinitions: builtInClasses,
            classDefinitions: [],
            numChanges: 0,
        }
    },
    mutations: {
        /**
         * @param {any} state
         * @param {any[]} builtInClassDefinitions
         */
        setBuiltInClassDefinitions(state, builtInClassDefinitions) {
            state.builtInClassDefinitions = builtInClassDefinitions;
        },
        /**
         * @param {any} state
         * @param {any[]} classDefinitions
         */
        setClassDefinitions(state, classDefinitions) {
            state.classDefinitions = classDefinitions;
        },
        /**
         * @param {any} state
         * @param {any} classDefinitions
         */
        addClassDefinitions(state, ...classDefinitions) {
            state.classDefinitions.push(...classDefinitions);
        },
        increaseNumChanges(state) {
            state.numChanges++;
        },
    },
    getters: {
        /**
         * @param {any} state
         * @returns {any[]}
         */
        allClassDefinitions(state) {
            return state.builtInClassDefinitions.concat(state.classDefinitions);
        },
        allAbstractClasses(state) {
            return state.builtInClassDefinitions.concat(state.classDefinitions)
                .filter(classDefinition => classDefinition.abstract);
        },
    },
})

export default store;
