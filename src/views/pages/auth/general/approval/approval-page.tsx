import AnimHomeIcon from "@/components/custom-ui/icons/AnimHomeIcon";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import ApprovalTab from "./tabs/approval-tab";
import { UserPermission } from "@/database/tables";
import { PermissionEnum } from "@/lib/constants";
import { useUserAuthState } from "@/context/AuthContextProvider";
import { useMemo } from "react";

export default function ApprovalPage() {
  const { t } = useTranslation();
  const { user } = useUserAuthState();

  const per: UserPermission = user?.permissions.get(
    PermissionEnum.approval.name
  ) as UserPermission;
  const tableList = useMemo(
    () =>
      Array.from(per.sub).map(([key, _subPermission], index: number) => {
        return key == PermissionEnum.approval.sub.user ? (
          <TabsTrigger
            key={index}
            value={key.toString()}
            className="rtl:flex-row-reverse"
          >
            {t("user")}
          </TabsTrigger>
        ) : key == PermissionEnum.approval.sub.ngo ? (
          <TabsTrigger
            key={index}
            value={key.toString()}
            className="rtl:flex-row-reverse"
          >
            {t("ngo")}
          </TabsTrigger>
        ) : (
          <TabsTrigger
            key={index}
            value={key.toString()}
            className="rtl:flex-row-reverse"
          >
            {t("donor")}
          </TabsTrigger>
        );
      }),
    []
  );
  return (
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
              {t("approval")}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Tabs
        className="mt-8 border rounded-lg p-2 h-full"
        defaultValue={per.sub.values().next().value?.id.toString()}
      >
        <TabsList className="overflow-x-auto overflow-y-hidden w-full justify-start">
          {tableList}
        </TabsList>
        <TabsContent value={PermissionEnum.approval.sub.user.toString()}>
          <ApprovalTab pendingUrl={""} approvedUrl={""} rejectedUrl={""} />
        </TabsContent>
        <TabsContent value={PermissionEnum.approval.sub.ngo.toString()}>
          <ApprovalTab pendingUrl={""} approvedUrl={""} rejectedUrl={""} />
        </TabsContent>
        <TabsContent value={PermissionEnum.approval.sub.donor.toString()}>
          <ApprovalTab pendingUrl={""} approvedUrl={""} rejectedUrl={""} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
