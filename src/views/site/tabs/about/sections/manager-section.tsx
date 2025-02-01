import { t } from "i18next";

import { Staff } from "@/database/tables";
import axiosClient from "@/lib/axois-client";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";

export default function Manager() {
  const [staffs, setStaffs] = useState<
    | {
        manager: Staff;
      }
    | undefined
  >(undefined);

  const initialize = async () => {
    try {
      const response = await axiosClient.get(`staff/manager`);

      if (response.status === 200) {
        setStaffs({ manager: response.data.manager });
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
      {/* Director */}
      <div className="flex flex-col items-center">
        <img
          className="size-24 rounded-full"
          src={staffs?.manager?.profile || ""}
          alt="Director"
        />
        <p className="mb-2 font-bold">{t("Administrative Staff")}</p>
        <p className="mb-2 font-bold text-neutral-500">{t("Manager")}</p>
        <p className="text-sm text-neutral-500">
          {t("name")}: {staffs?.manager?.name}
        </p>
        <p className="text-sm text-neutral-500">{t("job")}: Director of IRD</p>
        <p className="text-sm text-neutral-500">
          {t("contact")}: {staffs?.manager?.contact}
        </p>
        <p className="text-sm text-neutral-500">
          {t("email")}: {staffs?.manager?.email}
        </p>
      </div>
    </>
  );
}
