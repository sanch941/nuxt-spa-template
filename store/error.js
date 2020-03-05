const SET_MESSAGE = 'SET_MESSAGE';

export const state = () => ({
    hasError: false,
    message: null
});

export const mutations = {
    [SET_MESSAGE](state, message) {
        state.message = message;
        state.hasError = true;
    }
};

export const actions = {
    setMessage({ commit }, message) {
        commit(SET_MESSAGE, message);
    }
};
