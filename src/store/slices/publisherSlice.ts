// slices/publisherSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/api";

export const fetchPublishers = createAsyncThunk("publishers/get", async () => {
  const res = await API.get("/publishers");
  return res.data.data;
});

const publisherSlice = createSlice({
  name: "publishers",
  initialState: {
    publishers: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPublishers.fulfilled, (state, action) => {
      state.publishers = action.payload;
    });
  },
});

export default publisherSlice.reducer;