import { toast } from "@/components/ui/use-toast";
import axiosClient from "@/lib/axois-client";
import i18n from "@/lib/i18n";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
type FooterPorps = {
  id: string;
  address: string;
  contact: string;
  email: string;
};

function FooterSection() {
  const [footer, setFooter] = useState<FooterPorps>();
  const { t } = useTranslation();
  const initialize = async () => {
    try {
      const response = await axiosClient.get(`staff/public/office`);

      if (response.status === 200) {
        setFooter(response.data.office);
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: error.response.data?.message || t("something_went_wrong"),
      });
    }
  };

  useEffect(() => {
    initialize();
  }, [i18n.language]);

  return (
    <div>
      <div className="p-8 flex flex-col justify-start bg-primary text-primary-foreground dark:bg-card dark:text-card-foreground rtl:text-2xl-rtl ltr:text-lg-ltr">
        <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
          <h1 className="font-semibold">{`${t("address")}: `}</h1>
          <span className=" rtl:text-lg-rtl text-primary-foreground/90 dark:text-card-foreground/90">
            {t("moph_address")}
          </span>

          <h1 className="font-semibold">{`${t("email")}: `}</h1>
          <span className="rtl:text-[14px] rtl:pt-1 text-primary-foreground/90 dark:text-card-foreground/90">
            {footer?.email}
          </span>
          <h1 className="font-semibold">{`${t("contact")}: `}</h1>
          <span className="rtl:text-[14px] rtl:pt-1 text-primary-foreground/90 dark:text-card-foreground/90">
            {footer?.contact}
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
    </div>
  );
}

export default FooterSection;
