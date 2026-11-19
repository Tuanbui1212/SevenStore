import Order from "../pages/Order";
import OrderDetail from "../pages/OrderDetail";
import MyOrders from "../pages/MyOrder";
import Dashboard from "../components/Layout/Dashboard";
import OnlyHeader from "../components/Layout/OnlyHeader";

export const orderRoutes = [
  {
    path: "/my-orders",
    component: MyOrders,
  },
  {
    path: "/dashboard/orders",
    component: Order,
    layout: Dashboard,
    roles: ["admin", "staff"],
  },
  {
    path: "/dashboard/orders/manage/:type",
    component: Order,
    layout: Dashboard,
    roles: ["admin", "staff"],
  },
  {
    path: "/dashboard/orders/:id",
    component: OrderDetail,
    layout: OnlyHeader,
    roles: ["admin", "staff"],
  },
];
