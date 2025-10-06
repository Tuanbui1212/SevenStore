import ListProducts from "../pages/Products/List";
import CreateProducts from "../pages/Products/Create";
import EditProducts from "../pages/Products/Edit";
import TrashProduct from "../pages/Products/Trash";

import Dashboard from "../components/Layout/Dashboard";
import OnlyHeader from "../components/Layout/OnlyHeader";

export const productRoutes = [
  {
    path: "/dashboard/products",
    component: ListProducts,
    layout: Dashboard,
  },
  {
    path: "/dashboard/products/create",
    component: CreateProducts,
    layout: OnlyHeader,
  },
  {
    path: "/dashboard/products/trash",
    component: TrashProduct,
    layout: OnlyHeader,
  },
  {
    path: "/dashboard/products/:id",
    component: EditProducts,
    layout: OnlyHeader,
  },
];
