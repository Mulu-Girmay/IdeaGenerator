import { call, put, takeLatest, takeEvery, delay } from "redux-saga/effects";
import { authAPI } from "../../api/axios";
import { SagaIterator } from "redux-saga";
import { loginRequest, loginSuccess, loginFailure } from "./AuthSlice";
import { LoginAction } from "./types.ts";

function* handleLogin(action: LoginAction): SagaIterator {
  try {
    const { email, password } = action.payload;

    const response = (yield call(authAPI.login, { email, password })) as {
      data: any;
    };
    const { data } = response;

    yield put(loginSuccess({ user: data.user, token: data.token }));

    yield delay(3000);
    yield put({ type: "auth/clearSuccess" });
  } catch (error: any) {
    const message = error.response?.data?.message || "Invalid credentials";
    yield put(loginFailure(message));
  }
}

export default function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
}
