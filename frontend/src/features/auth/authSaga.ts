import { call, put, takeLatest, delay } from "redux-saga/effects";
import { authAPI } from "../../api/axios";
import { SagaIterator } from "redux-saga";
import { loginRequest, loginSuccess, loginFailure } from "./authSlice";
import { LoginAction, LoginResponse } from "./types";

function* handleLogin(action: LoginAction): SagaIterator {
  try {
    const { email, password } = action.payload;

    const response: { data: LoginResponse } = yield call(authAPI.login, {
      email,
      password,
    });
    const { data } = response;

    yield put(loginSuccess({ user: data.user, token: data.token }));

    yield delay(3000);
    yield put({ type: "auth/clearSuccess" });
  } catch (error: any) {
    const message = error.response?.data?.message || "Invalid credentials";
    yield put(loginFailure(message));

    yield delay(5000);
    yield put({ type: "auth/clearError" });
  }
}

export default function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
}
