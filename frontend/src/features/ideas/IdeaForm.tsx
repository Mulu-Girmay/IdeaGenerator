import { useState, type MouseEvent } from "react";
import SubmitButton from "../../components/SubmitButton";

function IdeaForm() {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("Submitting idea:", { title, details });
  };

  return (
    <div>
      <form className="idea-form">
        <h2>Submit a new idea</h2>

        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Solar-powered backpack"
        />

        <label htmlFor="details">Description</label>
        <textarea
          id="details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Describe your idea..."
          rows={4}
        />

        <SubmitButton type="submit" onClick={handleSubmit}>
          Submit idea
        </SubmitButton>
      </form>
    </div>
  );
}

export default IdeaForm;
