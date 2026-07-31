import React, { FormEvent, useState, useEffect } from "react";
import SubmitButton from "../../components/SubmitButton";
import { useDispatch, useSelector } from "react-redux";
import {
  updateIdeaRequest,
  selectIdeasStatus,
  selectIdeasError,
  selectIdeasSuccess,
  clearIdeasSuccess,
  clearIdeasError,
  resetIdeasStatus,
  selectIdeasList,
} from "./ideasSlice";
interface EditIdeaFormProps {
  id: string;
  onCancel?: () => void;
}

const EditIdeaForm = ({ id, onCancel }: EditIdeaFormProps) => {
  const dispatch = useDispatch();
  const ideas = useSelector(selectIdeasList);
  const status = useSelector(selectIdeasStatus);
  const error = useSelector(selectIdeasError);
  const success = useSelector(selectIdeasSuccess);

  const ideaToEdit = ideas.find((idea) => idea._id === id);

  const [title, setTitle] = useState(ideaToEdit?.title || "");
  const [details, setDetails] = useState(ideaToEdit?.details || "");

  useEffect(() => {
    if (ideaToEdit) {
      setTitle(ideaToEdit.title);
      setDetails(ideaToEdit.details);
    }
  }, [ideaToEdit]);

  useEffect(() => {
    return () => {
      dispatch(clearIdeasSuccess());
      dispatch(clearIdeasError());
      dispatch(resetIdeasStatus());
    };
  }, [dispatch]);

  useEffect(() => {
    if (success && onCancel) {
      const timer = setTimeout(() => {
        onCancel();
        dispatch(clearIdeasSuccess());
        dispatch(resetIdeasStatus());
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [success, onCancel, dispatch]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(
      updateIdeaRequest({ id, title: title.trim(), details: details.trim() }),
    );
  };

  const isLoading = status === "loading";

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "20px",
        margin: "10px 0",
        borderRadius: "8px",
      }}
    >
      <form className="idea-form" onSubmit={handleSubmit}>
        <h2>Edit Idea</h2>

        {error && (
          <div
            className="error-message"
            style={{
              color: "red",
              marginBottom: "10px",
              padding: "10px",
              background: "#ffebee",
              borderRadius: "4px",
              border: "1px solid #ffcdd2",
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            className="success-message"
            style={{
              color: "green",
              marginBottom: "10px",
              padding: "10px",
              background: "#e8f5e9",
              borderRadius: "4px",
              border: "1px solid #c8e6c9",
            }}
          >
            Idea updated successfully!
          </div>
        )}

        <label htmlFor="edit-title">Title</label>
        <input
          id="edit-title"
          type="text"
          value={title}
          name="title"
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Solar-powered backpack"
          required
          disabled={isLoading}
          style={{ opacity: isLoading ? 0.6 : 1 }}
        />

        <label htmlFor="edit-details">Description</label>
        <textarea
          id="edit-details"
          value={details}
          name="details"
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Describe your idea..."
          rows={4}
          required
          disabled={isLoading}
          style={{ opacity: isLoading ? 0.6 : 1 }}
        />

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Idea"}
          </SubmitButton>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: "10px 20px",
                background: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EditIdeaForm;
