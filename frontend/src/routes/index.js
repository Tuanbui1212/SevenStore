import Home from "../pages/Home";
import Search from "../pages/Search";
import Product from "../pages/Product";
import ProductDetail from "../pages/ProductDetail";

import Employee from "../pages/Employee/List";
import CreatEmployee from "../pages/Employee/Create";
import EditEmployee from "../pages/Employee/Edit";

import ListProducts from "../pages/Products/List";
import CreateProducts from "../pages/Products/Create";
import EditProducts from "../pages/Products/Edit";

import Dashboard from "../components/Layout/Dashboard";
import OnlyHeader from "../components/Layout/OnlyHeader";

const publicRoutes = [
  // -- Employee --
  {
    path: "/dashboard/employee/create",
    component: CreatEmployee,
    layout: OnlyHeader,
  },
  {
    path: "/dashboard/employee/:id",
    component: EditEmployee,
    layout: OnlyHeader,
  },
  { path: "/dashboard/employee", component: Employee, layout: Dashboard },

  // -- Product --
  { path: "/dashboard/products", component: ListProducts, layout: Dashboard },
  {
    path: "/dashboard/products/create",
    component: CreateProducts,
    layout: OnlyHeader,
  },
  {
    path: "/dashboard/products/:id",
    component: EditProducts,
    layout: OnlyHeader,
  },

  { path: "/product/:brand", component: Product },
  { path: "/search", component: Search },
  { path: "/", component: Home },
  { path: "/:slug", component: ProductDetail },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
