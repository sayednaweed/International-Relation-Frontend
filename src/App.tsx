import {
  getAdminRouter,
  getDebuggerRouter,
  getDonorRouter,
  getGuestRouter,
  getNgoRouter,
  getSuperRouter,
  getUserRouter,
} from "./routes/routes";
import { useGeneralAuthState } from "./context/AuthContextProvider";
import { RoleEnum } from "./lib/constants";

export default function App() {
  const { user, loading, authenticated } = useGeneralAuthState();
  if (loading) return;
  let routes = null;
  if (!authenticated) routes = getGuestRouter();
  else {
    routes =
      user.role.role == RoleEnum.donor
        ? getDonorRouter(user, authenticated)
        : user.role.role == RoleEnum.super
        ? getSuperRouter(user, authenticated)
        : user.role.role == RoleEnum.user
        ? getUserRouter(user, authenticated)
        : user.role.role == RoleEnum.admin
        ? getAdminRouter(user, authenticated)
        : user.role.role == RoleEnum.ngo
        ? getNgoRouter(user, authenticated)
        : user.role.role == RoleEnum.debugger
        ? getDebuggerRouter(user, authenticated)
        : getGuestRouter();
  }
  return routes;
}
