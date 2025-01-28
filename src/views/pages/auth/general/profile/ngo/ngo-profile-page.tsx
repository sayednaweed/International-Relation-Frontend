import { useTranslation } from "react-i18next";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import AnimHomeIcon from "@/components/custom-ui/icons/AnimHomeIcon";
import { useNgoAuthState } from "@/context/AuthContextProvider";
import { Link } from "react-router";

export default function NgoProfilePage() {
  const { user } = useNgoAuthState();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-y-6 px-3 mt-2">
      <Breadcrumb className="rtl:text-2xl-rtl ltr:text-xl-ltr">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/dashboard">
              <AnimHomeIcon className=" text-primary" />
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="rtl:rotate-180" />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-primary/75">
              {t("profile")}
            </BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="rtl:rotate-180" />
          <BreadcrumbItem>
            <BreadcrumbPage>{user?.username}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {/* Cards */}
      NgoProfilePage
    </div>
  );
}
