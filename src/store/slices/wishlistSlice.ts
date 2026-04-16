import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/api";

// ================= FETCH =================
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async () => {
    const res = await API.get("/wishlist");
    return res.data;
  }
);

// ================= ADD =================
export const addToWishlist = createAsyncThunk(
  "wishlist/add",
  async (bookId: string) => {
    await API.post("/wishlist/add", { bookId });

    const res = await API.get("/wishlist");
    return res.data;
  }
);

// ================= REMOVE =================
export const removeFromWishlist = createAsyncThunk(
  "wishlist/remove",
  async (id: string) => {
    await API.delete(`/wishlist/${id}`);

    const res = await API.get("/wishlist");
    return res.data;
  }
);

// ================= TYPES =================
interface WishlistState {
  items: any[]; // ✅ quick fix
}

// ================= SLICE =================
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
  } as WishlistState,

  reducers: {
    clearWishlist: (state) => {
      state.items = [];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;