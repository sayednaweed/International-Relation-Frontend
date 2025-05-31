import CustomInput from "@/components/custom-ui/input/CustomInput";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { UserPassword } from "@/lib/types";
import axiosClient from "@/lib/axois-client";
import { useGeneralAuthState } from "@/context/AuthContextProvider";
import { PermissionEnum, RoleEnum } from "@/lib/constants";
import { setServerError, validate } from "@/validation/validation";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import ButtonSpinner from "@/components/custom-ui/spinner/ButtonSpinner";
import { UserPermission } from "@/database/tables";
import { ValidateItem } from "@/validation/types";
import { useNavigate } from "react-router";
export interface EditNgoPasswordProps {
  failed: boolean;
  permissions: UserPermission;
  id?: string;
}

export function EditDonorPassword(props: EditNgoPasswordProps) {
  const { user, logoutNgo } = useGeneralAuthState();
  const { failed, permissions, id } = props;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [passwordData, setPasswordData] = useState<UserPassword>({
    new_password: "",
    confirm_password: "",
    old_password: "",
  });
  const [error, setError] = useState<Map<string, string>>(new Map());

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };
  const saveData = async () => {
    setLoading(true);
    // 1. Validate form
    const rules: ValidateItem[] = [
      {
        name: "new_password",
        rules: ["required", "min:8", "max:45"],
      },
      {
        name: "confirm_password",
        rules: ["required", "min:8", "max:45"],
      },
    ];
    if (user.role.role != RoleEnum.super) {
      rules.push({
        name: "old_password",
        rules: ["required", "min:8", "max:45"],
      });
    }
    const passed = await validate(rules, passwordData, setError);
    if (!passed) {
      setLoading(false);
      return;
    }

    try {
      const response = await axiosClient.post("donor/change/password", {
        donor_id: id,
        new_password: passwordData.new_password,
        confirm_password: passwordData.confirm_password,
      });
      if (response.status == 200) {
        toast({
          toastType: "SUCCESS",
          title: t("success"),
          description: t(response.data.message),
        });
        // If user changed his password he must login again
        if (user.role.role == RoleEnum.ngo) {
          await logoutNgo();
          navigate("ngo/login", { replace: true });
        }
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: error.response.data.message,
      });
      setServerError(error.response.data.errors, setError);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const update_password = permissions.sub.get(
    PermissionEnum.ngo.sub.ngo_update_account_password
  );
  const hasEdit = update_password?.edit;
  return (
    <Card>
      <CardHeader className="space-y-0">
        <CardTitle className="rtl:text-3xl-rtl ltr:text-2xl-ltr">
          {t("update_account_password")}
        </CardTitle>
        <CardDescription className="rtl:text-xl-rtl ltr:text-lg-ltr">
          {t("update_pass_descrip")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {failed ? (
          <h1>{t("u_are_not_authzed!")}</h1>
        ) : loading ? (
          <NastranSpinner />
        ) : (
          <div className="grid gap-4 w-full sm:w-[70%] md:w-1/2">
            {user.role.role != RoleEnum.super && (
              <CustomInput
                size_="sm"
                name="old_password"
                lable={t("old_password")}
                required={true}
                requiredHint={`* ${t("required")}`}
                defaultValue={passwordData["old_password"]}
                onChange={handleChange}
                placeholder={t("enter_password")}
                errorMessage={error.get("old_password")}
                startContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={() => setIsVisible(!isVisible)}
                  >
                    {isVisible ? (
                      <Eye className="size-[20px] text-primary-icon pointer-events-none" />
                    ) : (
                      <EyeOff className="size-[20px] text-primary-icon pointer-events-none" />
                    )}
                  </button>
                }
                type={isVisible ? "text" : "password"}
              />
            )}
            <CustomInput
              size_="sm"
              name="new_password"
              lable={t("new_password")}
              required={true}
              requiredHint={`* ${t("required")}`}
              defaultValue={passwordData["new_password"]}
              onChange={handleChange}
              placeholder={t("enter_password")}
              errorMessage={error.get("new_password")}
              type={"password"}
            />
            <CustomInput
              size_="sm"
              name="confirm_password"
              lable={t("confirm_password")}
              required={true}
              requiredHint={`* ${t("required")}`}
              defaultValue={passwordData["confirm_password"]}
              onChange={handleChange}
              placeholder={t("enter_password")}
              errorMessage={error.get("confirm_password")}
              type={"password"}
            />
          </div>
        )}
      </CardContent>
      <CardFooter>
        {!failed && hasEdit && (
          <PrimaryButton
            disabled={loading}
            onClick={async () => {
              await saveData();
            }}
            className={`shadow-lg`}
          >
            <ButtonSpinner loading={loading}>{t("save")}</ButtonSpinner>
          </PrimaryButton>
        )}
      </CardFooter>
    </Card>
  );
}
