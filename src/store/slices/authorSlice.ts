// slices/authorSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/api";

export const fetchAuthors = createAsyncThunk("authors/get", async () => {
  const res = await API.get("/authors");
  return res.data.data;
});

const authorSlice = createSlice({
  name: "authors",
  initialState: {
    authors: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAuthors.fulfilled, (state, action) => {
      state.authors = action.payload;
    });
  },
});

export default authorSlice.reducer;