import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import axiosClient from "@/lib/axois-client";
import { useEffect, useMemo, useState } from "react";
import { NgoInformation } from "@/lib/types";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  CloudDownload,
  CloudUpload,
  Database,
  Grip,
  KeyRound,
  NotebookPen,
  UserRound,
  UsersRound,
  Zap,
} from "lucide-react";
import UserNgoEditHeader from "./user-ngo-edit-header";
import EditDirectorTab from "./steps/edit-director-tab";
import Shimmer from "@/components/custom-ui/shimmer/Shimmer";
import { PermissionEnum, StatusEnum } from "@/lib/constants";
import EditAgreemenTab from "./steps/edit-agreement-tab";
import EditMoreInformationTab from "./steps/edit-more-information-tab";
import EditInformationTab from "./steps/edit-information-tab";
import EditStatusTab from "./steps/edit-status-tab";
import NastranModel from "@/components/custom-ui/model/NastranModel";
import { UserPermission } from "@/database/tables";
import { useGeneralAuthState } from "@/context/AuthContextProvider";
import EditRepresentativeTab from "./steps/edit-representative-tab";
import IconButton from "@/components/custom-ui/button/IconButton";
import UploadRegisterFormDailog from "./parts/upload-register-form-Dailog";
import {
  Breadcrumb,
  BreadcrumbHome,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/custom-ui/Breadcrumb/Breadcrumb";
import { EditNgoPassword } from "./steps/edit-ngo-password";

export interface INgoInformation {
  ngoInformation: NgoInformation;
  registerFormSubmitted: boolean;
}
export default function UserNgoEditPage() {
  const { user } = useGeneralAuthState();
  const navigate = useNavigate();
  const handleGoBack = () => navigate(-1);
  const handleGoHome = () => navigate("/dashboard", { replace: true });
  const { t, i18n } = useTranslation();
  let { id } = useParams();
  const direction = i18n.dir();
  const [failed, setFailed] = useState(false);
  const [userData, setUserData] = useState<INgoInformation | undefined>(
    undefined
  );
  const loadInformation = async () => {
    try {
      const response = await axiosClient.get(`ngo/header-info/${id}`);
      if (response.status == 200) {
        const ngo = response.data.ngo as NgoInformation;
        // Do not allow until register form is submitted
        const registerFormSubmitted =
          ngo.status_id == StatusEnum.document_upload_required;
        if (ngo.status_id == StatusEnum.registration_incomplete) {
          navigate(`/ngo/profile/edit/${id}`, {
            state: {
              data: { edit: true },
            },
          });
          return;
        } else {
          setUserData({
            ngoInformation: ngo,
            registerFormSubmitted: registerFormSubmitted,
          });
        }
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
    PermissionEnum.ngo.name
  ) as UserPermission;
  const tableList = useMemo(
    () =>
      Array.from(per.sub).map(([key, _subPermission], index: number) => {
        return key == PermissionEnum.ngo.sub.ngo_information ? (
          <TabsTrigger
            className={`${selectedTabStyle}`}
            key={index}
            value={key.toString()}
          >
            <Database className="size-[18px]" />
            {t("ngo_information")}
          </TabsTrigger>
        ) : key == PermissionEnum.ngo.sub.ngo_director_information ? (
          <TabsTrigger
            className={`${selectedTabStyle}`}
            key={index}
            value={key.toString()}
          >
            <UserRound className="size-[18px]" />
            {t("director_information")}
          </TabsTrigger>
        ) : key == PermissionEnum.ngo.sub.ngo_agreement ? (
          <TabsTrigger
            className={`${selectedTabStyle}`}
            key={index}
            value={key.toString()}
          >
            <NotebookPen className="size-[18px]" />
            {t("agreement_checklist")}
          </TabsTrigger>
        ) : key == PermissionEnum.ngo.sub.ngo_more_information ? (
          <TabsTrigger
            className={`${selectedTabStyle}`}
            key={index}
            value={key.toString()}
          >
            <Grip className="size-[18px]" />
            {t("more_information")}
          </TabsTrigger>
        ) : key == PermissionEnum.ngo.sub.ngo_status ? (
          <TabsTrigger
            className={`${selectedTabStyle}`}
            key={index}
            value={key.toString()}
          >
            <Activity className="size-[18px]" />
            {t("status")}
          </TabsTrigger>
        ) : key == PermissionEnum.ngo.sub.ngo_representative ? (
          <TabsTrigger
            className={`${selectedTabStyle}`}
            key={index}
            value={key.toString()}
          >
            <UsersRound className="size-[18px]" />
            {t("representative")}
          </TabsTrigger>
        ) : (
          key == PermissionEnum.ngo.sub.ngo_update_account_password && (
            <TabsTrigger
              className={`${selectedTabStyle}`}
              key={index}
              value={key.toString()}
            >
              <KeyRound className="size-[18px]" />
              {t("update_account_password")}
            </TabsTrigger>
          )
        );
      }),
    []
  );
  const download = async () => {
    // 1. Create token
    try {
      const response = await axiosClient.get(
        `ngo/generate/registeration/${id}`,
        {
          responseType: "blob", // Important to handle the binary data (PDF)
          onDownloadProgress: (_progressEvent) => {
            // Calculate download progress percentage
          },
        }
      );
      if (response.status == 200) {
        // Create a URL for the file blob
        const file = new Blob([response.data], {
          type: ".zip",
        });
        // const file = new Blob([response.data], { type: "application/pdf" });
        const fileURL = window.URL.createObjectURL(file);

        const link = document.createElement("a");
        link.href = fileURL;
        link.download = "register-form.zip";
        link.click();

        // Clean up the URL object after download
        window.URL.revokeObjectURL(fileURL);
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        description: error.response.data.message,
      });
      console.log(error);
    }
  };

  const registerationExpired: boolean =
    userData?.ngoInformation.status_id == StatusEnum.expired;
  return (
    <div className="flex flex-col gap-y-2 px-3 mt-2 pb-12">
      <Breadcrumb>
        <BreadcrumbHome onClick={handleGoHome} />
        <BreadcrumbSeparator />
        <BreadcrumbItem onClick={handleGoBack}>{t("ngos")}</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>{userData?.ngoInformation?.username}</BreadcrumbItem>
      </Breadcrumb>
      {/* Cards */}
      <Tabs
        dir={direction}
        defaultValue={PermissionEnum.ngo.sub.ngo_information.toString()}
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
              <UserNgoEditHeader
                id={id}
                failed={failed}
                userData={userData}
                setUserData={setUserData}
                hasEdit={true}
                hasRemove={true}
              />
              {tableList}

              {registerationExpired && (
                <IconButton
                  onClick={() => navigate(`/ngo/register/extend/${id}`)}
                  className="hover:bg-primary/5 gap-x-4 grid grid-cols-[1fr_4fr] w-[90%] xxl:w-[50%] md:w-[90%] mx-auto transition-all text-primary rtl:px-3 rtl:py-1 ltr:p-2"
                >
                  <Zap
                    className={`size-[18px] pointer-events-none justify-self-end`}
                  />
                  <h1
                    className={`rtl:text-lg-rtl ltr:text-xl-ltr justify-self-start text-start font-semibold`}
                  >
                    {t("extend_reg")}
                  </h1>
                </IconButton>
              )}
              {userData.ngoInformation.status_id ==
                StatusEnum.document_upload_required && (
                <>
                  <NastranModel
                    size="lg"
                    isDismissable={false}
                    button={
                      <IconButton className="hover:bg-primary/5 gap-x-4 grid grid-cols-[1fr_4fr] w-[90%] xxl:w-[50%] md:w-[90%] mx-auto transition-all text-primary rtl:px-3 rtl:py-1 ltr:p-2">
                        <CloudUpload
                          className={`size-[18px] pointer-events-none justify-self-end`}
                        />
                        <h1
                          className={`rtl:text-lg-rtl ltr:text-xl-ltr justify-self-start text-start font-semibold`}
                        >
                          {t("up_register_fo")}
                        </h1>
                      </IconButton>
                    }
                    showDialog={async () => true}
                  >
                    <UploadRegisterFormDailog
                      onComplete={() => {
                        const ngoInformation = userData.ngoInformation;
                        ngoInformation.status_id = StatusEnum.pending_approval;
                        setUserData({
                          ...userData,
                          ngoInformation: ngoInformation,
                        });
                      }}
                    />
                  </NastranModel>
                  <IconButton
                    onClick={download}
                    className="hover:bg-primary/5 gap-x-4 mx-auto grid grid-cols-[1fr_4fr] w-[90%] xxl:w-[50%] md:w-[90%] transition-all text-primary rtl:px-3 rtl:py-1 ltr:p-2"
                  >
                    <CloudDownload
                      className={`size-[18px] pointer-events-none justify-self-end`}
                    />
                    <h1
                      className={`rtl:text-lg-rtl ltr:text-xl-ltr font-semibold justify-self-start`}
                    >
                      {t("download_r_form")}
                    </h1>
                  </IconButton>
                </>
              )}
            </TabsList>
            <TabsContent
              className="flex-1 m-0"
              value={PermissionEnum.ngo.sub.ngo_information.toString()}
            >
              <EditInformationTab
                permissions={per}
                registerationExpired={registerationExpired}
              />
            </TabsContent>
            <TabsContent
              className="flex-1 m-0"
              value={PermissionEnum.ngo.sub.ngo_director_information.toString()}
            >
              <EditDirectorTab
                permissions={per}
                registerationExpired={registerationExpired}
              />
            </TabsContent>
            <TabsContent
              className="flex-1 m-0"
              value={PermissionEnum.ngo.sub.ngo_agreement.toString()}
            >
              <EditAgreemenTab />
            </TabsContent>
            <TabsContent
              className="flex-1 m-0"
              value={PermissionEnum.ngo.sub.ngo_more_information.toString()}
            >
              <EditMoreInformationTab
                permissions={per}
                registerationExpired={registerationExpired}
              />
            </TabsContent>
            <TabsContent
              className="flex-1 m-0"
              value={PermissionEnum.ngo.sub.ngo_status.toString()}
            >
              <EditStatusTab
                permissions={per}
                registerationExpired={registerationExpired}
              />
            </TabsContent>
            <TabsContent
              className="flex-1 m-0"
              value={PermissionEnum.ngo.sub.ngo_representative.toString()}
            >
              <EditRepresentativeTab
                permissions={per}
                registerationExpired={registerationExpired}
              />
            </TabsContent>
            <TabsContent
              className="flex-1 m-0"
              value={PermissionEnum.ngo.sub.ngo_update_account_password.toString()}
            >
              <EditNgoPassword id={id} permissions={per} failed={failed} />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
