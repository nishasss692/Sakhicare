/**
 * SakhiCare API Service
 * Handles user authentication, PCOS model predictions, and assessment history.
 */

const API_BASE = '';

const getAuthHeaders = () => {
  const token = localStorage.getItem('sakhicare_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // Auth API
  async register(email, password) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Registration failed');
    }
    return data;
  },

  async login(email, password) {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString()
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Invalid email or password');
    }
    localStorage.setItem('sakhicare_token', data.access_token);
    localStorage.setItem('sakhicare_user', JSON.stringify({ email }));
    return data;
  },

  logout() {
    localStorage.removeItem('sakhicare_token');
    localStorage.removeItem('sakhicare_user');
  },

  getCurrentUser() {
    try {
      const user = localStorage.getItem('sakhicare_user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    return !!localStorage.getItem('sakhicare_token');
  },

  // Assessment & ML Prediction API
  async predictRisk(assessmentData) {
    const res = await fetch(`${API_BASE}/api/predict`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(assessmentData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Assessment calculation failed');
    }
    return data;
  },

  // History API
  async getHistory() {
    const res = await fetch(`${API_BASE}/api/assessments`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Failed to fetch assessment history');
    }
    return data;
  },

  async getAssessmentById(id) {
    const res = await fetch(`${API_BASE}/api/assessments/${id}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Failed to fetch assessment details');
    }
    return data;
  },

  async healthCheck() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return res.ok;
    } catch {
      return false;
    }
  }
};
