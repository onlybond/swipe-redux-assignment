import { configureStore } from "@reduxjs/toolkit";
import invoiceReducer from "./features/invoiceSlice";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
const rootReducer = combineReducers({
  invoice: invoiceReducer
});
const persistConfig = {
  key: 'root',
  storage,
  version:1,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: ['persist/PERSIST']
    }
  })
})

export const persistor = persistStore(store)