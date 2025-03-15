import {
  Breadcrumb,
  BreadcrumbHome,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/custom-ui/Breadcrumb/Breadcrumb";
import { LockKeyhole } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

export default function SuperReportsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleGoHome = () => navigate("/dashboard", { replace: true });
  return (
    <div className="px-2 pt-2 flex flex-col gap-y-[2px] relative select-none rtl:text-2xl-rtl ltr:text-xl-ltr">
      <Breadcrumb>
        <BreadcrumbHome onClick={handleGoHome} />
        <BreadcrumbSeparator />
        <BreadcrumbItem>{t("reports")}</BreadcrumbItem>
      </Breadcrumb>
      <div className=" flex flex-col items-center my-auto h-full justify-center mt-32 bg-primary/5 w-fit mx-auto rounded-xl p-6 gap-y-2">
        <LockKeyhole className="text-orange-500 size-[32px]" />
        <h1 className="text-[20px] text-justify">{t("under_testing")}</h1>
      </div>
    </div>
  );
}
