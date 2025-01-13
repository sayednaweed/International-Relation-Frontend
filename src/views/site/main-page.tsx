import { useTranslation } from "react-i18next";
import { Link, Outlet, useLocation } from "react-router";

export default function MainPage() {
  const location = useLocation();
  const activeTab = location.pathname;
  const { t } = useTranslation();

  return (
    <section>
      <header className="bg-primary dark:bg-secondary py-6 flex items-center justify-between px-4 rtl:text-2xl-rtl">
        <header className="flex text-primary-foreground space-x-4 rtl:gap-8 rtl:mr-4">
          <Link
            to="/home"
            className={`${
              (activeTab.startsWith("/home") || activeTab.length == 1) &&
              "border-b"
            }`}
          >
            {t("home")}
          </Link>
          <Link
            to="/ngos"
            className={`${
              (activeTab.startsWith("/ngos") || activeTab.length == 1) &&
              "border-b"
            }`}
          >
            {t("ngos")}
          </Link>
          <Link
            to="/news"
            className={`${
              (activeTab.startsWith("/news") || activeTab.length == 1) &&
              "border-b"
            }`}
          >
            {t("news")}
          </Link>
          <Link
            to="/about"
            className={`${activeTab.startsWith("/about") && "border-b"}`}
          >
            {t("about_us")}
          </Link>
        </header>
        <div className="flex items-center justify-end  gap-3 ">
          <h1 className="font-bold text-xl text-white">{t("app_name")}</h1>
          <img
            className="h-16"
            src="http://127.0.0.1:8000/images/app-logo.png"
            alt="logo"
          />
        </div>
      </header>
      <Outlet />
    </section>
  );
}
