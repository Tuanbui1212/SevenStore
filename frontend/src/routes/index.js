import { employeeRoutes } from "./employeeRoutes";
import { productRoutes } from "./productRoutes";
import { customerRoutes } from "./customersRoutes";
import { mainRoutes } from "./mainRoutes";
import { accountRoutes } from "./accountRoutes";
import { cartRoutes } from "./cartRouters";

const publicRoutes = [
  ...customerRoutes,
  ...mainRoutes,
  ...employeeRoutes,
  ...productRoutes,
  ...accountRoutes,
  ...cartRoutes,
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
