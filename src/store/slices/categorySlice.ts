import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/api";

export const fetchCategories = createAsyncThunk(
  "categories/get",
  async () => {
    const res = await API.get("/categories");
    return res.data.data; 
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    categories: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.categories = action.payload || []; 
    });
  },
});

export default categorySlice.reducer;