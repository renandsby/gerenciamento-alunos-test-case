import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Funções de autenticação
export const authAPI = {
  login: async (username, password) => {
    const response = await api.post('/api/login/', { username, password });
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  getUsername: () => {
    return localStorage.getItem('username');
  }
};

// Funções para Turmas
export const turmasAPI = {
  listar: async () => {
    const response = await api.get('/api/turmas/');
    // Se a resposta tem paginação, retorna results, senão retorna data
    return response.data.results || response.data;
  },
  obter: async (id) => {
    const response = await api.get(`/api/turmas/${id}/`);
    return response.data;
  },
  criar: async (turma) => {
    const response = await api.post('/api/turmas/', turma);
    return response.data;
  },
  atualizar: async (id, turma) => {
    const response = await api.put(`/api/turmas/${id}/`, turma);
    return response.data;
  },
  deletar: async (id) => {
    const response = await api.delete(`/api/turmas/${id}/`);
    return response.data;
  },
  obterAlunos: async (id) => {
    const response = await api.get(`/api/turmas/${id}/alunos/`);
    // Se a resposta tem paginação, retorna results, senão retorna data
    return response.data.results || response.data;
  }
};

// Funções para Alunos
export const alunosAPI = {
  listar: async (turmaId = null, page = 1, nome = null) => {
    const params = new URLSearchParams();
    if (turmaId) {
      params.append('turma', turmaId);
    }
    if (nome) {
      params.append('nome', nome);
    }
    params.append('page', page);
    const url = `/api/alunos/?${params.toString()}`;
    const response = await api.get(url);
    // Retorna resposta completa com paginação
    return response.data;
  },
  obter: async (id) => {
    const response = await api.get(`/api/alunos/${id}/`);
    return response.data;
  },
  criar: async (aluno) => {
    const response = await api.post('/api/alunos/', aluno);
    return response.data;
  },
  atualizar: async (id, aluno) => {
    const response = await api.put(`/api/alunos/${id}/`, aluno);
    return response.data;
  },
  deletar: async (id) => {
    const response = await api.delete(`/api/alunos/${id}/`);
    return response.data;
  }
};

export default api;

