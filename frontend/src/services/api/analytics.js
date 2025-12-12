import api from './client';

export const getHabitAnalytics = async () => {
  const response = await api.get('/analytics/habits');
  return response.data;
};

export const getRecommendations = async () => {
  const response = await api.get('/analytics/recommendations');
  return response.data;
};

export const getAnalyticsSummary = async () => {
  const response = await api.get('/analytics/summary');
  return response.data;
};
