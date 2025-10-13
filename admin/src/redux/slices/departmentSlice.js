import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = "http://localhost:5000/departments";

// Fetch all
export const fetchDepartments = createAsyncThunk("departments/fetch", async () => {
  const res = await fetch(BASE_URL);
  return await res.json();
});

// Add
export const addDepartment = createAsyncThunk("departments/add", async ({ department_name }) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ department_name }),
  });
  return await res.json();
});

// Update
export const updateDepartment = createAsyncThunk("departments/update", async ({ department_id, department_name }) => {
  const res = await fetch(`${BASE_URL}/${department_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ department_name }),
  });
  return await res.json();
});

// Delete
export const deleteDepartment = createAsyncThunk("departments/delete", async (department_id) => {
  await fetch(`${BASE_URL}/${department_id}`, { method: "DELETE" });
  return department_id;
});

const departmentSlice = createSlice({
  name: "departments",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => { state.loading = true; })
      .addCase(fetchDepartments.fulfilled, (state, action) => { state.list = action.payload; state.loading = false; })
      .addCase(fetchDepartments.rejected, (state, action) => { state.error = action.error.message; state.loading = false; })
      .addCase(addDepartment.fulfilled, (state, action) => { state.list.push(action.payload); })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        const index = state.list.findIndex(d => d.department_id === action.payload.department_id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.list = state.list.filter(d => d.department_id !== action.payload);
      });
  },
});

export default departmentSlice.reducer;
