import axios from "axios";

const API_BASE = "/api";

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        "Content-Type": "application/json",
    },
});

// Languages API
export const languagesAPI = {
    getAll: () => api.get("/languages"),
    create: (data) => api.post("/languages", data),
    update: (id, data) => api.put(`/languages/${id}`, data),
    delete: (id) => api.delete(`/languages/${id}`),
};

// Vocabulary API
export const vocabularyAPI = {
    getByLanguage: (languageId) =>
        api.get(`/languages/${languageId}/vocabulary`),
    create: (languageId, data) =>
        api.post(`/languages/${languageId}/vocabulary`, data),
    update: (languageId, wordId, data) =>
        api.put(`/languages/${languageId}/vocabulary/${wordId}`, data),
    delete: (languageId, wordId) =>
        api.delete(`/languages/${languageId}/vocabulary/${wordId}`),
};

export default api;
