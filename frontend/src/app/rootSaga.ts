import { all } from "redux-saga/effects";
import { ideasSaga } from "../features/ideas/ideasSaga";
import authSaga from "../features/auth/authSaga";

export default function* rootSaga() {
  yield all([ideasSaga(), authSaga()]);
}
