import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Idea } from "./types";

export type IdeasStatus = "idle" | "loading" | "succeeded" | "failed";

export interface IdeasState {
  list: Idea[];
  status: IdeasStatus;
  error: string | null;
}

const initialState: IdeasState = {
  list: [],
  status: "idle",
  error: null,
};

const ideasSlice = createSlice({
  name: "ideas",
  initialState,
  reducers: {
    createIdeaRequest: (
      state,
      action: PayloadAction<{ title: string; description: string }>,
    ) => {
      state.status = "loading";
      state.error = null;
    },
    updateIdeaRequest: (
      state,
      action: PayloadAction<{ id: string; title: string; description: string }>,
    ) => {
      state.status = "loading";
      state.error = null;
    },
    deleteIdeaRequest: (state, action: PayloadAction<{ id: string }>) => {
      state.status = "loading";
      state.error = null;
    },
    AllIdeasRequest: (state, action: PayloadAction<{}>) => {
      state.status = "loading";
      state.error = null;
    },
  },
});

export const {
  createIdeaRequest,
  updateIdeaRequest,
  deleteIdeaRequest,
  AllIdeasRequest,
} = ideasSlice.actions;

export default ideasSlice.reducer;
