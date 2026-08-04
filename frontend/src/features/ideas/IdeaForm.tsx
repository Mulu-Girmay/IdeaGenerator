import { useState, type FormEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SubmitButton from "../../components/SubmitButton";
import {
  createIdeaRequest,
  selectIdeasStatus,
  selectIdeasError,
  selectIdeasSuccess,
  clearIdeasSuccess,
  clearIdeasError,
  resetIdeasStatus,
} from "./ideasSlice";
interface IdeaFormProps {
  onClose?: () => void;
}
function IdeaForm({ onClose }: IdeaFormProps) {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const status = useSelector(selectIdeasStatus);
  const error = useSelector(selectIdeasError);
  const success = useSelector(selectIdeasSuccess);

  useEffect(() => {
    return () => {
      dispatch(resetIdeasStatus());
      dispatch(clearIdeasSuccess());
      dispatch(clearIdeasError());
    };
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setTitle("");
      setDetails("");
      setTimeout(() => {
        dispatch(clearIdeasSuccess());
        dispatch(resetIdeasStatus());
      }, 3000);
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearIdeasError());
        dispatch(resetIdeasStatus()); // Reset status after error
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedDetails = details.trim();

    if (!trimmedTitle || !trimmedDetails) {
      alert("Please fill in both title and description");
      return;
    }

    dispatch(
      createIdeaRequest({
        title: trimmedTitle,
        details: trimmedDetails,
      }),
    );
    setTitle("");
    setDetails("");
  };

  const isLoading = status === "loading";

  return (
    <div>
      <form className="idea-form" onSubmit={handleSubmit}>
        <h2>Submit a new idea</h2>

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
            Idea created successfully!
          </div>
        )}

        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          name="title"
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Solar-powered backpack"
          required
          disabled={isLoading}
          style={{ opacity: isLoading ? 0.6 : 1 }}
        />

        <label htmlFor="details">Description</label>
        <textarea
          id="details"
          value={details}
          name="details"
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Describe your idea..."
          rows={4}
          required
          disabled={isLoading}
          style={{ opacity: isLoading ? 0.6 : 1 }}
        />

        <SubmitButton type="submit" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit idea"}
        </SubmitButton>
      </form>
    </div>
  );
}

export default IdeaForm;
