import { employeeRoutes } from "./employeeRoutes";
import { productRoutes } from "./productRoutes";
import { customerRoutes } from "./customersRoutes";
import { mainRoutes } from "./mainRoutes";
import { accountRoutes } from "./accountRoutes";

const publicRoutes = [
  ...customerRoutes,
  ...mainRoutes,
  ...employeeRoutes,
  ...productRoutes,
  ...accountRoutes,
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
