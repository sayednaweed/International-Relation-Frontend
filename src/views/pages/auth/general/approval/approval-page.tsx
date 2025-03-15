import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import ApprovalTab from "./tabs/approval-tab";
import { UserPermission } from "@/database/tables";
import { CACHE, PermissionEnum } from "@/lib/constants";
import { useUserAuthState } from "@/context/AuthContextProvider";
import { useMemo } from "react";
import CustomSelect from "@/components/custom-ui/select/CustomSelect";
import useCacheDB from "@/lib/indexeddb/useCacheDB";
import {
  Breadcrumb,
  BreadcrumbHome,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/custom-ui/Breadcrumb/Breadcrumb";

export default function ApprovalPage() {
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();
  const { updateComponentCache, getComponentCache } = useCacheDB();
  const { user } = useUserAuthState();

  const tabStyle =
    "data-[state=active]:border-tertiary data-[state=active]:border-b-[2px] h-full rounded-none";

  const per: UserPermission = user?.permissions.get(
    PermissionEnum.approval.name
  ) as UserPermission;
  const tableList = useMemo(
    () =>
      Array.from(per.sub).map(([key, _subPermission], index: number) => {
        return key == PermissionEnum.approval.sub.user ? (
          <TabsTrigger key={index} value={key.toString()} className={tabStyle}>
            {t("user")}
          </TabsTrigger>
        ) : key == PermissionEnum.approval.sub.ngo ? (
          <TabsTrigger key={index} value={key.toString()} className={tabStyle}>
            {t("ngo")}
          </TabsTrigger>
        ) : (
          <TabsTrigger key={index} value={key.toString()} className={tabStyle}>
            {t("donor")}
          </TabsTrigger>
        );
      }),
    []
  );
  const navigate = useNavigate();
  const handleGoHome = () => navigate("/dashboard", { replace: true });
  return (
    <div className="px-2 pt-2 flex flex-col relative select-none rtl:text-2xl-rtl ltr:text-xl-ltr">
      <Breadcrumb>
        <BreadcrumbHome onClick={handleGoHome} />
        <BreadcrumbSeparator />
        <BreadcrumbItem>{t("approval")}</BreadcrumbItem>
      </Breadcrumb>
      <CustomSelect
        paginationKey={CACHE.APPROVAL_TABLE_PAGINATION_COUNT}
        options={[
          { value: "10", label: "10" },
          { value: "20", label: "20" },
          { value: "50", label: "50" },
        ]}
        className="w-fit self-end"
        updateCache={updateComponentCache}
        getCache={async () =>
          await getComponentCache(CACHE.APPROVAL_TABLE_PAGINATION_COUNT)
        }
        placeholder={`${t("select")}...`}
        emptyPlaceholder={t("no_options_found")}
        rangePlaceholder={t("count")}
        onChange={async (_value: string) => {}}
      />
      <Tabs
        dir={direction}
        className="border p-0 h-full space-y-0"
        defaultValue={per.sub.values().next().value?.id.toString()}
      >
        <TabsList className="overflow-x-auto overflow-y-hidden bg-card w-full justify-start p-0 m-0 rounded-none">
          {tableList}
        </TabsList>
        <TabsContent value={PermissionEnum.approval.sub.user.toString()}>
          <ApprovalTab
            pendingUrl={"pending/user/approvals"}
            approvedUrl={"approved/user/approvals"}
            rejectedUrl={"rejected/user/approvals"}
          />
        </TabsContent>
        <TabsContent value={PermissionEnum.approval.sub.ngo.toString()}>
          <ApprovalTab
            pendingUrl={"pending/ngo/approvals"}
            approvedUrl={"approved/ngo/approvals"}
            rejectedUrl={"rejected/ngo/approvals"}
          />
        </TabsContent>
        <TabsContent value={PermissionEnum.approval.sub.donor.toString()}>
          <ApprovalTab
            pendingUrl={"pending/donor/approvals"}
            approvedUrl={"approved/donor/approvals"}
            rejectedUrl={"rejected/donor/approvals"}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
