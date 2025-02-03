import { Staff } from "@/database/tables";
import axiosClient from "@/lib/axois-client";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import CachedImage from "@/components/custom-ui/image/CachedImage";
import Shimmer from "@/components/custom-ui/shimmer/Shimmer";
import { useTranslation } from "react-i18next";

export default function Manager() {
  const { t, i18n } = useTranslation();
  const [manager, setManager] = useState<Staff | undefined>(undefined);

  const initialize = async () => {
    try {
      const response = await axiosClient.get(`staff/public/manager`);

      if (response.status === 200) {
        setManager(response.data.manager);
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
    <>
      {manager ? (
        <div className="flex flex-col items-center">
          <CachedImage
            src={manager.picture}
            alt="Avatar"
            shimmerClassName="size-[86px] mx-auto shadow-lg border border-primary/30 rounded-full"
            className="size-[86px] object-center object-cover mx-auto shadow-lg border border-primary/50 rounded-full"
          />

          <p className=" font-bold mt-2 mb-6 text-primary ltr:text-4xl-ltr self-center ">
            {t("manager")}
          </p>
          <div className="grid grid-cols-[auto_auto] gap-x-6 text-primary ">
            <p className="ltr:font-semibold font-bold rtl:text-[19px]">
              {t("name")}:
            </p>
            <p className="rtl:text-3xl-rtl text-primary/85">{manager?.name}</p>
            <p className="ltr:font-semibold font-bold rtl:text-[19px]">
              {t("job")}:
            </p>
            <p className="rtl:text-3xl-rtl text-primary/85">{t("manager")}</p>
            <p className="ltr:font-semibold font-bold rtl:text-[19px]">
              {t("contact")}:
            </p>
            <p className="text-[17px] rtl:text-end" dir="ltr">
              {manager?.contact}
            </p>
            <p className="ltr:font-semibold font-bold rtl:text-[19px]">
              {t("email")}:
            </p>
            <p className="text-[17px] rtl:text-end" dir="ltr">
              {manager?.email}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-y-2">
          <Shimmer className="size-[86px] !mt-6 mx-auto shadow-lg border border-primary/30 rounded-full" />
          <Shimmer className="h-[32px]" />
          <Shimmer className="h-[32px]" />
          <Shimmer className="h-[32px]" />
          <Shimmer className="h-[32px]" />
        </div>
      )}
    </>
  );
}
