const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = {
    languages: {
        list: () => fetch(`${API_BASE_URL}/languages`).then(res => res.json()),
        create: (data) => fetch(`${API_BASE_URL}/languages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(res => res.json()),
        update: (code, data) => fetch(`${API_BASE_URL}/languages/${code}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(res => res.json()),
        delete: (code) => fetch(`${API_BASE_URL}/languages/${code}`, {
            method: 'DELETE'
        }).then(res => res.json()),
    },
    vocabulary: {
        list: (lang = '') => fetch(`${API_BASE_URL}/vocabulary?language=${lang}`).then(res => res.json()),
        create: (data) => fetch(`${API_BASE_URL}/vocabulary`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(res => res.json()),
        update: (id, data) => fetch(`${API_BASE_URL}/vocabulary/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(res => res.json()),
        delete: (id) => fetch(`${API_BASE_URL}/vocabulary/${id}`, {
            method: 'DELETE'
        }).then(res => res.json()),
    }
};
