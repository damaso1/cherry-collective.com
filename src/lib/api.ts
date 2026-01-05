import axios from 'axios';

// API base URL - will be proxied in development
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth
api.interceptors.request.use(
  (config) => {
    const apiKey = import.meta.env.VITE_API_KEY;
    if (apiKey) {
      config.headers['x-api-key'] = apiKey;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Types
export interface Lead {
  id: string;
  company: string;
  industry: string;
  score: number;
  status: 'ripe' | 'growing' | 'picked' | 'rotten' | 'pending';
  revenue?: string;
  employees?: string;
  location?: string;
  lastActivity?: string;
  estimatedValue?: number;
  contact?: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };
}

export interface AgentTransaction {
  instruction_id: string;
  priority: number;
  max_budget_limit: number;
  revenue_impact_estimate: number;
  metric_status: {
    tcrr_pass: boolean;
    osu_pass: boolean;
    idv_pass: boolean;
  };
  automation_script?: string;
  tool_entry?: unknown;
  created_at: string;
}

export interface SystemStatus {
  status: string;
  database: string;
  rabbitmq: string;
  timestamp: string;
}

export interface AgentReport {
  instruction_id: string;
  priority: number;
  max_budget_limit: number;
  revenue_impact_estimate: number;
  roi_report?: string;
  tcrr_pass: boolean;
  osu_pass: boolean;
  idv_pass: boolean;
  automation_script?: string;
}

// API functions
export const systemApi = {
  getStatus: async (): Promise<SystemStatus> => {
    const response = await api.get('/status');
    return response.data;
  },

  getHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  },

  getMetrics: async () => {
    const response = await api.get('/metrics');
    return response.data;
  },
};

export const leadsApi = {
  getAll: async (): Promise<Lead[]> => {
    const response = await api.get('/leads');
    return response.data;
  },

  getById: async (id: string): Promise<Lead> => {
    const response = await api.get(`/leads/${id}`);
    return response.data;
  },

  runTask: async (botId: string, taskCategory: string) => {
    const response = await api.post('/run', {
      bot_id: botId,
      task_category: taskCategory,
    });
    return response.data;
  },
};

export const agentApi = {
  submitReport: async (report: AgentReport) => {
    const response = await api.post('/api/v1/poa/submit_report', report);
    return response.data;
  },

  getTransactions: async (): Promise<AgentTransaction[]> => {
    const response = await api.get('/api/v1/transactions');
    return response.data;
  },
};

export default api;
