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
    // Create Idea
    createIdeaRequest: (state, action: PayloadAction<CreateIdeaPayload>) => {
      state.status = "loading";
      state.error = null;
      state.success = false;
      console.log("📝 Create Idea Request:", action.payload);
    },
    createIdeaSuccess: (state, action: PayloadAction<Idea>) => {
      state.status = "succeeded"; // ✅ Set to succeeded
      state.list = [action.payload, ...state.list];
      state.success = true;
      state.error = null;
      console.log("✅ Create Idea Success:", action.payload);
    },
    createIdeaFailure: (state, action: PayloadAction<string>) => {
      state.status = "failed"; // ✅ Set to failed
      state.error = action.payload;
      state.success = false;
      console.log("❌ Create Idea Failure:", action.payload);
    },

    // Get All Ideas
    getAllIdeasRequest: (state) => {
      state.status = "loading";
      state.error = null;
      console.log("📝 Get All Ideas Request");
    },
    getAllIdeasSuccess: (state, action: PayloadAction<Idea[]>) => {
      state.status = "succeeded";
      state.list = action.payload;
      state.error = null;
      console.log("✅ Get All Ideas Success:", action.payload.length);
    },
    getAllIdeasFailure: (state, action: PayloadAction<string>) => {
      state.status = "failed";
      state.error = action.payload;
      console.log("❌ Get All Ideas Failure:", action.payload);
    },

    // Update Idea
    updateIdeaRequest: (state, action: PayloadAction<UpdateIdeaPayload>) => {
      state.status = "loading";
      state.error = null;
      state.success = false;
      console.log("📝 Update Idea Request:", action.payload);
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
      state.error = null;
      console.log("✅ Update Idea Success:", action.payload);
    },
    updateIdeaFailure: (state, action: PayloadAction<string>) => {
      state.status = "failed";
      state.error = action.payload;
      state.success = false;
      console.log("❌ Update Idea Failure:", action.payload);
    },

    // Delete Idea
    deleteIdeaRequest: (state, action: PayloadAction<DeleteIdeaPayload>) => {
      state.status = "loading";
      state.error = null;
      state.success = false;
      console.log("📝 Delete Idea Request:", action.payload);
    },
    deleteIdeaSuccess: (state, action: PayloadAction<string>) => {
      state.status = "succeeded";
      state.list = state.list.filter((idea) => idea._id !== action.payload);
      state.success = true;
      state.error = null;
      console.log("✅ Delete Idea Success:", action.payload);
    },
    deleteIdeaFailure: (state, action: PayloadAction<string>) => {
      state.status = "failed";
      state.error = action.payload;
      state.success = false;
      console.log("❌ Delete Idea Failure:", action.payload);
    },

    clearIdeasError: (state) => {
      state.error = null;
    },
    clearIdeasSuccess: (state) => {
      state.success = false;
    },
    resetIdeasStatus: (state) => {
      state.status = "idle"; // ✅ Reset to idle
      state.error = null;
      state.success = false;
      console.log("🔄 Reset Ideas Status");
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
