import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/api";

// ================= FETCH =================
export const fetchCart = createAsyncThunk("cart/fetch", async () => {
  const res = await API.get("/cart");
  return res.data;
});

// ================= ADD =================
export const addToCart = createAsyncThunk(
  "cart/add",
  async (bookId: string) => {
    await API.post("/cart/add", { bookId });

    const res = await API.get("/cart");
    return res.data;
  }
);

// ================= DECREASE =================
export const decreaseQty = createAsyncThunk(
  "cart/decrease",
  async (id: string, { dispatch }) => {
    await API.put(`/cart/decrease/${id}`);
    dispatch(fetchCart());
  }
);

// ================= REMOVE =================
export const removeFromCart = createAsyncThunk(
  "cart/remove",
  async (id: string, { dispatch }) => {
    await API.delete(`/cart/${id}`);
    dispatch(fetchCart());
  }
);

// ================= TYPES =================
interface CartState {
  items: any[]; // ✅ quick fix
  loading: boolean;
}

// ================= SLICE =================
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
  } as CartState,

  reducers: {
    clearCart: (state) => {
      state.items = [];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchCart.rejected, (state) => {
        state.loading = false;
      })

      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;