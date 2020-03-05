import Vue from 'vue';

export default function({ store }) {
    Vue.config.errorHandler = function(err, vm, info) {
        const message = `Error: ${err.toString()}\nInfo: ${info}`;
        if (process.env.NODE_ENV !== 'production') {
            console.log(message);
        }

        store.dispatch('error/setMessage', message);
    };
}
