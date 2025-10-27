import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Add to wishlist
export const addToWishlist = createAsyncThunk('wishlist/add', async (productId, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(`${API_URL}/users/wishlist/${productId}`, {}, config);
    return data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to add to wishlist');
  }
});

// Remove from wishlist
export const removeFromWishlist = createAsyncThunk('wishlist/remove', async (productId, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await axios.delete(`${API_URL}/users/wishlist/${productId}`, config);
    return productId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to remove from wishlist');
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    setWishlistItems: (state, action) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter((id) => id !== action.payload);
      });
  },
});

export const { setWishlistItems } = wishlistSlice.actions;
export default wishlistSlice.reducer;
