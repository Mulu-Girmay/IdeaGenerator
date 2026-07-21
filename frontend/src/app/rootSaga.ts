import { all } from "redux-saga/effects";
import { ideasSaga } from "../features/ideas/ideasSaga";

export default function* rootSaga() {
  yield all([ideasSaga()]);
}
