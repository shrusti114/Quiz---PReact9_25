import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./slices/adminSlice";
import departmentReducer from "./slices/departmentSlice";

const store = configureStore({
  reducer: {
    admin: adminReducer,
    departments: departmentReducer,
  },
});

export default store;
