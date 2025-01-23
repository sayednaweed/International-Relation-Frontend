import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router";
import NewSection from "./news/news-section";
import SliderSection from "./news/slider";
import { t } from "i18next";
import AnimHomeIcon from "@/components/custom-ui/icons/AnimHomeIcon";

export default function HomePage() {
  return (
    <div>
      <div className="px-2 pt-2 flex flex-col gap-y-[2px] relative select-none rtl:text-2xl-rtl ltr:text-xl-ltr">
        <Breadcrumb className="bg-card w-fit py-1 ltr:ps-3 ltr:pe-8 rtl:pe-3 rtl:ps-8 rounded-md border">
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to="/dashboard">
                <AnimHomeIcon />
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="rtl:rotate-180" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-tertiary">
                {t("Home")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <SliderSection />
      <NewSection />
    </div>
  );
}
