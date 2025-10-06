import ListCustomer from "../pages/Customers/List";
import EditCustomer from "../pages/Customers/Edit";

import Dashboard from "../components/Layout/Dashboard";
import OnlyHeader from "../components/Layout/OnlyHeader";

const customerRoutes = [
  {
    path: "/dashboard/customers",
    component: ListCustomer,
    layout: Dashboard,
  },
  {
    path: "/dashboard/customers/:id",
    component: EditCustomer,
    layout: OnlyHeader,
  },
];

export { customerRoutes };
