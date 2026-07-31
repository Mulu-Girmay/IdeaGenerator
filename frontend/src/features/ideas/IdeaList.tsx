import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { Idea } from "./types";
import {
  getAllIdeasRequest,
  selectIdeasList,
  selectIdeasStatus,
  selectIdeasError,
  deleteIdeaRequest,
} from "./ideasSlice";
import EditIdeaForm from "./EditIdeaForm";
interface IdeaListProps {
  onEdit?: () => void;
  onCancelEdit?: () => void;
}
function IdeaList({ onEdit, onCancelEdit }: IdeaListProps) {
  const dispatch = useDispatch();
  const ideas = useSelector(selectIdeasList);
  const status = useSelector(selectIdeasStatus);
  const error = useSelector(selectIdeasError);

  const [editingId, setEditingId] = useState<string | null>(null);

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
  const handleEdit = (id: string) => {
    setEditingId(id);
    if (onEdit) {
      onEdit();
    }
  };
  const handleCancelEdit = () => {
    setEditingId(null);
    if (onCancelEdit) {
      onCancelEdit();
    }
  };
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
            {editingId === idea._id ? (
              <EditIdeaForm id={idea._id} onCancel={handleCancelEdit} />
            ) : (
              <>
                <h3>{idea.title}</h3>
                <p>{idea.details}</p>
                <small>
                  Created:{" "}
                  {idea.createdAt
                    ? new Date(idea.createdAt).toLocaleDateString()
                    : "N/A"}
                </small>
                <div style={{ marginTop: "10px" }}>
                  <button
                    onClick={() => handleEdit(idea._id)}
                    style={{
                      marginRight: "10px",
                      padding: "5px 15px",
                      background: "#517956",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(idea._id)}
                    style={{
                      padding: "5px 15px",
                      color: "white",
                      border: "none",
                      background: "#517956",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default IdeaList;
