import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";
import { useEffect } from "react";
import { useAuthStore } from "./store/auth.store";

function App() {
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    // Listen for 401 unauthorized events dispatched by the Axios interceptor
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener("unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("unauthorized", handleUnauthorized);
    };
  }, [logout]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
