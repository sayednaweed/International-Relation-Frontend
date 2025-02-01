import { t } from "i18next";

import { Staff } from "@/database/tables";
type DirectorProps = {
  director: Staff | undefined;
};
export default function Director(props: DirectorProps) {
  return (
    <>
      {/* Director */}
      <div className="flex flex-col items-center">
        <img
          className="size-24 rounded-full"
          src={props.director?.profile || ""}
          alt="Director"
        />
        <p className="mb-2 font-bold">{t("director_stuff")}</p>
        <p className="mb-2 font-bold text-neutral-500">{t("Director")}</p>
        <p className="text-sm text-neutral-500">
          {t("name")}: {props.director?.name}
        </p>
        <p className="text-sm text-neutral-500">{t("job")}: Director of IRD</p>
        <p className="text-sm text-neutral-500">
          {t("contact")}: {props.director?.contact}
        </p>
        <p className="text-sm text-neutral-500">
          {t("email")}: {props.director?.email}
        </p>
      </div>
    </>
  );
}
