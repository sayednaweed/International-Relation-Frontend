import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { NgoTable } from "./ngo-table";
import NgoHeader from "./ngo-header";
import {
  Breadcrumb,
  BreadcrumbHome,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/custom-ui/Breadcrumb/Breadcrumb";
export default function NgoPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleGoBack = () => navigate(-1);
  const handleGoHome = () => navigate("/dashboard", { replace: true });
  return (
    <div className="px-2 pt-2 flex flex-col gap-y-[2px] relative select-none rtl:text-2xl-rtl ltr:text-xl-ltr">
      <Breadcrumb>
        <BreadcrumbHome onClick={handleGoHome} />
        <BreadcrumbSeparator />
        <BreadcrumbItem onClick={handleGoBack}>{t("ngos")}</BreadcrumbItem>
      </Breadcrumb>
      <NgoHeader />
      <NgoTable />
    </div>
  );
}
