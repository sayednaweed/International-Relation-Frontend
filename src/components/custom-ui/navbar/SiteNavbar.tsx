import ProfileDropdown from "./ProfileDropdown";
import LanguageChanger from "./LanguageChanger";
import { Link } from "react-router";
import Notification from "./Notification";
import { useTranslation } from "react-i18next";
import { useGeneralAuthState } from "@/context/AuthContextProvider";
import ThemeSwitch from "./ThemeSwitch";

export default function SiteNavbar() {
  const { loading, authenticated } = useGeneralAuthState();
  const { t } = useTranslation();

  if (loading) return;
  return (
    <div
      className={`flex items-center ltr:pr-6 rtl:pl-4 py-1 border-b border-primary/5 bg-[rgba(0,0,0,0)] z-20 backdrop-blur-[20px] sticky top-0 justify-end gap-x-1`}
    >
      {authenticated ? (
        <>
          <Notification />
          <ProfileDropdown root={"dashboard"} rootPath="/dashboard" />
        </>
      ) : (
        <div className="flex justify-start px-8 items-center gap-x-3 w-full rtl:text-md-rtl ltr:text-lg-ltr">
          <Link
            to="/login"
            className="bg-card border border-tertiary hover:bg-tertiary duration-300 transition-all hover:text-primary-foreground rounded-full py-1 px-4 font-semibold"
          >
            {t("login")}
          </Link>
        </div>
      )}

      <ThemeSwitch />
      <LanguageChanger />
    </div>
  );
}
