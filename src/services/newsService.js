// src/services/newsService.js
import api from './api';

export const getNews = async (params = {}) => {
  const response = await api.get('/news', { params });
  const payload = response.data || {};

  if (payload.success && payload.data && payload.data.news) {
    const { news, pagination } = payload.data;
    return {
      news,
      totalPages: pagination?.totalPages || 1,
      currentPage: pagination?.page || params.page || 1,
      total: pagination?.total || news.length,
    };
  }

  return {
    news: [],
    totalPages: 1,
    currentPage: 1,
    total: 0,
  };
};

const newsService = { getNews };
export default newsService;
