import { all } from "redux-saga/effects";
import { ideasSaga } from "../features/ideas/ideasSaga";
import { AuthSaga } from "../features/auth/authSaga";
export default function* rootSaga() {
  yield all([ideasSaga(), AuthSaga()]);
}
