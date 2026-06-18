import api from './api';

export const analysisApi = {
  analyze: (payload) => api.post('/analysis/analyze', payload).then((res) => res.data),
  history: () => api.get('/analysis/history').then((res) => res.data),
  report: (id) => api.get(`/analysis/${id}`).then((res) => res.data),
};