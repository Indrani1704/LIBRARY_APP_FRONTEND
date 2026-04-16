import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/api";

// ================= TYPES =================
interface User {
  _id: string;   
  name: string;  
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// ================= SAFE LOAD =================
const getStoredUser = () => {
  try {
    const data = sessionStorage.getItem("user");
    if (!data || data === "undefined") return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  user: getStoredUser(),
  token: sessionStorage.getItem("token"),
  loading: false,
  error: null,
};

// ================= REGISTER =================
export const register = createAsyncThunk(
  "auth/register",
  async (
    data: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await API.post("/auth/register", data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Register failed");
    }
  }
);

// ================= LOGIN =================
export const login = createAsyncThunk(
  "auth/login",
  async (
    data: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await API.post("/auth/login", data);

      //  STORE HERE (single source)
      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("user", JSON.stringify(res.data.user));

      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// ================= LOGOUT =================
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
});

// ================= SLICE =================
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // REGISTER
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: any) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      });
  },
});

export default authSlice.reducer;