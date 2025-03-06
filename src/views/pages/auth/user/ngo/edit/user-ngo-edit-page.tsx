import { Link, useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import AnimHomeIcon from "@/components/custom-ui/icons/AnimHomeIcon";
import axiosClient from "@/lib/axois-client";
import { useEffect, useMemo, useState } from "react";
import { NgoInformation } from "@/lib/types";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  CloudDownload,
  Database,
  Grip,
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
import AddNgo from "../add/add-ngo";
import { UserPermission } from "@/database/tables";
import { useUserAuthState } from "@/context/AuthContextProvider";
import EditRepresentativeTab from "./steps/edit-representative-tab";
import IconButton from "@/components/custom-ui/button/IconButton";
import UploadRegisterForm from "./parts/upload-register-form";

export interface INgoInformation {
  ngoInformation: NgoInformation;
  registerFormSubmitted: boolean;
}
export default function UserNgoEditPage() {
  const { user } = useUserAuthState();
  const navigate = useNavigate();
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
          ngo.status_id == StatusEnum.register_form_submitted;
        if (
          ngo.status_id == StatusEnum.not_logged_in ||
          ngo.status_id == StatusEnum.unregistered
        ) {
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

  const selectedTabStyle = `relative w-[95%] bg-card-foreground/5 justify-start mx-auto ltr:py-2 rtl:py-[5px] data-[state=active]:bg-tertiary font-semibold data-[state=active]:text-primary-foreground gap-x-3`;

  const per: UserPermission = user?.permissions.get(
    PermissionEnum.ngo.name
  ) as UserPermission;
  const tableList = useMemo(
    () =>
      Array.from(per.sub).map(([key, _subPermission], index: number) => {
        return key == PermissionEnum.ngo.sub.ngo_information ? (
          <TabsTrigger
            className={`rtl:text-xl-rtl ltr:text-lg-ltr ${selectedTabStyle}`}
            key={index}
            value={key.toString()}
          >
            <Database className="size-[18px]" />
            {t("ngo_information")}
          </TabsTrigger>
        ) : key == PermissionEnum.ngo.sub.ngo_director_information ? (
          <TabsTrigger
            className={`rtl:text-xl-rtl ltr:text-lg-ltr ${selectedTabStyle}`}
            key={index}
            value={key.toString()}
          >
            <UserRound className="size-[18px]" />
            {t("director_information")}
          </TabsTrigger>
        ) : key == PermissionEnum.ngo.sub.ngo_agreement ? (
          <TabsTrigger
            className={`rtl:text-xl-rtl ltr:text-lg-ltr ${selectedTabStyle}`}
            key={index}
            value={key.toString()}
          >
            <NotebookPen className="size-[18px]" />
            {t("agreement_checklist")}
          </TabsTrigger>
        ) : key == PermissionEnum.ngo.sub.ngo_more_information ? (
          <TabsTrigger
            className={`rtl:text-xl-rtl ltr:text-lg-ltr ${selectedTabStyle}`}
            key={index}
            value={key.toString()}
          >
            <Grip className="size-[18px]" />
            {t("more_information")}
          </TabsTrigger>
        ) : key == PermissionEnum.ngo.sub.ngo_status ? (
          <TabsTrigger
            className={`rtl:text-xl-rtl ltr:text-lg-ltr ${selectedTabStyle}`}
            key={index}
            value={key.toString()}
          >
            <Activity className="size-[18px]" />
            {t("status")}
          </TabsTrigger>
        ) : (
          key == PermissionEnum.ngo.sub.ngo_representative && (
            <TabsTrigger
              className={`rtl:text-xl-rtl ltr:text-lg-ltr ${selectedTabStyle}`}
              key={index}
              value={key.toString()}
            >
              <UsersRound className="size-[18px]" />
              {t("representative")}
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
  return (
    <div className="flex flex-col gap-y-2 px-3 mt-2">
      <Breadcrumb className="rtl:text-2xl-rtl ltr:text-xl-ltr bg-card w-fit py-1 px-3 rounded-md border">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/dashboard">
              <AnimHomeIcon className=" text-primary" />
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="rtl:rotate-180" />
          <BreadcrumbItem
            onClick={() => navigate("/ngo", { replace: true })}
            className="cursor-pointer"
          >
            <BreadcrumbPage className="text-primary/75">
              {t("ngo")}
            </BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="rtl:rotate-180" />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-tertiary">
              {userData?.ngoInformation?.username}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
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
            <TabsList className="pb-4 min-h-fit sm:min-h-[80vh] h-fit md:w-[300px] gap-y-4 items-start justify-start flex flex-col bg-card border">
              <UserNgoEditHeader
                id={id}
                failed={failed}
                userData={userData}
                setUserData={setUserData}
                hasEdit={true}
                hasRemove={true}
              />
              {tableList}

              {userData?.ngoInformation?.registration_expired && (
                <NastranModel
                  size="lg"
                  isDismissable={false}
                  button={
                    <IconButton className="hover:bg-primary/5 gap-x-4 grid grid-cols-[1fr_4fr] w-[90%] xxl:w-[50%] md:w-[90%] mx-auto transition-all text-primary rtl:px-3 rtl:py-1 ltr:p-2">
                      <Zap
                        className={`size-[18px] pointer-events-none justify-self-end`}
                      />
                      <h1
                        className={`rtl:text-lg-rtl ltr:text-xl-ltr justify-self-start text-start font-semibold`}
                      >
                        {t("extend_reg")}
                      </h1>
                    </IconButton>
                  }
                  showDialog={async () => true}
                >
                  <AddNgo onComplete={() => {}} />
                </NastranModel>
              )}
              {userData?.registerFormSubmitted && (
                <>
                  <UploadRegisterForm />
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
              <EditInformationTab permissions={per} />
            </TabsContent>
            <TabsContent
              className="flex-1 m-0"
              value={PermissionEnum.ngo.sub.ngo_director_information.toString()}
            >
              <EditDirectorTab permissions={per} />
            </TabsContent>
            <TabsContent
              className="flex-1 m-0"
              value={PermissionEnum.ngo.sub.ngo_agreement.toString()}
            >
              <EditAgreemenTab permissions={per} />
            </TabsContent>
            <TabsContent
              className="flex-1 m-0"
              value={PermissionEnum.ngo.sub.ngo_more_information.toString()}
            >
              <EditMoreInformationTab permissions={per} />
            </TabsContent>
            <TabsContent
              className="flex-1 m-0"
              value={PermissionEnum.ngo.sub.ngo_status.toString()}
            >
              <EditStatusTab permissions={per} />
            </TabsContent>
            <TabsContent
              className="flex-1 m-0"
              value={PermissionEnum.ngo.sub.ngo_representative.toString()}
            >
              <EditRepresentativeTab permissions={per} />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
