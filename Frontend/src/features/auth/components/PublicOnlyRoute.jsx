import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

const PublicOnlyRoute = ({ children }) => {
  const { user, authChecked } = useAuth();

  if (!authChecked) {
    return (
      <main>
        <h1>Loading...</h1>
      </main>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicOnlyRoute;
