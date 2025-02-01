import { t } from "i18next";

import { useEffect, useState } from "react";
import axiosClient from "@/lib/axois-client";

import { toast } from "@/components/ui/use-toast";
import { Staff } from "@/database/tables";

export default function TechnicalStaff() {
  const [staffs, setStaffs] = useState<
    | {
        technicalStaff: Staff[];
      }
    | undefined
  >(undefined);

  const initialize = async () => {
    try {
      const response = await axiosClient.get(`staff/technicalSupports`);

      if (response.status === 200) {
        setStaffs({ technicalStaff: response.data.technicalStaff });
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
  }, []);

  return (
    <>
      {/* Technical Support */}
      <div>
        <p className="mb-2 font-bold">{t("technical_support")}</p>
        <div className="relative rounded-xl overflow-auto p-8">
          <div className="flex -space-x-3">
            {staffs?.technicalStaff?.map((tech, index) => (
              <div
                key={index}
                className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-500 shadow-lg ring-2 ring-white dark:ring-slate-900"
              >
                <img
                  className="size-14 rounded-full"
                  src={tech.profile}
                  alt={tech.name}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
