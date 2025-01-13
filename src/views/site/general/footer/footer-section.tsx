import { useTranslation } from "react-i18next";

function FooterSection() {
  const { t } = useTranslation();

  return (
    <>
      <div className="p-4 flex flex-col justify-start bg-primary text-primary-foreground dark:bg-card dark:text-card-foreground rtl:text-2xl-rtl ltr:text-lg-ltr">
        <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
          <h1 className="font-semibold">{`${t("address")}: `}</h1>
          <span className=" rtl:text-lg-rtl text-primary-foreground/90 dark:text-card-foreground/90">
            {t("moph_address")}
          </span>
          <h1 className="font-semibold">{`${t("email")}: `}</h1>
          <span className="rtl:text-[14px] rtl:pt-1 text-primary-foreground/90 dark:text-card-foreground/90">
            info@moph.gov.af
          </span>
          <h1 className="font-semibold">{`${t("contact")}: `}</h1>
          <span className="rtl:text-[14px] rtl:pt-1 text-primary-foreground/90 dark:text-card-foreground/90">
            +93(0) 20 230 1374
          </span>
        </div>
        <div dir="ltr" className="flex gap-x-4 items-center mt-4">
          <p className="text-xl-ltr font-semibold">Powered By:</p>
          <p className="text-lg-ltr text-primary-foreground/90 dark:text-card-foreground/90">
            Ministry of Public Health, Information Technology Directorate
          </p>
        </div>
      </div>
      <div className="text-center text-lg-ltr p-4 bg-primary text-primary-foreground dark:bg-card dark:text-card-foreground dark:border-primary/10 border-t border-border/30">
        {"Copyright © 2024 | MOPH. All Rights Reserved"}
      </div>
    </>
  );
}

export default FooterSection;
