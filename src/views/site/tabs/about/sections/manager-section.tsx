import { t } from "i18next";

import { Staff } from "@/database/tables";
type ManagerProps = {
  manager: Staff | undefined;
};
export default function Manager(props: ManagerProps) {
  return (
    <>
      <div className="flex flex-col items-center">
        <img
          className="size-24 rounded-full"
          src={props.manager?.profile || ""}
          alt="Manager"
        />
        <p className="mb-2 font-bold">{t("administrative_stuff")}</p>
        <p className="mb-2 font-bold text-neutral-500">{t("manager")}</p>
        <p className="text-sm text-neutral-500">
          {t("name")}: {props.manager?.name}
        </p>
        <p className="text-sm text-neutral-500">{t("job")}: Manager of IRD</p>
        <p className="text-sm text-neutral-500">
          {t("contact")}: {props.manager?.contact}
        </p>
        <p className="text-sm text-neutral-500">
          {t("email")}: {props.manager?.email}
        </p>
      </div>
    </>
  );
}
