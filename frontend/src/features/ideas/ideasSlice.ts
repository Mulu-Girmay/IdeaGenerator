import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  Idea,
  CreateIdeaPayload,
  UpdateIdeaPayload,
  DeleteIdeaPayload,
} from "./types";

export type IdeasStatus = "idle" | "loading" | "succeeded" | "failed";

export interface IdeasState {
  list: Idea[];
  status: IdeasStatus;
  error: string | null;
  createsuccess: boolean;
  updatesuccess: boolean;
  deletesuccess: boolean;
  success: boolean;
}

const initialState: IdeasState = {
  list: [],
  status: "idle",
  error: null,
  createsuccess: false,
  updatesuccess: false,
  deletesuccess: false,
  success: false,
};

const ideasSlice = createSlice({
  name: "ideas",
  initialState,
  reducers: {
    createIdeaRequest: (state, action: PayloadAction<CreateIdeaPayload>) => {
      state.status = "loading";
      state.error = null;
      state.createsuccess = false;
    },
    createIdeaSuccess: (state, action: PayloadAction<Idea>) => {
      state.status = "succeeded";
      state.list = [action.payload, ...state.list];
      state.createsuccess = true;
      state.error = null;
    },
    createIdeaFailure: (state, action: PayloadAction<string>) => {
      state.status = "failed";
      state.error = action.payload;
      state.createsuccess = false;
    },

    getAllIdeasRequest: (state) => {
      state.status = "loading";
      state.error = null;
    },
    getAllIdeasSuccess: (state, action: PayloadAction<Idea[]>) => {
      state.status = "succeeded";
      state.list = action.payload;
      state.error = null;
    },
    getAllIdeasFailure: (state, action: PayloadAction<string>) => {
      state.status = "failed";
      state.error = action.payload;
    },

    updateIdeaRequest: (state, action: PayloadAction<UpdateIdeaPayload>) => {
      state.status = "loading";
      state.error = null;
      state.updatesuccess = false;
    },
    updateIdeaSuccess: (state, action: PayloadAction<Idea>) => {
      state.status = "succeeded";
      const index = state.list.findIndex(
        (idea) => idea._id === action.payload._id,
      );
      if (index !== -1) {
        state.list[index] = action.payload;
      }
      state.updatesuccess = true;
      state.error = null;
    },
    updateIdeaFailure: (state, action: PayloadAction<string>) => {
      state.status = "failed";
      state.error = action.payload;
      state.updatesuccess = false;
    },

    // Delete Idea
    deleteIdeaRequest: (state, action: PayloadAction<DeleteIdeaPayload>) => {
      state.status = "loading";
      state.error = null;
      state.deletesuccess = false;
    },
    deleteIdeaSuccess: (state, action: PayloadAction<string>) => {
      state.status = "succeeded";
      state.list = state.list.filter((idea) => idea._id !== action.payload);
      state.deletesuccess = true;
      state.error = null;
    },
    deleteIdeaFailure: (state, action: PayloadAction<string>) => {
      state.status = "failed";
      state.error = action.payload;
      state.deletesuccess = false;
    },

    clearIdeasError: (state) => {
      state.error = null;
    },
    clearIdeasSuccess: (state) => {
      state.success = false;
    },
    resetIdeasStatus: (state) => {
      state.status = "idle";
      state.error = null;
      state.success = false;
    },
  },
});

export const {
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
  clearIdeasError,
  clearIdeasSuccess,
  resetIdeasStatus,
} = ideasSlice.actions;

export const selectIdeas = (state: { ideas: IdeasState }) => state.ideas;
export const selectIdeasList = (state: { ideas: IdeasState }) =>
  state.ideas.list;
export const selectIdeasStatus = (state: { ideas: IdeasState }) =>
  state.ideas.status;
export const selectIdeasError = (state: { ideas: IdeasState }) =>
  state.ideas.error;
export const selectIdeasSuccess = (state: { ideas: IdeasState }) =>
  state.ideas.success;

export default ideasSlice.reducer;
