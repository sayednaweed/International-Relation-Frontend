import {
  Breadcrumb,
  BreadcrumbHome,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/custom-ui/Breadcrumb/Breadcrumb";
import HeaderSection from "./header/header-section";
import NewSection from "./news/news-section";
import { useTranslation } from "react-i18next";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <>
      <Breadcrumb className="mx-3 mt-3">
        <BreadcrumbHome />
        <BreadcrumbSeparator />
        <BreadcrumbItem>{t("home")}</BreadcrumbItem>
      </Breadcrumb>
      <HeaderSection />
      <NewSection />
    </>
  );
}
