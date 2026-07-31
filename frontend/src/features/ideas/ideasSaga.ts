import { call, put, takeLatest, takeEvery, delay } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import { ideaApi } from "../../api/axios";
import {
  createIdeaRequest,
  createIdeaSuccess,
  createIdeaFailure,
  getAllIdeasRequest,
  getAllIdeasSuccess,
  getAllIdeasFailure,
  updateIdeaRequest,
  updateIdeaSuccess,
  updateIdeaFailure,
  deleteIdeaRequest,
  deleteIdeaSuccess,
  deleteIdeaFailure,
} from "./ideasSlice";
import { Idea } from "./types";

function* handleCreateIdea(action: any): SagaIterator {
  try {
    const { title, details } = action.payload;
    const response: { data: Idea } = yield call(ideaApi.createIdea, {
      title,
      details,
    });
    yield put(createIdeaSuccess(response.data));
    yield delay(3000);
    yield put({ type: "ideas/clearIdeasSuccess" });
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to create idea";
    yield put(createIdeaFailure(message));
    yield delay(5000);
    yield put({ type: "ideas/clearIdeasError" });
  }
}

function* handleGetAllIdeas(): SagaIterator {
  try {
    const response: { data: Idea[] } = yield call(ideaApi.getIdeas);
    yield put(getAllIdeasSuccess(response.data));
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to fetch ideas";
    yield put(getAllIdeasFailure(message));
    yield delay(5000);
    yield put({ type: "ideas/clearIdeasError" });
  }
}

function* handleUpdateIdea(action: any): SagaIterator {
  try {
    const { id, title, details } = action.payload;
    const response: { data: Idea } = yield call(ideaApi.updateIdea, id, {
      title,
      details,
    });
    yield put(updateIdeaSuccess(response.data));
    yield delay(3000);
    yield put({ type: "ideas/clearIdeasSuccess" });
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to update idea";
    yield put(updateIdeaFailure(message));
    yield delay(5000);
    yield put({ type: "ideas/clearIdeasError" });
  }
}

function* handleDeleteIdea(action: any): SagaIterator {
  try {
    const { id } = action.payload;
    yield call(ideaApi.deleteIdea, id);
    yield put(deleteIdeaSuccess(id));
    yield delay(3000);
    yield put({ type: "ideas/clearIdeasSuccess" });
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to delete idea";
    yield put(deleteIdeaFailure(message));
    yield delay(5000);
    yield put({ type: "ideas/clearIdeasError" });
  }
}

export function* ideasSaga() {
  yield takeLatest(createIdeaRequest.type, handleCreateIdea);
  yield takeLatest(getAllIdeasRequest.type, handleGetAllIdeas);
  yield takeLatest(updateIdeaRequest.type, handleUpdateIdea);
  yield takeLatest(deleteIdeaRequest.type, handleDeleteIdea);
}
