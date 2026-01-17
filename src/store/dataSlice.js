import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  banners: [],
  categories: [],
  products: [],
  onboarding: [],
  loading: false,
  error: null,
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setData: (state, action) => {
      state.banners = action.payload.banners;
      state.categories = action.payload.categories;
      state.products = action.payload.products;
      state.onboarding = action.payload.onboarding;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setData, setLoading, setError } = dataSlice.actions;
export default dataSlice.reducer;
