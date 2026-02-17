// API Client for Organic OS
// Centralized API utilities for external integrations

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export async function fetchWithTimeout(
  url: string, 
  options: RequestInit = {}, 
  timeout = 10000
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export async function get<T>(endpoint: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}${endpoint}`);
    const data = await response.json();
    return { data, success: response.ok };
  } catch (error) {
    return { error: String(error), success: false };
  }
}

export async function post<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return { data, success: response.ok };
  } catch (error) {
    return { error: String(error), success: false };
  }
}

export async function put<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return { data, success: response.ok };
  } catch (error) {
    return { error: String(error), success: false };
  }
}

export async function del<T>(endpoint: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return { data, success: response.ok };
  } catch (error) {
    return { error: String(error), success: false };
  }
}

// GitHub API helpers
export const GitHub = {
  async getRepos(): Promise<ApiResponse<any>> {
    return get('/api/github/repos');
  },
  
  async getUser(): Promise<ApiResponse<any>> {
    return get('/api/github/user');
  },
  
  async getActivity(): Promise<ApiResponse<any>> {
    return get('/api/github/activity');
  },
};

// Supabase API helpers  
export const Supabase = {
  async getProgress(): Promise<ApiResponse<any>> {
    return get('/api/progress');
  },
  
  async updateProgress(data: any): Promise<ApiResponse<any>> {
    return post('/api/progress', data);
  },
};
