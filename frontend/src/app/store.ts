import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import ideasReducer from "../features/ideas/ideasSlice";
import authReducer from "../features/auth/AuthSlice";
import rootSaga from "./rootSaga";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    ideas: ideasReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
