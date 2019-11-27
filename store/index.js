import Vue from 'vue';
import Vuex from 'vuex';
import { test } from './test';

Vue.use(Vuex);

export const store = new Vuex.Store({
    modules: {
        test
    }
});
