import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { Idea } from "./types";
import {
  getAllIdeasRequest,
  selectIdeasList,
  selectIdeasStatus,
  selectIdeasError,
  deleteIdeaRequest,
} from "./ideasSlice";

function IdeaList() {
  const dispatch = useDispatch();
  const ideas = useSelector(selectIdeasList);
  const status = useSelector(selectIdeasStatus);
  const error = useSelector(selectIdeasError);

  useEffect(() => {
    if (status === "idle") {
      dispatch(getAllIdeasRequest());
    }
  }, [status, dispatch]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this idea?")) {
      dispatch(deleteIdeaRequest({ id }));
    }
  };

  if (status === "loading" && ideas.length === 0) {
    return <p className="status-message">Loading ideas...</p>;
  }

  if (error) {
    return (
      <p className="status-message" style={{ color: "red" }}>
        {error}
      </p>
    );
  }

  if (ideas.length === 0) {
    return (
      <p className="status-message">
        No ideas yet. Be the first to submit one!
      </p>
    );
  }

  return (
    <div>
      <ul className="idea-list">
        {ideas.map((idea) => (
          <li key={idea._id} className="idea-card">
            <h3>{idea.title}</h3>
            <p>{idea.details}</p>
            <small>
              Created:{" "}
              {idea.createdAt
                ? new Date(idea.createdAt).toLocaleDateString()
                : "N/A"}
            </small>
            <button
              onClick={() => handleDelete(idea._id)}
              style={{
                marginLeft: "10px",
                padding: "5px 10px",
                background: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default IdeaList;
