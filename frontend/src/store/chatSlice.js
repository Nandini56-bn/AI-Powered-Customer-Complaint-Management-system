import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api';

export const sendChatMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ message, context }, { rejectWithValue }) => {
    try {
      return await api.sendChatMessage(message, context);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  messages: [
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Hello! I am your AIVOA AI Complaint Assistant. How can I assist you today? You can ask me to draft resolutions, summarize tickets, or suggest customer responses.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ],
  isOpen: false,
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    toggleChat: (state, action) => {
      state.isOpen = action.payload !== undefined ? action.payload : !state.isOpen;
    },
    addMessage: (state, action) => {
      state.messages.push({
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ...action.payload,
      });
    },
    clearChat: (state) => {
      state.messages = initialState.messages;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendChatMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({
          id: Date.now().toString(),
          sender: 'assistant',
          text: action.payload.reply || action.payload.message || 'No response generated.',
          suggestedActions: action.payload.suggested_actions || [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.messages.push({
          id: Date.now().toString(),
          sender: 'assistant',
          text: 'Sorry, I encountered an issue processing your query. Please try again.',
          isError: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      });
  },
});

export const { toggleChat, addMessage, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
