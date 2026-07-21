import IdeaForm from "../features/ideas/IdeaForm";
import IdeaList from "../features/ideas/IdeaList";
import { useState } from "react";
import type { IdeaListProps } from "../features/ideas/IdeaList";

function IdeasPage() {
  const [globalState, setGlobalState] = useState<IdeaListProps>({ list: [] });

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Idea Tracker</h1>
        <p>Capture and browse ideas from the whole team.</p>
      </header>
      <main className="app-main">
        <IdeaForm />
        <IdeaList list={globalState.list} />
      </main>
    </div>
  );
}

export default IdeasPage;
