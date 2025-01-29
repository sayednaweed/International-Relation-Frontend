import NavLink from "@/components/custom-ui/navbar/NavLink";
import { AlignJustify } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
const addresses = ["home", "ngos", "news", "about"];

export default function MainHeader() {
  const location = useLocation();
  const headerRef = useRef<HTMLHeadingElement>(null);
  const { t } = useTranslation();
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

  return (
    <>
      <header
        ref={headerRef}
        className={`bg-fourth dark:bg-transparent dark:shadow-none dark:border-b dark:border-slate-700 h-[90px] xxl:h-fit px-3 pt-3 pb-12 xxl:pb-3 sm:px-6 md:px-12 shadow-md select-none overflow-hidden text-white`}
      >
        <header className="grid grid-cols-2 gap-y-4 xxl:flex xxl:justify-between">
          <div className="flex items-center justify-end gap-3 justify-self-start">
            <img
              className="h-16"
              src="http://127.0.0.1:8000/images/app-logo.png"
              alt="logo"
            />
            <h1 className="font-bold rtl:text-4xl-rtl text-white">
              {t("app_name")}
            </h1>
          </div>
          <AlignJustify
            onClick={collapse}
            className="size-[28px] place-self-center justify-self-end cursor-pointer xxl:invisible"
          />
          <div className="flex flex-col col-span-2 border-t xxl:border-none pt-8 xxl:pt-0 xxl:flex-row xxl:gap-x-6 gap-y-2 items-center rtl:text-xl-rtl">
            {addresses.map((item, index) => (
              <NavLink
                to={`/${item}`}
                key={index}
                time={index + 3}
                title={item}
                setLink={setLink}
                activeLink={activeLink}
              />
            ))}
          </div>
        </header>
      </header>
    </>
  );
}
