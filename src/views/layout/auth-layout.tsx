import DashboardNavbar from "@/components/custom-ui/navbar/DashboardNavbar";
import NastranSidebar from "@/components/custom-ui/sidebar/NastranSidebar";
import { Toaster } from "@/components/ui/toaster";
import { useGeneralAuthState } from "@/context/AuthContextProvider";
import { handleKeyPress } from "@/lib/keyboard";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

export default function AuthLayout() {
  const { user, logoutUser, logoutNgo, logoutDonor } = useGeneralAuthState();
  const navigate = useNavigate();
  const logout = async () => {
    if (user.role.name === "ngo") {
      await logoutNgo();
    } else if (user.role.name === "donor") {
      await logoutDonor();
    } else {
      await logoutUser();
    }
  };
  useEffect(() => {
    // Add event listener when the component mounts
    document.addEventListener("keydown", (event) =>
      handleKeyPress({
        logout,
        event,
        navigate,
      })
    );

    // Remove event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", (event) =>
        handleKeyPress({
          logout,
          event,
          navigate,
        })
      );
    };
  }, []);
  return (
    <section className="min-h-[100vh] max-h-[100vh] flex bg-secondary select-none pb-12">
      <NastranSidebar />
      <main className="min-h-full flex-1 flex flex-col overflow-auto">
        <DashboardNavbar />
        <Outlet />
      </main>
      <Toaster />
    </section>
  );
}
