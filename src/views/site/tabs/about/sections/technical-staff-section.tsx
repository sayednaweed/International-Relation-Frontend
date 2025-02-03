import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useEffect, useState } from "react";
import axiosClient from "@/lib/axois-client";

import { toast } from "@/components/ui/use-toast";
import { Staff } from "@/database/tables";
import CachedImage from "@/components/custom-ui/image/CachedImage";
import Shimmer from "@/components/custom-ui/shimmer/Shimmer";
import { useTranslation } from "react-i18next";

export default function TechnicalStaff() {
  const { t, i18n } = useTranslation();
  const [technical, setTechnical] = useState<Staff[] | undefined>(undefined);

  const initialize = async () => {
    try {
      const response = await axiosClient.get(`staff/public/technicalSupports`);

      if (response.status === 200) {
        setTechnical(response.data.technicalStaff);
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
    <div className="space-y-2 text-center">
      <p className="font-bold uppercase bg-tertiary text-white shadow-lg rounded-full rtl:text-3xl-rtl p-2">
        {t("technical_sup")}
      </p>
      <div className="relative rounded-xl overflow-auto p-4">
        <div className="flex -space-x-3">
          {technical?.map((tech, index) => (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  {technical ? (
                    <CachedImage
                      key={index}
                      src={tech.picture}
                      alt="Avatar"
                      shimmerClassName="size-24 shadow-lg border border-primary/30 rounded-full"
                      className="size-24 object-center object-cover shadow-lg border-[2px] border-primary  rounded-full"
                    />
                  ) : (
                    <Shimmer className="size-[86px] mx-auto shadow-lg border border-primary/30 rounded-full" />
                  )}
                </TooltipTrigger>
                <TooltipContent className="flex flex-col items-start pt-6 pb-12 px-4">
                  <CachedImage
                    src={tech.picture}
                    alt="Avatar"
                    shimmerClassName="size-[86px] mx-auto shadow-lg border border-primary/30 rounded-full"
                    className="size-[86px] object-center object-cover mx-auto shadow-lg border border-primary/50 rounded-full"
                  />
                  <p className=" font-bold text-primary mt-2 mb-6 ltr:text-4xl-ltr self-center">
                    {t("Software Developer ")}
                  </p>
                  {technical ? (
                    <div className="grid grid-cols-[auto_auto] text-start gap-x-6 text-primary">
                      <p className="ltr:font-semibold rtl:text-3xl-rtl">
                        {t("name")}:
                      </p>
                      <p className="rtl:text-2xl-rtl">{tech.name}</p>
                      <p className="ltr:font-semibold rtl:text-3xl-rtl">
                        {t("job")}:
                      </p>
                      <p className="rtl:text-2xl-rtl">{t("director")}</p>
                      <p className="ltr:font-semibold rtl:text-3xl-rtl">
                        {t("contact")}:
                      </p>
                      <p className="rtl:text-2xl-rtl">{tech.contact}</p>
                      <p className="ltr:font-semibold rtl:text-3xl-rtl">
                        {t("email")}:
                      </p>
                      <p className="rtl:text-2xl-rtl">{tech.email}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center ">
                      <Shimmer className="size-[86px] !mt-6 mx-auto shadow-lg border border-primary/30 rounded-full" />
                      <Shimmer className="h-[32px]" />
                      <Shimmer className="h-[32px]" />
                      <Shimmer className="h-[32px]" />
                      <Shimmer className="h-[32px]" />
                    </div>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    </div>
  );
}
