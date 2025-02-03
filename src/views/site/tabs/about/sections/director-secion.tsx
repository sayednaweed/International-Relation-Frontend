import { Staff } from "@/database/tables";
import axiosClient from "@/lib/axois-client";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import CachedImage from "@/components/custom-ui/image/CachedImage";
import Shimmer from "@/components/custom-ui/shimmer/Shimmer";
import { useTranslation } from "react-i18next";

export default function Director() {
  const [director, setDirector] = useState<Staff | undefined>(undefined);
  const { t, i18n } = useTranslation();

  const initialize = async () => {
    try {
      const response = await axiosClient.get(`staff/public/director`);

      if (response.status === 200) {
        setDirector(response.data.director);
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
      {director ? (
        <div className="flex flex-col items-center">
          <CachedImage
            src={director.picture}
            alt="Avatar"
            shimmerClassName="size-[86px] mx-auto shadow-lg border border-primary/30 rounded-full"
            className="size-[86px] object-center object-cover mx-auto shadow-lg border border-primary/50 rounded-full"
          />
          <p className=" font-bold text-primary mt-2 mb-6 ltr:text-4xl-ltr self-center">
            {t("director")}
          </p>
          <div className="grid grid-cols-[auto_auto] gap-x-6 text-primary ">
            <p className="ltr:font-semibold rtl:text-3xl-rtl">{t("name")}:</p>
            <p className="rtl:text-2xl-rtl">{director?.name}</p>
            <p className="ltr:font-semibold rtl:text-3xl-rtl">{t("job")}:</p>
            <p className="rtl:text-2xl-rtl">{t("director")}</p>
            <p className="ltr:font-semibold rtl:text-3xl-rtl">
              {t("contact")}:
            </p>
            <p className="rtl:text-xl-rtl">{director?.contact}</p>
            <p className="ltr:font-semibold rtl:text-3xl-rtl">{t("email")}:</p>
            <p className="rtl:text-xl-rtl truncate">{director?.email}</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <Shimmer className="size-[86px] object-center object-cover mx-auto shadow-lg border border-primary/50 rounded-full" />
          <Shimmer className="h-[32px] mt-2 mb-2" />
          <Shimmer className="h-[32px] mb-2" />
          <Shimmer className="h-[32px] mb-2" />
          <Shimmer className="h-[32px]" />
        </div>
      )}
    </>
  );
}
