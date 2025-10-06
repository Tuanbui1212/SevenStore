import { employeeRoutes } from "./employeeRoutes";
import { productRoutes } from "./productRoutes";
import { mainRoutes } from "./mainRoutes";

const publicRoutes = [...mainRoutes, ...employeeRoutes, ...productRoutes];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
