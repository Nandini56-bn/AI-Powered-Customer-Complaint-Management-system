const API_BASE_URL = '/api';

export const api = {
  // Extract details from document or text via AI
  extractComplaint: async (fileOrText) => {
    const formData = new FormData();
    if (typeof fileOrText === 'string') {
      formData.append('text', fileOrText);
    } else {
      formData.append('file', fileOrText);
    }

    const response = await fetch(`${API_BASE_URL}/complaints/extract`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ detail: 'Extraction failed' }));
      throw new Error(err.detail || 'Extraction failed');
    }
    return response.json();
  },

  // Fetch all complaints with search/filter
  getComplaints: async (filters = {}) => {
    const query = new URLSearchParams();
    if (filters.status && filters.status !== 'all') query.append('status', filters.status);
    if (filters.priority && filters.priority !== 'all') query.append('priority', filters.priority);
    if (filters.category && filters.category !== 'all') query.append('category', filters.category);
    if (filters.search) query.append('search', filters.search);

    const response = await fetch(`${API_BASE_URL}/complaints?${query.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch complaints');
    return response.json();
  },

  // Get single complaint details
  getComplaintById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/complaints/${id}`);
    if (!response.ok) throw new Error('Failed to fetch complaint details');
    return response.json();
  },

  // Save new complaint
  createComplaint: async (complaintData) => {
    const response = await fetch(`${API_BASE_URL}/complaints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(complaintData),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ detail: 'Failed to save complaint' }));
      throw new Error(err.detail || 'Failed to save complaint');
    }
    return response.json();
  },

  // Update existing complaint status/details
  updateComplaint: async (id, complaintData) => {
    const response = await fetch(`${API_BASE_URL}/complaints/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(complaintData),
    });

    if (!response.ok) throw new Error('Failed to update complaint');
    return response.json();
  },

  // Delete complaint
  deleteComplaint: async (id) => {
    const response = await fetch(`${API_BASE_URL}/complaints/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Failed to delete complaint');
    return response.json();
  },

  // Fetch dashboard statistics
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/complaints/stats`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },

  // Chat with AI Assistant
  sendChatMessage: async (message, context = null) => {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, context }),
    });

    if (!response.ok) throw new Error('Failed to send AI chat message');
    return response.json();
  },
};
