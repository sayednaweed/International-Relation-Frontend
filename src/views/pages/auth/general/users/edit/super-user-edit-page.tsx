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
import EditUserInformation from "./steps/edit-user-information";
import { EditUserPassword } from "./steps/edit-user-password";
import axiosClient from "@/lib/axois-client";
import { useEffect, useState } from "react";
import { UserInformation } from "@/lib/types";
import { toast } from "@/components/ui/use-toast";
import { returnPermissions } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, KeyRound, ShieldBan } from "lucide-react";
import UserEditHeader from "./user-edit-header";
import EditUserPermissions from "./steps/edit-user-permissions";
import { SelectUserPermission, UserPermission } from "@/database/tables";
import { useUserAuthState } from "@/context/AuthContextProvider";
import { PermissionEnum } from "@/lib/constants";

export default function SuperUserEditPage() {
  const { user } = useUserAuthState();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  let { id } = useParams();
  const direction = i18n.dir();
  const [failed, setFailed] = useState(false);
  const [userData, setUserData] = useState<UserInformation | undefined>();
  const loadInformation = async () => {
    try {
      setFailed(false);
      const response = await axiosClient.get(`user/${id}`);
      if (response.status == 200) {
        const user = response.data.user as UserInformation;
        user.permission = returnPermissions(response.data.permission) as Map<
          string,
          SelectUserPermission
        >;
        setUserData(user);
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
    PermissionEnum.users.name
  ) as UserPermission;

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
            onClick={() => navigate("/users", { replace: true })}
            className="cursor-pointer"
          >
            <BreadcrumbPage className="text-primary/75">
              {t("users")}
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
        defaultValue={PermissionEnum.users.sub.user_information.toString()}
        className="flex flex-col sm:flex-row gap-x-3 mt-2 gap-y-2 sm:gap-y-0"
      >
        <TabsList className="min-h-fit sm:min-h-[80vh] overflow-y-auto pb-8 sm:w-[300px] gap-y-4 items-start justify-start flex flex-col bg-card border">
          <UserEditHeader
            id={id}
            failed={failed}
            userData={userData}
            setUserData={setUserData}
          />
          <TabsTrigger
            className={`mt-6 rtl:text-2xl-rtl ltr:text-2xl-ltr ${selectedTabStyle}`}
            value={PermissionEnum.users.sub.user_information.toString()}
          >
            <Database className="size-[18px]" />
            {t("account_information")}
          </TabsTrigger>
          <TabsTrigger
            className={`rtl:text-2xl-rtl ltr:text-2xl-ltr${selectedTabStyle}`}
            value={PermissionEnum.users.sub.user_password.toString()}
          >
            <KeyRound className="size-[18px]" />
            {t("update_account_password")}
          </TabsTrigger>
          <TabsTrigger
            className={`rtl:text-2xl-rtl ltr:text-2xl-ltr${selectedTabStyle}`}
            value={PermissionEnum.users.sub.user_permission.toString()}
          >
            <ShieldBan className="size-[18px]" />
            {t("update_account_permissions")}
          </TabsTrigger>
        </TabsList>

        {Array.from(per.sub).map(([key, subPermission]) => {
          const hasEdit = subPermission.edit == true;
          return key == PermissionEnum.users.sub.user_information ? (
            <TabsContent className="flex-1 m-0" value={key.toString()}>
              <EditUserInformation
                id={id}
                failed={failed}
                userData={userData}
                setUserData={setUserData}
                refreshPage={loadInformation}
                hasEdit={hasEdit}
              />
            </TabsContent>
          ) : key == PermissionEnum.users.sub.user_password ? (
            <TabsContent className="flex-1 m-0" value={key.toString()}>
              <EditUserPassword
                id={id}
                userData={userData}
                failed={failed}
                refreshPage={loadInformation}
                hasEdit={hasEdit}
              />
            </TabsContent>
          ) : (
            <TabsContent className="flex-1 m-0" value={key.toString()}>
              <EditUserPermissions
                id={id}
                userData={userData}
                setUserData={setUserData}
                failed={failed}
                refreshPage={loadInformation}
                hasEdit={hasEdit}
              />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
