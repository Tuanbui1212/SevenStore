import ListAccount from "../pages/Account/List";
import CreatAccount from "../pages/Account/Create";
import MyAccount from "../pages/MyAccount";
import DashboardOverview from "../pages/DashboardOverview";
import StatisticalReport from "../pages/StatisticalReport";
import Dashboard from "../components/Layout/Dashboard";

export const accountRoutes = [
  { path: "/myAccount", component: MyAccount },
  {
    path: "/dashboard",
    component: DashboardOverview,
    layout: Dashboard,
    roles: ["admin", "staff"],
  },
  {
    path: "/dashboard/report",
    component: StatisticalReport,
    layout: Dashboard,
    roles: ["admin"],
  },
  {
    path: "/dashboard/account",
    component: ListAccount,
    layout: Dashboard,
    roles: ["admin"],
  },
  {
    path: "/dashboard/account/create",
    component: CreatAccount,
    layout: null,
    roles: ["admin"],
  },
  {
    path: "/dashboard/account/:id",
    component: CreatAccount,
    layout: null,
    roles: ["admin"],
  },
];
