import Order from "../pages/Order";

import Dashboard from "../components/Layout/Dashboard";

export const orderRoutes = [
  {
    path: "/dashboard/orders",
    component: Order,
    layout: Dashboard,
  },
];
