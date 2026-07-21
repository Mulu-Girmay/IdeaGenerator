import { createSlice } from "@reduxjs/toolkit";
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
    // addIdea(state ,action){
    //   action =
    // }
  },
});

export const {} = ideasSlice.actions;

export default ideasSlice.reducer;
