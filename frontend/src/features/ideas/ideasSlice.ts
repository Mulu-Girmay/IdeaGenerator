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
  success: boolean;
}

const initialState: IdeasState = {
  list: [],
  status: "idle",
  error: null,
  success: false,
};

const ideasSlice = createSlice({
  name: "ideas",
  initialState,
  reducers: {
    createIdeaRequest: (state, action: PayloadAction<CreateIdeaPayload>) => {
      state.status = "loading";
      state.error = null;
      state.success = false;
    },
    createIdeaSuccess: (state, action: PayloadAction<Idea>) => {
      state.status = "succeeded";
      state.list.push(action.payload);
      state.success = true;
    },
    createIdeaFailure: (state, action: PayloadAction<string>) => {
      state.status = "failed";
      state.error = action.payload;
      state.success = false;
    },

    getAllIdeasRequest: (state) => {
      state.status = "loading";
      state.error = null;
    },
    getAllIdeasSuccess: (state, action: PayloadAction<Idea[]>) => {
      state.status = "succeeded";
      state.list = action.payload;
    },
    getAllIdeasFailure: (state, action: PayloadAction<string>) => {
      state.status = "failed";
      state.error = action.payload;
    },

    updateIdeaRequest: (state, action: PayloadAction<UpdateIdeaPayload>) => {
      state.status = "loading";
      state.error = null;
      state.success = false;
    },
    updateIdeaSuccess: (state, action: PayloadAction<Idea>) => {
      state.status = "succeeded";
      const index = state.list.findIndex(
        (idea) => idea._id === action.payload._id,
      );
      if (index !== -1) {
        state.list[index] = action.payload;
      }
      state.success = true;
    },
    updateIdeaFailure: (state, action: PayloadAction<string>) => {
      state.status = "failed";
      state.error = action.payload;
      state.success = false;
    },

    deleteIdeaRequest: (state, action: PayloadAction<DeleteIdeaPayload>) => {
      state.status = "loading";
      state.error = null;
      state.success = false;
    },
    deleteIdeaSuccess: (state, action: PayloadAction<string>) => {
      state.status = "succeeded";
      state.list = state.list.filter((idea) => idea._id !== action.payload);
      state.success = true;
    },
    deleteIdeaFailure: (state, action: PayloadAction<string>) => {
      state.status = "failed";
      state.error = action.payload;
      state.success = false;
    },

    clearIdeasError: (state) => {
      state.error = null;
    },
    clearIdeasSuccess: (state) => {
      state.success = false;
    },
    resetIdeasStatus: (state) => {
      state.status = "idle";
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
