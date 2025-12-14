import ListAccount from "../pages/Account/List";
import CreatAccount from "../pages/Account/Create";

import Dashboard from "../components/Layout/Dashboard";

export const accountRoutes = [
  { path: "/dashboard/account", component: ListAccount, layout: Dashboard },
  {
    path: "/dashboard/account/:id",
    component: CreatAccount,
    layout: null,
  },
];
