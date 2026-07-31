import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./features/auth/LoginPage";
import IdeasPage from "./pages/IdeasPage";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "./features/auth/authSlice";

function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        path="/idea"
        element={isAuthenticated ? <IdeasPage /> : <Navigate to="/" />}
      />
    </Routes>
  );
}

export default App;
