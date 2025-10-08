import Home from "../pages/Home";
import Search from "../pages/Search";
import Product from "../pages/Product";
import ProductDetail from "../pages/ProductDetail";
import Login from "../pages/Login";

import OnlyHeader from "../components/Layout/OnlyHeader";

export const mainRoutes = [
  { path: "/", component: Home },
  { path: "/search", component: Search },
  { path: "/login", component: Login, layout: OnlyHeader },
  { path: "/product/:brand", component: Product },
  { path: "/product/:brand/:slug", component: ProductDetail },
];
