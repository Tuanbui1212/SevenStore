import Order from "../pages/Order";
import OrderDetail from "../pages/OrderDetail";

import Dashboard from "../components/Layout/Dashboard";
import OnlyHeader from "../components/Layout/OnlyHeader";

export const orderRoutes = [
  {
    path: "/dashboard/orders/manage/:type",
    component: Order,
    layout: Dashboard,
  },

  {
    path: "/dashboard/orders/:id",
    component: OrderDetail,
    layout: OnlyHeader,
  },
];
