import { useEffect, useState, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginRequest,
  selectAuthLoading,
  selectAuthError,
  selectAuth,
  clearError,
} from "./authSlice";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector(selectAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/idea");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Clear error when component unmounts
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }
    dispatch(loginRequest({ email, password }));
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Log in</h2>
        <p className="login-subtitle">Welcome back to Idea Tracker.</p>

        {error && (
          <div
            className="error-message"
            style={{ color: "red", marginBottom: "10px" }}
          >
            {error}
          </div>
        )}

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          disabled={loading}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
