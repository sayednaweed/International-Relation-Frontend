import {
  getAdminRouter,
  getDebuggerRouter,
  getDonorRouter,
  getGuestRouter,
  getNgoRouter,
  getSuperRouter,
  getUserRouter,
} from "./routes/routes";
import { useAuthState } from "./context/AuthContextProvider";
import { RoleEnum } from "./lib/constants";

export default function App() {
  const { user, loading, authenticated } = useAuthState();
  if (loading) return;
  let routes = null;
  if (!authenticated) routes = getGuestRouter();
  else {
    routes =
      user.role.role == RoleEnum.donor
        ? getDonorRouter(user)
        : user.role.role == RoleEnum.super
        ? getSuperRouter(user)
        : user.role.role == RoleEnum.user
        ? getUserRouter(user)
        : user.role.role == RoleEnum.admin
        ? getAdminRouter(user)
        : user.role.role == RoleEnum.ngo
        ? getNgoRouter(user)
        : user.role.role == RoleEnum.debugger
        ? getDebuggerRouter(user)
        : getGuestRouter();
  }
  return routes;
}
