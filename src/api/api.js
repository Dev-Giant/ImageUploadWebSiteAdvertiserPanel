// API configuration and service for advertiser panel
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const getToken = () => localStorage.getItem('token');

const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    return response;
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};

// Campaigns API
export const campaignsAPI = {
  getCampaigns: async () => {
    return apiRequest('/advertiser/campaigns');
  },

  createCampaign: async (campaignData) => {
    return apiRequest('/advertiser/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaignData),
    });
  },

  updateCampaign: async (id, campaignData) => {
    return apiRequest(`/advertiser/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(campaignData),
    });
  },

  deleteCampaign: async (id) => {
    return apiRequest(`/advertiser/campaigns/${id}`, {
      method: 'DELETE',
    });
  },
};

// Billboards API
export const billboardsAPI = {
  getBillboards: async () => {
    return apiRequest('/advertiser/billboards');
  },

  createBillboard: async (billboardData) => {
    return apiRequest('/advertiser/billboards', {
      method: 'POST',
      body: JSON.stringify(billboardData),
    });
  },

  updateBillboard: async (id, billboardData) => {
    return apiRequest(`/advertiser/billboards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(billboardData),
    });
  },
};

// Analytics API
export const analyticsAPI = {
  getAnalytics: async (campaignId) => {
    return apiRequest(`/advertiser/analytics${campaignId ? `?campaignId=${campaignId}` : ''}`);
  },
};

// Billing API
export const billingAPI = {
  getInvoices: async () => {
    return apiRequest('/advertiser/invoices');
  },
};

// Account API
export const accountAPI = {
  getAccount: async () => {
    return apiRequest('/advertiser/account');
  },

  updateAccount: async (accountData) => {
    return apiRequest('/advertiser/account', {
      method: 'PUT',
      body: JSON.stringify(accountData),
    });
  },
};

