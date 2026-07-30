import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./features/auth/LoginPage";
import IdeasPage from "./pages/IdeasPage";
import IdeaList from "./features/ideas/IdeaList";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/idea" element={<IdeasPage />} />
    </Routes>
  );
}

export default App;
