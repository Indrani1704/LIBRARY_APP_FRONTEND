import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../hooks/reduxHooks";

const AdminProtected = () => {
  const { user } = useAppSelector((s: any) => s.auth);

  //fallback to sessionStorage
  const storedUser = sessionStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;

  const currentUser = user || parsedUser;

  //  Not logged in
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  //  Not admin
  if (currentUser.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Admin allowed
  return <Outlet />;
};

export default AdminProtected;