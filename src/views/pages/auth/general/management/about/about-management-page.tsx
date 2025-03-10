import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TechnicalSection from "./sections/technical-section";
import { Link } from "react-router";
import AnimHomeIcon from "@/components/custom-ui/icons/AnimHomeIcon";
import { useTranslation } from "react-i18next";
import DirectorSection from "./sections/director-section";
import ManagerSection from "./sections/manager-section";
import OfficeSection from "./sections/office-section";
import { useUserAuthState } from "@/context/AuthContextProvider";
import { UserPermission } from "@/database/tables";
import { PermissionEnum } from "@/lib/constants";
import { useMemo } from "react";
import PicSection from "./sections/pic-section";

export default function AboutManagementPage() {
  const { user } = useUserAuthState();
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();

  const per: UserPermission = user?.permissions.get(
    PermissionEnum.about.name
  ) as UserPermission;

  const tableList = useMemo(
    () =>
      Array.from(per.sub).map(([key, _subPermission], index: number) => {
        return key == PermissionEnum.about.sub.technical ? (
          <TabsTrigger
            key={index}
            value={key.toString()}
            className="gap-x-1 bg-card shadow rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
          >
            {t("technical_sup")}
          </TabsTrigger>
        ) : key == PermissionEnum.about.sub.director ? (
          <TabsTrigger
            key={index}
            value={key.toString()}
            className="gap-x-1 bg-card shadow  rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
          >
            {t("director")}
          </TabsTrigger>
        ) : key == PermissionEnum.about.sub.manager ? (
          <TabsTrigger
            key={index}
            value={key.toString()}
            className="gap-x-1 bg-card shadow rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
          >
            {t("manager")}
          </TabsTrigger>
        ) : key == PermissionEnum.about.sub.pic ? (
          <TabsTrigger
            key={index}
            value={key.toString()}
            className="gap-x-1 bg-card shadow rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
          >
            {t("pic")}
          </TabsTrigger>
        ) : (
          key == PermissionEnum.about.sub.office && (
            <TabsTrigger
              key={index}
              value={key.toString()}
              className="gap-x-1 bg-card shadow rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
            >
              {t("office")}
            </TabsTrigger>
          )
        );
      }),
    []
  );

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
        defaultValue={per.sub.values().next().value?.id.toString()}
        className="flex flex-col items-center"
      >
        <TabsList className="px-0 pb-1 h-fit  flex-wrap overflow-x-auto overflow-y-hidden justify-center gap-y-1 gap-x-1">
          {tableList}
        </TabsList>
        <TabsContent
          value={PermissionEnum.about.sub.technical.toString()}
          className="w-full px-4 pt-8"
        >
          <TechnicalSection permission={per} />
        </TabsContent>
        <TabsContent
          value={PermissionEnum.about.sub.director.toString()}
          className="w-full px-4 pt-8"
        >
          <DirectorSection permission={per} />
        </TabsContent>
        <TabsContent
          value={PermissionEnum.about.sub.manager.toString()}
          className="w-full px-4 pt-8"
        >
          <ManagerSection permission={per} />
        </TabsContent>
        <TabsContent
          value={PermissionEnum.about.sub.pic.toString()}
          className="w-full px-4 pt-8"
        >
          <PicSection permission={per} />
        </TabsContent>
        <TabsContent
          value={PermissionEnum.about.sub.office.toString()}
          className="w-full px-4 pt-8"
        >
          <OfficeSection permission={per} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
