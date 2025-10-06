import Home from "../pages/Home";
import Search from "../pages/Search";
import Product from "../pages/Product";
import ProductDetail from "../pages/ProductDetail";

export const mainRoutes = [
  { path: "/", component: Home },
  { path: "/search", component: Search },
  { path: "/product/:brand", component: Product },
  { path: "/:slug", component: ProductDetail },
];
