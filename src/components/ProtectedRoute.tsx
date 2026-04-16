import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/reduxHooks";

const ProtectedRoute = ({ children }: any) => {
  const user = useAppSelector((state) => state.auth.user);

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;