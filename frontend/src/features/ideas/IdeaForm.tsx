import { useState, type FormEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SubmitButton from "../../components/SubmitButton";
import {
  createIdeaRequest,
  selectIdeasStatus,
  selectIdeasError,
  selectIdeasSuccess,
  clearIdeasSuccess,
} from "./ideasSlice";

function IdeaForm() {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const status = useSelector(selectIdeasStatus);
  const error = useSelector(selectIdeasError);
  const success = useSelector(selectIdeasSuccess);

  useEffect(() => {
    if (success) {
      setTitle("");
      setDetails("");
      setTimeout(() => {
        dispatch(clearIdeasSuccess());
      }, 3000);
    }
  }, [success, dispatch]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !details.trim()) {
      return;
    }
    dispatch(
      createIdeaRequest({ title: title.trim(), details: details.trim() }),
    );
  };

  // const isLoading = status === "loading";

  return (
    <div>
      <form className="idea-form" onSubmit={handleSubmit}>
        <h2>Submit a new idea</h2>

        {error && (
          <div
            className="error-message"
            style={{ color: "red", marginBottom: "10px" }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            className="success-message"
            style={{ color: "green", marginBottom: "10px" }}
          >
            Idea created successfully!
          </div>
        )}

        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Solar-powered backpack"
          required
          // disabled={isLoading}
        />

        <label htmlFor="details">Description</label>
        <textarea
          id="details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Describe your idea..."
          rows={4}
          required
          // disabled={isLoading}
        />

        <SubmitButton type="submit">Submit idea</SubmitButton>
      </form>
    </div>
  );
}

export default IdeaForm;
