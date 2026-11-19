import ListCustomer from "../pages/Customers/List";
import EditCustomer from "../pages/Customers/Edit";

import Dashboard from "../components/Layout/Dashboard";
import OnlyHeader from "../components/Layout/OnlyHeader";

const customerRoutes = [
  {
    path: "/dashboard/customers",
    component: ListCustomer,
    layout: Dashboard,
    roles: ["admin", "staff"],
  },
  {
    path: "/dashboard/customers/:id",
    component: EditCustomer,
    layout: OnlyHeader,
    roles: ["admin", "staff"],
  },
];

export { customerRoutes };
