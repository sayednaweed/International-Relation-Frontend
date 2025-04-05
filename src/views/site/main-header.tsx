import NavLink from "@/components/custom-ui/navbar/NavLink";
import { AlignJustify } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
const addresses = ["home", "ngos", "news", "about"];

export default function MainHeader() {
  const location = useLocation();
  const headerRef = useRef<HTMLHeadingElement>(null);
  const { t, i18n } = useTranslation();
  const collapse = () => {
    if (headerRef.current) {
      if (headerRef.current?.clientHeight === 90)
        headerRef.current.style.height = "fit-content";
      else headerRef.current.style.height = "90px";
    }
  };
  const link =
    location.pathname === "/" || location.pathname === "/home"
      ? "home"
      : location.pathname.slice(1);
  const [activeLink, setActiveLink] = useState(link);

  const setLink = (link: string) => setActiveLink(link);
  const sidebarComponents: JSX.Element[] = useMemo(() => {
    return addresses.map((item, index) => (
      <NavLink
        to={`/${item}`}
        key={index}
        time={index + 3}
        title={item}
        setLink={setLink}
        activeLink={activeLink}
      />
    ));
  }, [location.pathname, i18n.language]);
  return (
    <>
      <header
        ref={headerRef}
        className={`bg-fourth dark:bg-transparent dark:shadow-none dark:border-b dark:border-slate-700 h-[90px] xxl:h-fit px-3 pt-3 pb-12 xxl:pb-3 sm:px-6 md:px-12 shadow-md select-none overflow-hidden text-white`}
      >
        <header className="grid grid-cols-2 gap-y-8 sm:gap-y-4 xxl:flex xxl:justify-between">
          <div className="flex items-center justify-end gap-3 justify-self-start">
            <img
              className="xxl:h-16 h-12"
              src={`${import.meta.env.VITE_API_BASE_URL}/images/app-logo.png`}
              alt="logo"
            />
            <h1 className="font-bold ltr:text-lg-ltr ltr:sm:text-2xl-ltr rtl:text-xl-rtl rtl:sm:text-4xl-rtl text-white">
              {t("app_name")}
            </h1>
          </div>
          <AlignJustify
            onClick={collapse}
            className="size-[28px] place-self-center justify-self-end cursor-pointer xxl:invisible"
          />
          <div className="flex flex-col col-span-2 border-t xxl:border-none pt-8 xxl:pt-0 xxl:flex-row xxl:gap-x-6 gap-y-2 items-center rtl:text-xl-rtl">
            {sidebarComponents}
          </div>
        </header>
      </header>
    </>
  );
}
