import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const adminLogin = createAsyncThunk(
  "admin/login",
  async ({ username, password }) => {
    const res = await fetch("http://localhost:5000/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error("Invalid credentials");
    return await res.json();
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: { isAuthenticated: false, loading: false, error: null },
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      localStorage.removeItem("adminToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout } = adminSlice.actions;
export default adminSlice.reducer;
