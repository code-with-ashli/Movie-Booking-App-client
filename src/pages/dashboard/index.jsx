import { useEffect } from "react";
import { useLoggedInUser } from "../../hooks/auth.hooks";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "./admin-dashboard";
import UserDashboard from "./user-dashboard";

const DashBoardPage = () => {
  const { data: user, isLoading } = useLoggedInUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) navigate("/sign-in");
  }, [isLoading, navigate, user]);
  0;
  if (isLoading) return <h1>Loading</h1>;

  return (
    <>
    {user.role === 'admin' && <AdminDashboard />}
    {user.role === 'user' && <UserDashboard />}
    </>
  );
};

export default DashBoardPage;
