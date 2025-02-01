import { t } from "i18next";

import { Staff } from "@/database/tables";
import axiosClient from "@/lib/axois-client";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";

export default function Director() {
  const [staffs, setStaffs] = useState<
    | {
        director: Staff;
      }
    | undefined
  >(undefined);

  const initialize = async () => {
    try {
      const response = await axiosClient.get(`staff/director`);

      if (response.status === 200) {
        setStaffs({ director: response.data.director });
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
          src={staffs?.director.profile || ""}
          alt="Director"
        />
        <p className="mb-2 font-bold">{t("director_stuff")}</p>
        <p className="mb-2 font-bold text-neutral-500">{t("Director")}</p>
        <p className="text-sm text-neutral-500">
          {t("name")}: {staffs?.director.name}
        </p>
        <p className="text-sm text-neutral-500">{t("job")}: Director of IRD</p>
        <p className="text-sm text-neutral-500">
          {t("contact")}: {staffs?.director?.contact}
        </p>
        <p className="text-sm text-neutral-500">
          {t("email")}: {staffs?.director.email}
        </p>
      </div>
    </>
  );
}
