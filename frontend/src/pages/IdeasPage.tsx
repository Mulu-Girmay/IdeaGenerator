import IdeaForm from "../features/ideas/IdeaForm";
import IdeaList from "../features/ideas/IdeaList";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectAuth } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function IdeasPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(selectAuth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Idea Tracker</h1>
        <p>Capture and browse ideas from the whole team.</p>
      </header>
      <main className="app-main">
        <IdeaForm />
        <IdeaList />
      </main>
    </div>
  );
}

export default IdeasPage;
//  const handleLogout = () => {
//     dispatch(logout());
//     navigate("/");
//   };
