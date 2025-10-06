import { employeeRoutes } from "./employeeRoutes";
import { productRoutes } from "./productRoutes";
import { customerRoutes } from "./customersRoutes";
import { mainRoutes } from "./mainRoutes";

const publicRoutes = [
  ...customerRoutes,
  ...mainRoutes,
  ...employeeRoutes,
  ...productRoutes,
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
