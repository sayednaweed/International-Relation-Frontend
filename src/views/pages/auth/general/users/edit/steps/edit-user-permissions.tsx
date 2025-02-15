import { UserInformation } from "@/lib/types";
import { useTranslation } from "react-i18next";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserAuthState } from "@/context/AuthContextProvider";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import { ChevronsUpDown, RefreshCcw } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  AuthSubPermission,
  SelectUserPermission,
  SubPermission,
} from "@/database/tables";
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";
import ButtonSpinner from "@/components/custom-ui/spinner/ButtonSpinner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
export interface EditUserPermissionsProps {
  id: string | undefined;
  refreshPage: () => Promise<void>;
  userData: UserInformation | undefined;
  setUserData: Dispatch<SetStateAction<UserInformation | undefined>>;
  failed: boolean;
  hasEdit: boolean;
}

export default function EditUserPermissions(props: EditUserPermissionsProps) {
  const { t } = useTranslation();
  const { user } = useUserAuthState();
  const { id, userData, failed, refreshPage, setUserData, hasEdit } = props;
  const [loading, setLoading] = useState(false);
  const handleChange = (key: string, permission: SelectUserPermission) => {
    if (userData != undefined)
      setUserData({
        ...userData,
        permission: userData.permission.set(key, permission),
      });
  };
  const selectAllRows = (value: boolean) => {
    if (userData?.permission != undefined) {
      const permissionMap = new Map<string, SelectUserPermission>();

      for (const [_key, item] of userData.permission) {
        const sub: Map<number, AuthSubPermission> = new Map();
        for (const [key, subItem] of item.sub) {
          sub.set(key, {
            id: subItem.id,
            edit: value,
            delete: value,
            add: value,
            view: value,
          });
        }
        const permission: SelectUserPermission = {
          id: item.id,
          view: value,
          icon: item.icon,
          permission: item.permission,
          allSelected: value,
          visible: item.visible,
          priority: item.priority,
          sub: sub,
        };
        permissionMap.set(item.permission, permission);
      }
      setUserData({
        ...userData,
        permission: permissionMap,
        allSelected: value,
      });
    }
  };
  // Function to convert map to JSON object
  const mapToJsonObject = (map: Map<string, SelectUserPermission>): object => {
    return Object.fromEntries(map);
  };

  const saveData = async () => {
    if (id != undefined && !loading) {
      setLoading(true);
      const formData = new FormData();
      formData.append("user_id", id);
      // Convert map to JSON object
      if (userData?.permission != undefined) {
        const jsonObject = mapToJsonObject(userData?.permission);
        formData.append("permission", JSON.stringify(jsonObject));
      }
      try {
        const response = await axiosClient.post(
          "user/update/permission",
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status == 200) {
          toast({
            toastType: "SUCCESS",
            title: t("success"),
            description: t(response.data.message),
          });
        }
      } catch (error: any) {
        toast({
          toastType: "ERROR",
          title: t("error"),
          description: t(error.response.data.message),
        });
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  console.log(userData?.permission);
  return (
    <Card>
      <CardHeader className="space-y-0">
        <CardTitle className="rtl:text-3xl-rtl ltr:text-2xl-ltr">
          {t("update_account_permissions")}
        </CardTitle>
        <CardDescription className="rtl:text-xl-rtl ltr:text-lg-ltr">
          {t("update_permis_descrip")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {failed ? (
          <h1>{t("u_are_not_authzed!")}</h1>
        ) : userData?.permission == undefined ? (
          <NastranSpinner />
        ) : (
          <div className="relative overflow-x-auto border">
            {Array.from(userData.permission).map(([key, item]) => {
              return (
                <PermissionSub permission={item} user_id={user.id} key={key} />
              );
            })}
          </div>
        )}
      </CardContent>
      <CardFooter>
        {failed ? (
          <PrimaryButton
            onClick={async () => await refreshPage()}
            className="bg-red-500 hover:bg-red-500/70"
          >
            {t("failed_retry")}
            <RefreshCcw className="ltr:ml-2 rtl:mr-2" />
          </PrimaryButton>
        ) : (
          userData &&
          hasEdit && (
            <PrimaryButton
              onClick={async () => {
                if (user.grant) {
                  await saveData();
                }
              }}
              className={`shadow-lg mt-8`}
            >
              <ButtonSpinner loading={loading}>{t("save")}</ButtonSpinner>
            </PrimaryButton>
          )
        )}
      </CardFooter>
    </Card>
  );
}

interface PermissionSubProps {
  permission: SelectUserPermission;
  user_id: string;
}
const PermissionSub = (props: PermissionSubProps) => {
  const { permission, user_id } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [subPermissions, setSubPermissions] = useState<SubPermission[]>([]);

  const loadSubPermissions = async () => {
    try {
      if (loading) return;
      setLoading(true);
      const response = await axiosClient.get(`sub-permissions`, {
        params: {
          permission: permission.permission,
          user_id: user_id,
        },
      });
      if (response.status == 200) {
        setSubPermissions(response.data);
        if (failed) {
          setFailed(false);
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

  console.log(loading);

  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" onClick={loadSubPermissions}>
            <h1 className=" rtl:text-xl-rtl">{t(permission.permission)}</h1>
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2">
        {loading ? (
          <NastranSpinner className="size-[20px]" />
        ) : failed ? (
          <h1 className="rtl:text-xl-rtl ltr:text-sm-ltr text-white bg-red-500 text-center">
            {t("error")}
          </h1>
        ) : subPermissions.length == 0 ? (
          <h1 className=" rtl:text-xl-rtl ltr:text-sm-ltr bg-primary/20 text-center">
            {t("no_content")}
          </h1>
        ) : (
          subPermissions.map((subPermission, index: number) => (
            <h1 key={index}>{subPermission.name}</h1>
          ))
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};
