import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./features/auth/LoginPage";
import IdeasPage from "./pages/IdeasPage";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "./features/auth/authSlice";

function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected routes */}
      <Route
        path="/idea"
        element={isAuthenticated ? <IdeasPage /> : <Navigate to="/login" />}
      />

      {/* Default route - redirect based on auth status */}
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/idea" /> : <Navigate to="/login" />
        }
      />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
