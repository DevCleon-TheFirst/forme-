import axios from 'axios';

if (typeof document !== 'undefined') {
    const token = document.head.querySelector('meta[name="csrf-token"]');

    if (token) {
        axios.defaults.headers.common['X-CSRF-TOKEN'] = (token as HTMLMetaElement).content;
    } else {
        console.error('CSRF token not found');
    }
}

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
