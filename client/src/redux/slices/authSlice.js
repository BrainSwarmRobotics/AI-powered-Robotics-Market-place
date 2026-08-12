import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

function loadUser() {
  try {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function persistSession(payload) {
  const { token, success, ...user } = payload;
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  return user;
}

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await API.post('/auth/register', { name, email, password });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/auth/profile');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load profile');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({ name, address }, { rejectWithValue }) => {
    try {
      const response = await API.put('/auth/profile', { name, address });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: loadUser(),
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = persistSession(action.payload);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = persistSession(action.payload);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        const { success, ...user } = action.payload;
        state.user = { ...state.user, ...user };
        localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        const { success, ...user } = action.payload;
        state.user = { ...state.user, ...user };
        localStorage.setItem('user', JSON.stringify(state.user));
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
