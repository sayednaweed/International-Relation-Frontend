import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import TechnicalSection from "./sections/technical-section";
import { Link } from "react-router";
import AnimHomeIcon from "@/components/custom-ui/icons/AnimHomeIcon";
import { useTranslation } from "react-i18next";
import DirectorSection from "./sections/director-section";
import ManagerSection from "./sections/manager-section";
import OfficeSection from "./sections/office-section";
import SliderSection from "./sections/slider-section";
import { useUserAuthState } from "@/context/AuthContextProvider";
import { UserPermission } from "@/database/tables";
import { PermissionEnum } from "@/lib/constants";

export default function AboutManagementPage() {
  const { user } = useUserAuthState();

  const { t } = useTranslation();
  const per: UserPermission = user?.permissions.get(
    PermissionEnum.about.name
  ) as UserPermission;

  return (
    <div className="px-2 pt-2 flex flex-col relative select-none rtl:text-2xl-rtl ltr:text-xl-ltr gap-y-12">
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
              {t("management/about")}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {Array.from(per.sub).map(([key, subPermission]) => {
        const hasEdit = subPermission.edit == true;
        const hasAdd = subPermission.add == true;
        const hasView = subPermission.view == true;
        const hasRemove = subPermission.delete == true;
        return (
          <>
            {key == PermissionEnum.about.sub.technical ? (
              <TechnicalSection
                hasEdit={hasEdit}
                hasAdd={hasAdd}
                hasView={hasView}
                hasRemove={hasRemove}
              />
            ) : key == PermissionEnum.about.sub.manager ? (
              <ManagerSection hasEdit={hasEdit} hasAdd={hasAdd} />
            ) : key == PermissionEnum.about.sub.director ? (
              <DirectorSection hasEdit={hasEdit} hasAdd={hasAdd} />
            ) : key == PermissionEnum.about.sub.slider ? (
              <SliderSection />
            ) : key == PermissionEnum.about.sub.office ? (
              <OfficeSection hasEdit={hasEdit} hasAdd={hasAdd} />
            ) : undefined}
          </>
        );
      })}
    </div>
  );
}
