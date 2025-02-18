import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import { ChevronsUpDown, RefreshCcw } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";
import ButtonSpinner from "@/components/custom-ui/spinner/ButtonSpinner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import CustomCheckbox from "@/components/custom-ui/checkbox/CustomCheckbox";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { IUserPermission } from "@/lib/types";
export interface EditUserPermissionsProps {
  hasEdit: boolean;
}

export default function EditUserPermissions(props: EditUserPermissionsProps) {
  const { t } = useTranslation();
  const { hasEdit } = props;
  let { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [userData, setUserData] = useState<IUserPermission[]>([]);
  const [saving, setSaving] = useState(false);

  const loadPermissions = async () => {
    try {
      if (loading) return;
      setLoading(true);
      const response = await axiosClient.get(`user-permissions/${id}`);
      if (response.status == 200) {
        setUserData(response.data);
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: error.response.data.message,
      });
      console.log(error);
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadPermissions();
  }, []);

  const savePermission = async () => {
    try {
      if (saving) return;
      setSaving(true);
      const response = await axiosClient.post(
        `single/user/update-permission`,
        {
          permission: userData,
          user_id: id,
          // subPermissions: subPermissions,
        },
        {
          headers: {
            "Content-Type": "application/json", // Ensure the content type is set to JSON
          },
        }
      );
      if (response.status == 200) {
        toast({
          toastType: "ERROR",
          description: response.data.message,
        });
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
    setSaving(false);
  };

  console.log(hasEdit);
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
        ) : loading ? (
          <NastranSpinner />
        ) : (
          <div>
            {userData.map((item, index) => (
              <PermissionSub
                setUserData={setUserData}
                userData={userData}
                permission={item}
                key={index}
              />
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        {failed ? (
          <PrimaryButton
            onClick={loadPermissions}
            className="bg-red-500 hover:bg-red-500/70"
          >
            {t("failed_retry")}
            <RefreshCcw className="ltr:ml-2 rtl:mr-2" />
          </PrimaryButton>
        ) : (
          hasEdit && (
            <PrimaryButton onClick={savePermission} className={`shadow-md`}>
              <ButtonSpinner loading={saving}>{t("save")}</ButtonSpinner>
            </PrimaryButton>
          )
        )}
      </CardFooter>
    </Card>
  );
}

type UserAction = "add" | "delete" | "edit" | "view";
interface PermissionSubProps {
  permission: IUserPermission;
  userData: IUserPermission[];
  setUserData: Dispatch<SetStateAction<IUserPermission[]>>;
}
const PermissionSub = (props: PermissionSubProps) => {
  const { permission, setUserData, userData } = props;
  const { t } = useTranslation();

  const mainActions: {
    [key in UserAction]: (value: boolean, permission: string) => void;
  } = {
    add: (value: boolean, permission: string) => {
      const updatedUserData = userData.map((perm) =>
        perm.permission === permission ? { ...perm, add: value } : perm
      );
      setUserData(updatedUserData);
    },
    delete: (value: boolean, permission: string) => {
      const updatedUserData = userData.map((perm) =>
        perm.permission === permission ? { ...perm, delete: value } : perm
      );
      setUserData(updatedUserData);
    },
    edit: (value: boolean, permission: string) => {
      const updatedUserData = userData.map((perm) =>
        perm.permission === permission ? { ...perm, edit: value } : perm
      );
      setUserData(updatedUserData);
    },
    view: (value: boolean, permission: string) => {
      const updatedUserData = userData.map((perm) =>
        perm.permission === permission ? { ...perm, view: value } : perm
      );
      setUserData(updatedUserData);
    },
  };
  const subActions: {
    [key in UserAction]: (
      value: boolean,
      permission: string,
      subId: number
    ) => void;
  } = {
    add: (value: boolean, permission: string, subId: number) => {
      const updatedUserData = userData.map((perm) => {
        if (perm.permission === permission) {
          // Update the sub array with the updated SubPermission
          const updatedSub = perm.sub.map((sub) =>
            sub.id === subId ? { ...sub, add: value } : sub
          );
          return { ...perm, sub: updatedSub }; // Return the updated permission object
        }
        return perm; // No change for other permissions
      });
      setUserData(updatedUserData); // Update the state
    },
    delete: (value: boolean, permission: string, subId: number) => {
      const updatedUserData = userData.map((perm) => {
        if (perm.permission === permission) {
          // Update the sub array with the updated SubPermission
          const updatedSub = perm.sub.map((sub) =>
            sub.id === subId ? { ...sub, delete: value } : sub
          );
          return { ...perm, sub: updatedSub }; // Return the updated permission object
        }
        return perm; // No change for other permissions
      });
      setUserData(updatedUserData); // Update the state
    },
    edit: (value: boolean, permission: string, subId: number) => {
      const updatedUserData = userData.map((perm) => {
        if (perm.permission === permission) {
          // Update the sub array with the updated SubPermission
          const updatedSub = perm.sub.map((sub) =>
            sub.id === subId ? { ...sub, edit: value } : sub
          );
          return { ...perm, sub: updatedSub }; // Return the updated permission object
        }
        return perm; // No change for other permissions
      });
      setUserData(updatedUserData); // Update the state
    },
    view: (value: boolean, permission: string, subId: number) => {
      const updatedUserData = userData.map((perm) => {
        if (perm.permission === permission) {
          // Update the sub array with the updated SubPermission
          const updatedSub = perm.sub.map((sub) =>
            sub.id === subId ? { ...sub, view: value } : sub
          );
          return { ...perm, sub: updatedSub }; // Return the updated permission object
        }
        return perm; // No change for other permissions
      });
      setUserData(updatedUserData); // Update the state
    },
  };
  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <PrimaryButton className="w-full mb-2 py-[18px] flex justify-between hover:bg-primary/5 hover:shadow-none hover:text-primary bg-transparent shadow-none border text-primary">
          {t(permission.permission)}
          <ChevronsUpDown className="h-4 w-4" />
          <span className="sr-only">Toggle</span>
        </PrimaryButton>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 px-3 lg:px-4 py-4 md:py-4 bg-primary/5 pb-4 mb-4 border hover:shadow transition-shadow ease-in-out rounded-xl shadow-sm">
        <div className="md:flex md:flex-wrap xl:grid md:space-y-2 xl:space-y-0 space-y-3 xl:grid-cols-6 mt-2 items-center border-b pb-3">
          <h1 className="rtl:text-2xl-rtl w-full xl:w-fit font-bold text-tertiary col-span-2">
            {t(permission.permission)}
          </h1>
          <CustomCheckbox
            text={t("add")}
            className="ml-1"
            checked={permission.add}
            onCheckedChange={(value: boolean) =>
              mainActions["add"](value, permission.permission)
            }
          />
          <CustomCheckbox
            text={t("edit")}
            className="ml-1"
            checked={permission.edit}
            onCheckedChange={(value: boolean) =>
              mainActions["edit"](value, permission.permission)
            }
          />
          <CustomCheckbox
            text={t("delete")}
            className="ml-1"
            checked={permission.delete}
            onCheckedChange={(value: boolean) =>
              mainActions["delete"](value, permission.permission)
            }
          />
          <CustomCheckbox
            text={t("view")}
            className="ml-1"
            checked={permission.view}
            onCheckedChange={(value: boolean) =>
              mainActions["view"](value, permission.permission)
            }
          />
        </div>
        {permission.sub.map((subPermission, index: number) => (
          <div
            key={index}
            className="md:flex md:flex-wrap xl:grid md:space-y-2 xl:space-y-0 space-y-3 xl:grid-cols-6 mt-2 items-center border-b pb-3"
          >
            <h1 className="rtl:text-2xl-rtl w-full xl:w-fit font-bold text-tertiary col-span-2">
              {t(subPermission.name)}
            </h1>
            <CustomCheckbox
              text={t("add")}
              className="ml-1"
              checked={subPermission.add}
              onCheckedChange={(value: boolean) =>
                subActions["add"](
                  value,
                  permission.permission,
                  subPermission.id
                )
              }
            />
            <CustomCheckbox
              text={t("edit")}
              className="ml-1"
              checked={subPermission.edit}
              onCheckedChange={(value: boolean) =>
                subActions["edit"](
                  value,
                  permission.permission,
                  subPermission.id
                )
              }
            />
            <CustomCheckbox
              text={t("delete")}
              className="ml-1"
              checked={subPermission.delete}
              onCheckedChange={(value: boolean) =>
                subActions["delete"](
                  value,
                  permission.permission,
                  subPermission.id
                )
              }
            />
            <CustomCheckbox
              text={t("view")}
              className="ml-1"
              checked={subPermission.view}
              onCheckedChange={(value: boolean) =>
                subActions["view"](
                  value,
                  permission.permission,
                  subPermission.id
                )
              }
            />
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};
