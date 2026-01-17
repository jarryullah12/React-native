import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Async thunk to load user from session
export const loadUserSession = createAsyncThunk(
  'auth/loadSession',
  async (_, { dispatch }) => {
    try {
      const userData = await AsyncStorage.getItem('user_session');
      if (userData) {
        const user = JSON.parse(userData);
        return user;
      }
      return null;
    } catch (error) {
      console.error('Error loading session:', error);
      return null;
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null,
    loading: true,
  },
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.loading = false;
      // Save to session
      AsyncStorage.setItem('user_session', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
      // Remove from session
      AsyncStorage.removeItem('user_session');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUserSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUserSession.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.isAuthenticated = true;
          state.user = action.payload;
        }
      })
      .addCase(loadUserSession.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
