import { Outlet } from "react-router-dom";
import LayoutDashboard from "../../components/layout-dashboard";

const Dashboard = () => {
  return (
    <LayoutDashboard>
      <Outlet />
    </LayoutDashboard>
  );
};

export default Dashboard;
