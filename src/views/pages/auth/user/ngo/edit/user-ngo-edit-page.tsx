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
import { useEffect, useState } from "react";
import { UserInformation } from "@/lib/types";
import { toast } from "@/components/ui/use-toast";
import { userWithPermissions } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Database, Grip, NotebookPen, UserRound } from "lucide-react";
import EditNgoInformation from "./steps/edit-ngo-information";
import UserNgoEditHeader from "./user-ngo-edit-header";
import EditNgoAgreement from "./steps/edit-ngo-agreement";
import EditDirectorTab from "./steps/edit-director-tab";

export default function UserNgoEditPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  let { id } = useParams();
  const direction = i18n.dir();
  const [failed, setFailed] = useState(false);
  const [userData, setUserData] = useState<UserInformation | undefined>();
  const loadInformation = async () => {
    try {
      setFailed(false);
      const response = await axiosClient.get(`ngo/header/info/${id}`);
      if (response.status == 200) {
        setUserData(userWithPermissions(response));
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

  const selectedTabStyle = `relative
w-[95%] ltr:py-2 rtl:py-[5px] bg-card-foreground/5 data-[state=active]:bg-tertiary font-semibold data-[state=active]:text-primary-foreground gap-x-3 justify-start`;

  return (
    <div className="flex flex-col gap-y-6 px-3 mt-2">
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
              {userData?.username}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {/* Cards */}
      <Tabs
        dir={direction}
        defaultValue="ngo_information"
        className="flex flex-col sm:flex-row gap-x-3 mt-2 gap-y-2 sm:gap-y-0"
      >
        <TabsList className="min-h-fit sm:min-h-[80vh] overflow-y-auto pb-8 sm:w-[300px] gap-y-4 items-start justify-start flex flex-col bg-card border">
          <UserNgoEditHeader
            id={id}
            failed={failed}
            userData={userData}
            setUserData={setUserData}
          />
          <TabsTrigger
            className={`mt-6 rtl:text-xl-rtl ltr:text-lg-ltr ${selectedTabStyle}`}
            value="ngo_information"
          >
            <Database className="size-[18px]" />
            {t("ngo_information")}
          </TabsTrigger>
          <TabsTrigger
            className={`rtl:text-xl-rtl ltr:text-lg-ltr ${selectedTabStyle}`}
            value="director_information"
          >
            <UserRound className="size-[18px]" />
            {t("director_information")}
          </TabsTrigger>
          <TabsTrigger
            className={`rtl:text-xl-rtl ltr:text-lg-ltr ${selectedTabStyle}`}
            value="agreement_checklist"
          >
            <NotebookPen className="size-[18px]" />
            {t("agreement_checklist")}
          </TabsTrigger>
          <TabsTrigger
            className={`rtl:text-xl-rtl ltr:text-lg-ltr ${selectedTabStyle}`}
            value="more_information"
          >
            <Grip className="size-[18px]" />
            {t("more_information")}
          </TabsTrigger>
          <TabsTrigger
            className={`rtl:text-xl-rtl ltr:text-lg-ltr ${selectedTabStyle}`}
            value="status"
          >
            <Activity className="size-[18px]" />
            {t("status")}
          </TabsTrigger>
        </TabsList>
        <TabsContent className="flex-1 m-0" value="ngo_information">
          <EditNgoInformation />
        </TabsContent>
        <TabsContent className="flex-1 m-0" value="director_information">
          <EditDirectorTab />
        </TabsContent>
        <TabsContent className="flex-1 m-0" value="agreement_checklist">
          <EditNgoAgreement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
