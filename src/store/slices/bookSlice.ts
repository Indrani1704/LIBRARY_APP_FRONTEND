import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/api";
import type { Book } from "../../types/type/index";

interface BookState {
  books: Book[];
  loading: boolean;
}

const initialState: BookState = {
  books: [],
  loading: false,
};
export const createBook = createAsyncThunk(
  "books/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/books", data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data);
    }
  }
);
/*  FETCH WITH FILTER SUPPORT */
export const fetchBooks = createAsyncThunk<any, string | void>(
  "books/fetch",
  async (queryString = "") => {
    const res = await API.get(`/books?${queryString}`);
    return res.data.data;
  }
);

/*  SLICE */
const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    /*  CLEAR OLD BOOKS (FIX FLICKER) */
    clearBooks: (state) => {
      state.books = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.books = action.payload;
        state.loading = false;
      })
      .addCase(fetchBooks.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearBooks } = bookSlice.actions;
export default bookSlice.reducer;