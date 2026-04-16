import { configureStore } from "@reduxjs/toolkit";
import bookReducer from "./slices/bookSlice";
import authReducer from "./slices/authSlice";
import authorReducer from "./slices/authorSlice";
import categoryReducer from "./slices/categorySlice";
import publisherReducer from "./slices/publisherSlice";
    import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";

export const store = configureStore({
  reducer: {
    books: bookReducer,
    auth: authReducer,
    authors: authorReducer,      
    categories: categoryReducer, 
    publishers: publisherReducer, 

    cart: cartReducer,          
    wishlist: wishlistReducer,  
  },
});
 export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;