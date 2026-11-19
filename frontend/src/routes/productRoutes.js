import ListProducts from "../pages/Products/List";
import CreateProducts from "../pages/Products/Create";
import EditProducts from "../pages/Products/Edit";
import TrashProduct from "../pages/Products/Trash";

import Dashboard from "../components/Layout/Dashboard";

export const productRoutes = [
  {
    path: "/dashboard/products",
    component: ListProducts,
    layout: Dashboard,
    roles: ["admin", "staff"],
  },
  {
    path: "/dashboard/products/create",
    component: CreateProducts,
    layout: null,
    roles: ["admin", "staff"],
  },
  {
    path: "/dashboard/products/trash",
    component: TrashProduct,
    layout: null,
    roles: ["admin", "staff"],
  },
  {
    path: "/dashboard/products/:id",
    component: EditProducts,
    layout: null,
    roles: ["admin", "staff"],
  },
];
