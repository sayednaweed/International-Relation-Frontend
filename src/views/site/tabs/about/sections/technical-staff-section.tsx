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
  const [technical, setTechnical] = useState<Staff[]>([]);

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
    <div className="space-y-2 text-center self-start mx-auto">
      <p className="font-bold min-w-[190px] uppercase bg-tertiary text-white shadow-xl rounded-full rtl:text-3xl-rtl p-2">
        {t("technical_sup")}
      </p>
      <div className="relative rounded-xl overflow-auto p-4">
        <div className="grid justify-items-center -space-y-3 xxl:space-y-0 xxl:flex xxl:-space-x-3 xxl:rtl:space-x-reverse">
          {technical.length != 0 ? (
            technical?.map((tech, index) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger>
                    <CachedImage
                      key={index}
                      src={tech.picture}
                      alt="Avatar"
                      shimmerClassName="size-24 shadow-lg border border-primary/30 rounded-full"
                      className=" size-24 object-center object-cover shadow-lg border-[2px] border-primary rounded-full"
                      routeIdentifier={"public"}
                    />
                  </TooltipTrigger>
                  <TooltipContent className="pb-6 pt-4 max-w-44 xxl:max-w-96 bg-card border">
                    <CachedImage
                      src={tech.picture}
                      alt="Avatar"
                      shimmerClassName="size-[86px] mx-auto shadow-lg border border-primary/30 rounded-full"
                      className="size-[86px] object-center object-cover mx-auto shadow-lg border border-primary/50 rounded-full "
                      routeIdentifier={"public"}
                    />
                    <div className="grid grid-cols-[auto_1fr] mt-6 text-start gap-x-2 text-primary">
                      <p className="ltr:font-semibold font-bold rtl:text-xl-rtl">
                        {t("name")}:
                      </p>
                      <p className="rtl:text-xl-rtl text-primary/85 text-wrap break-words">
                        {tech.name}
                      </p>
                      <p className="ltr:font-semibold font-bold rtl:text-xl-rtl">
                        {t("contact")}:
                      </p>
                      <p className="text-[14px] rtl:pt-[3px] text-wrap break-words">
                        {tech.contact}
                      </p>
                      <p className="ltr:font-semibold font-bold rtl:text-xl-rtl">
                        {t("email")}:
                      </p>
                      <p className="text-[14px] rtl:pt-[3px] text-wrap break-words">
                        {tech.email}
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))
          ) : (
            <Shimmer className="size-[86px] mx-auto shadow-lg border border-primary/30 rounded-full" />
          )}
        </div>
      </div>
    </div>
  );
}
