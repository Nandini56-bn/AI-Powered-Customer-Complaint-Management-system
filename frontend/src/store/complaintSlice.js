import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api';

// Async Thunks
export const fetchComplaints = createAsyncThunk(
  'complaints/fetchComplaints',
  async (filters, { rejectWithValue }) => {
    try {
      return await api.getComplaints(filters);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchStats = createAsyncThunk(
  'complaints/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      return await api.getStats();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const extractComplaint = createAsyncThunk(
  'complaints/extractComplaint',
  async (fileOrText, { rejectWithValue }) => {
    try {
      return await api.extractComplaint(fileOrText);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const saveComplaint = createAsyncThunk(
  'complaints/saveComplaint',
  async (complaintData, { dispatch, rejectWithValue }) => {
    try {
      const saved = await api.createComplaint(complaintData);
      dispatch(fetchComplaints());
      dispatch(fetchStats());
      return saved;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateComplaintStatus = createAsyncThunk(
  'complaints/updateStatus',
  async ({ id, statusData }, { dispatch, rejectWithValue }) => {
    try {
      const updated = await api.updateComplaint(id, statusData);
      dispatch(fetchComplaints());
      dispatch(fetchStats());
      return updated;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteComplaint = createAsyncThunk(
  'complaints/deleteComplaint',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await api.deleteComplaint(id);
      dispatch(fetchComplaints());
      dispatch(fetchStats());
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  items: [],
  stats: {
    total: 0,
    pending: 0,
    in_progress: 0,
    resolved: 0,
    escalated: 0,
    urgent: 0,
    category_counts: {},
  },
  extractedDraft: null,
  selectedComplaint: null,
  isUploadModalOpen: false,
  isFormModalOpen: false,
  loading: false,
  extracting: false,
  error: null,
  successMessage: null,
  filters: {
    status: 'all',
    priority: 'all',
    category: 'all',
    search: '',
  },
};

const complaintSlice = createSlice({
  name: 'complaints',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSelectedComplaint: (state, action) => {
      state.selectedComplaint = action.payload;
    },
    setExtractedDraft: (state, action) => {
      state.extractedDraft = action.payload;
    },
    toggleUploadModal: (state, action) => {
      state.isUploadModalOpen = action.payload !== undefined ? action.payload : !state.isUploadModalOpen;
    },
    toggleFormModal: (state, action) => {
      state.isFormModalOpen = action.payload !== undefined ? action.payload : !state.isFormModalOpen;
    },
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchComplaints
      .addCase(fetchComplaints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchStats
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      // extractComplaint
      .addCase(extractComplaint.pending, (state) => {
        state.extracting = true;
        state.error = null;
      })
      .addCase(extractComplaint.fulfilled, (state, action) => {
        state.extracting = false;
        state.extractedDraft = action.payload;
        state.isUploadModalOpen = false;
        state.isFormModalOpen = true; // Open auto-filled editable form
      })
      .addCase(extractComplaint.rejected, (state, action) => {
        state.extracting = false;
        state.error = action.payload;
      })
      // saveComplaint
      .addCase(saveComplaint.fulfilled, (state) => {
        state.extractedDraft = null;
        state.isFormModalOpen = false;
        state.successMessage = 'Complaint saved successfully to MySQL database!';
      })
      .addCase(saveComplaint.rejected, (state, action) => {
        state.error = action.payload;
      })
      // updateComplaintStatus
      .addCase(updateComplaintStatus.fulfilled, (state, action) => {
        state.successMessage = 'Complaint updated successfully!';
        if (state.selectedComplaint && state.selectedComplaint.id === action.payload.id) {
          state.selectedComplaint = action.payload;
        }
      });
  },
});

export const {
  setFilters,
  setSelectedComplaint,
  setExtractedDraft,
  toggleUploadModal,
  toggleFormModal,
  clearMessages,
} = complaintSlice.actions;

export default complaintSlice.reducer;
