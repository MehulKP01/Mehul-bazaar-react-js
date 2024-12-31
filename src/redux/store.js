
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/user.reducer";
import addcartReducer from "./reducers/addcart.reducer";
import shopReducer from "./reducers/shop.reducer";
import productReducer from "./reducers/shop.reducer";
import couponReducer from "./reducers/shop.reducer";
import ratingReducer from './reducers/ratings.reducer';
import { createWrapper } from "next-redux-wrapper";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";  // LocalStorage persistence

// Setup for Redux Persist on different slices
const persistedReducer = persistReducer(
  {
    key: "auth",
    storage,  // LocalStorage
  },
  userReducer
);

const persistedReduceraddCart = persistReducer(
  {
    key: "addcart",
    storage,
  },
  addcartReducer
);

const persistedReducerShop = persistReducer(
  {
    key: "shop",
    storage,
  },
  shopReducer
);

const persistedReducerProducts = persistReducer(
  {
    key: "products",
    storage,
  },
  productReducer
);

const persistedReducercoupon = persistReducer(
  {
    key: "coupon",
    storage,
  },
  couponReducer
);

const persistedReducerRatings = persistReducer(
  {
    key: "globalRatings",
    storage,
  },
  ratingReducer
);

// Create store with redux-persist and next-redux-wrapper
const makeStore = () =>
  configureStore({
    reducer: {
      user: persistedReducer,
      shop: persistedReducerShop,
      addcart: persistedReduceraddCart,
      products: persistedReducerProducts,
      coupon: persistedReducercoupon,
      ratings:persistedReducerRatings,
    },
    devTools: process.env.NODE_ENV !== "production",  // Enable Redux DevTools only in development
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignore redux-persist actions to prevent warnings
          ignoredActions: [
            "persist/PERSIST",
            "persist/REHYDRATE",
            "persist/PAUSE",
            "persist/FLUSH",
            "persist/PURGE",
            "persist/REGISTER",
          ],
        },
      }),
  });

// Create Redux wrapper for SSR (Server Side Rendering) in Next.js
const store = makeStore();
export const persistor = persistStore(store);

// Wrap the store for SSR compatibility
export const wrapper = createWrapper(makeStore, { debug: false });

// You can export `store` here if you need it directly
export default store;
