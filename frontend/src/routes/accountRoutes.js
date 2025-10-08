import ListAccount from "../pages/Account/List";
import CreatAccount from "../pages/Account/Create";

import Dashboard from "../components/Layout/Dashboard";
import OnlyHeader from "../components/Layout/OnlyHeader";

export const accountRoutes = [
  { path: "/dashboard/account", component: ListAccount, layout: Dashboard },
  {
    path: "/dashboard/account/:id",
    component: CreatAccount,
    layout: OnlyHeader,
  },
];
