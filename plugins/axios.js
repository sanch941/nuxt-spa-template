import axios from 'axios';
import { store } from '../store';

const secretKey = '';

axios.defaults.baseURL =
    process.env.NODE_ENV !== 'production'
        ? 'https://localhost:3000'
        : 'https://boom-brains-api.kdo.one';

axios.interceptors.request.use((config) => {
    const accessToken = store.getters['auth/accessToken'];
    const language = store.getters['language/currentLanguage'];

    config.headers['Content-type'] = 'application/json';

    if (language) {
        config.headers['App-Language'] = language;
    }

    if (accessToken) {
        config.headers.Authorization = 'Bearer ' + accessToken;
        config.headers.Accept = 'application/json';
    } else {
        config.headers.Authorization = null;
        config.headers['Secret-key'] = secretKey;
    }

    return config;
});

axios.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response.status === 401) {
            console.log('logout');
        }
    }
);
