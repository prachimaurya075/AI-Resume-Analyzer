import api from './api';

export const resumeApi = {
  upload: (formData) =>
    api.post('/resumes', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((res) => res.data),
  list: () => api.get('/resumes').then((res) => res.data),
  details: (id) => api.get(`/resumes/${id}`).then((res) => res.data),
};