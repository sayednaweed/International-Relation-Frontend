import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Languages, MapPinHouse } from "lucide-react";
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
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();

  const per: UserPermission = user?.permissions.get(
    PermissionEnum.about.name
  ) as UserPermission;

  return (
    <div className="px-2 pt-2 flex flex-col relative select-none rtl:text-2xl-rtl ltr:text-xl-ltr ">
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
      <Tabs
        dir={direction}
        defaultValue="tech"
        className="flex flex-col items-center"
      >
        <TabsList className="px-0 pb-1 h-fit  flex-wrap overflow-x-auto overflow-y-hidden justify-center gap-y-1 gap-x-1">
          <TabsTrigger
            value="tech"
            className="gap-x-1 bg-card shadow rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
          >
            <Languages className="size-[16px] ltr:mr-1 rtl:ml-1" />
            {t("technical")}
          </TabsTrigger>
          <TabsTrigger
            value="dir"
            className="gap-x-1 bg-card shadow  rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
          >
            <Briefcase className="size-[16px] ltr:mr-1 rtl:ml-1" />
            {t("director")}
          </TabsTrigger>
          <TabsTrigger
            value="manag"
            className="gap-x-1 bg-card shadow rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
          >
            <MapPinHouse className="size-[16px] ltr:mr-1 rtl:ml-1" />
            {t("manager")}
          </TabsTrigger>
          <TabsTrigger
            value="slid"
            className="gap-x-1 bg-card shadow rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
          >
            <MapPinHouse className="size-[16px] ltr:mr-1 rtl:ml-1" />
            {t("slider")}
          </TabsTrigger>
          <TabsTrigger
            value="off"
            className="gap-x-1 bg-card shadow rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
          >
            <MapPinHouse className="size-[16px] ltr:mr-1 rtl:ml-1" />
            {t("office")}
          </TabsTrigger>
        </TabsList>
        {Array.from(per.sub).map(([key, subPermission]) => {
          const hasEdit = subPermission.edit == true;
          const hasAdd = subPermission.add == true;
          const hasView = subPermission.view == true;
          const hasRemove = subPermission.delete == true;
          return (
            <>
              {key == PermissionEnum.about.sub.technical ? (
                <TabsContent value="tech" className="w-full px-4 pt-8">
                  <TechnicalSection
                    hasEdit={hasEdit}
                    hasAdd={hasAdd}
                    hasView={hasView}
                    hasRemove={hasRemove}
                  />
                </TabsContent>
              ) : key == PermissionEnum.about.sub.director ? (
                <TabsContent value="dir" className="w-full px-4 pt-8">
                  <DirectorSection hasEdit={hasEdit} hasAdd={hasAdd} />
                </TabsContent>
              ) : key == PermissionEnum.about.sub.manager ? (
                <TabsContent value="manag" className="w-full px-4 pt-8">
                  <ManagerSection hasEdit={hasEdit} hasAdd={hasAdd} />
                </TabsContent>
              ) : key == PermissionEnum.about.sub.slider ? (
                <TabsContent value="slid" className="w-full px-4 pt-8">
                  <SliderSection />
                </TabsContent>
              ) : key == PermissionEnum.about.sub.office ? (
                <TabsContent value="off" className="w-full px-4 pt-8">
                  <OfficeSection hasEdit={hasEdit} hasAdd={hasAdd} />
                </TabsContent>
              ) : undefined}
            </>
          );
        })}
      </Tabs>
    </div>
  );
}
