import { name } from '../manifest.json'

function wrap(key) {
    if (key.startsWith(`${name}.`)) return key;
    return `${name}.${key}`;
}

export default {
    get(key) {
        const v = localStorage.getItem(wrap(key));
        if (v) return JSON.parse(v);
        return null;
    },
    set(key, value) {
        localStorage.setItem(wrap(key), JSON.stringify(value));
    },
    tryGet(key, setfunc) {
        let v = this.get(key);
        if (v == null) {
            if (typeof setfunc === 'function') v = setfunc();
            this.set(key, v);
        }
        return v;
    }
}