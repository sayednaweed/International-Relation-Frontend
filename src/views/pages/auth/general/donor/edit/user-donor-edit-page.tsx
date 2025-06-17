import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import axiosClient from "@/lib/axois-client";
import { useEffect, useMemo, useState } from "react";
import { EditDonorInformation } from "@/lib/types";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Database, KeyRound, NotebookPen } from "lucide-react";
import Shimmer from "@/components/custom-ui/shimmer/Shimmer";
import { PermissionEnum } from "@/lib/constants";
import EditInformationTab from "./steps/edit-information-tab";
import { UserPermission } from "@/database/tables";
import { useGeneralAuthState } from "@/context/AuthContextProvider";
import {
  Breadcrumb,
  BreadcrumbHome,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/custom-ui/Breadcrumb/Breadcrumb";
import { EditDonorPassword } from "./steps/edit-donor-password";
import UserDonorEditHeader from "./user-donor-edit-header";
import EditStatusTab from "./steps/edit-status-tab";

export interface IDonorInformation {
  donorInformation: EditDonorInformation;
}
export default function UserDonorEditPage() {
  const { user } = useGeneralAuthState();
  const navigate = useNavigate();
  const handleGoBack = () => navigate(-1);
  const handleGoHome = () => navigate("/dashboard", { replace: true });
  const { t, i18n } = useTranslation();
  let { id } = useParams();
  const direction = i18n.dir();
  const [failed, setFailed] = useState(false);
  const [userData, setUserData] = useState<IDonorInformation | undefined>(
    undefined
  );

  const loadInformation = async () => {
    try {
      const response = await axiosClient.get(`/donors/${id}`);
      if (response.status == 200) {
        const donor = response.data.donor as EditDonorInformation;
        // Do not allow until register form is submitted

        setUserData({
          donorInformation: donor,
        });
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: error.response.data.message,
      });
      console.log(error);
      setFailed(true);
    }
  };
  useEffect(() => {
    loadInformation();
  }, []);

  const selectedTabStyle = `rtl:text-xl-rtl ltr:text-lg-ltr relative w-[95%] bg-card-foreground/5 justify-start mx-auto ltr:py-2 rtl:py-[5px] data-[state=active]:bg-tertiary font-semibold data-[state=active]:text-primary-foreground gap-x-3`;

  const per: UserPermission = user?.permissions.get(
    PermissionEnum.donor.name
  ) as UserPermission;
  const tableList = useMemo(
    () =>
      Array.from(per.sub).map(([key, _subPermission], index: number) => {
        return key == PermissionEnum.donor.sub.donor_information ? (
          <TabsTrigger
            className={`${selectedTabStyle}`}
            key={index}
            value={key.toString()}
          >
            <Database className="size-[18px]" />
            {t("donor_information")}
          </TabsTrigger>
        ) : key == PermissionEnum.donor.sub.donor_status ? (
          <TabsTrigger
            className={`${selectedTabStyle}`}
            key={index}
            value={key.toString()}
          >
            <Activity className="size-[18px]" />
            {t("status")}
          </TabsTrigger>
        ) : key == PermissionEnum.donor.sub.project ? (
          <TabsTrigger
            className={`${selectedTabStyle}`}
            key={index}
            value={key.toString()}
          >
            <NotebookPen className="size-[18px]" />
            {t("projects")}
          </TabsTrigger>
        ) : key == PermissionEnum.donor.sub.donor_update_account_password ? (
          <TabsTrigger
            className={`${selectedTabStyle}`}
            key={index}
            value={key.toString()}
          >
            <KeyRound className="size-[18px]" />
            {t("update_account_password")}
          </TabsTrigger>
        ) : undefined;
      }),
    []
  );

  return (
    <div className="flex flex-col gap-y-2 px-3 mt-2 pb-12">
      <Breadcrumb>
        <BreadcrumbHome onClick={handleGoHome} />
        <BreadcrumbSeparator />
        <BreadcrumbItem onClick={handleGoBack}>{t("donor")}</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>{userData?.donorInformation?.username}</BreadcrumbItem>
      </Breadcrumb>
      {/* Cards */}
      <Tabs
        dir={direction}
        defaultValue={PermissionEnum.donor.sub.donor_information.toString()}
        className="flex flex-col md:flex-row gap-x-3 gap-y-2 md:gap-y-0"
      >
        {!userData ? (
          <>
            <Shimmer className="min-h-fit sm:min-h-[80vh] w-full md:w-[300px]" />
            <Shimmer className="h-full w-full" />
          </>
        ) : (
          <>
            <TabsList className="sm:min-h-[550px] h-fit pb-8 min-w-[300px] md:w-[300px] gap-y-4 items-start justify-start flex flex-col bg-card border">
              <UserDonorEditHeader
                id={id}
                failed={failed}
                userData={userData}
                setUserData={setUserData}
                hasEdit={true}
                hasRemove={true}
              />
              {tableList}
            </TabsList>

            <TabsContent
              className="flex-1 m-0"
              value={PermissionEnum.donor.sub.donor_information.toString()}
            >
              <EditInformationTab
                permissions={per}
                donorInformation={userData.donorInformation}
              />
            </TabsContent>
            <TabsContent
              className="flex-1 m-0"
              value={PermissionEnum.donor.sub.donor_update_account_password.toString()}
            >
              <EditDonorPassword id={id} permissions={per} failed={failed} />
            </TabsContent>
            <TabsContent
              className="flex-1 m-0"
              value={PermissionEnum.donor.sub.donor_status.toString()}
            >
              <EditStatusTab permissions={per} />
            </TabsContent>
            <TabsContent
              className="flex-1 m-0"
              value={PermissionEnum.donor.sub.project.toString()}
            >
              {/* <EditAgreementStatusTab /> */}
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
