import IdeaForm from "../features/ideas/IdeaForm";
import IdeaList from "../features/ideas/IdeaList";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectAuth } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function IdeasPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(selectAuth);
  const [showCreateForm, setShowCreateForm] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        dispatch(logout());
        navigate("/login");
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const expiryTime = payload.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();

        if (currentTime >= expiryTime) {
          console.log("Token expired, logging out...");
          dispatch(logout());
          navigate("/login");
        }
      } catch (error) {
        console.error("Invalid token:", error);
        dispatch(logout());
        navigate("/login");
      }
    };

    checkToken();

    const interval = setInterval(checkToken, 60000);

    return () => clearInterval(interval);
  }, [dispatch, navigate]);

  // const handleLogout = () => {
  //   dispatch(logout());
  //   navigate("/login");
  // };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1>Idea Tracker</h1>
            <p>Capture and browse ideas from the whole team.</p>
          </div>
          <div>
            <span style={{ marginRight: "10px" }}>
              Welcome, {user?.username || "User"}!
            </span>
          </div>
        </div>
      </header>
      <main className="app-main">
        {showCreateForm && (
          <IdeaForm onClose={() => setShowCreateForm(false)} />
        )}
        <IdeaList
          onEdit={() => setShowCreateForm(false)}
          onCancelEdit={() => setShowCreateForm(true)}
        />
      </main>
    </div>
  );
}

export default IdeasPage;
