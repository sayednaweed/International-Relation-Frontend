import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import axiosClient from "@/lib/axois-client";
import { setServerError, validate } from "@/validation/validation";
import { UserPermission } from "@/database/tables";
import { useParams } from "react-router";
import SingleTab from "@/components/custom-ui/input/mult-tab/parts/SingleTab";
import BorderContainer from "@/components/custom-ui/container/BorderContainer";
import { ValidateItem } from "@/validation/types";
import MultiTabInput from "@/components/custom-ui/input/mult-tab/MultiTabInput";
import { PermissionEnum } from "@/lib/constants";
import { EditDonorInformation } from "@/lib/types";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import ButtonSpinner from "@/components/custom-ui/spinner/ButtonSpinner";

interface EditInformationTabProps {
  permissions: UserPermission;
  donorInformation: EditDonorInformation;
}
export default function EditInformationTab(props: EditInformationTabProps) {
  const { permissions } = props;
  const { t } = useTranslation();
  let { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Map<string, string>>(new Map());
  const [donorData, setDonorData] = useState<EditDonorInformation>(
    props.donorInformation
  );

  useEffect(() => {
    donorData;
  }, []);

  const saveData = async () => {
    if (loading || id === undefined) {
      setLoading(false);
      return;
    }
    setLoading(true);
    // 1. Validate data changes
    // 2. Validate form
    const compulsoryFields: ValidateItem[] = [
      { name: "name_english", rules: ["required", "max:128", "min:5"] },
      { name: "name_farsi", rules: ["required", "max:128", "min:5"] },
      { name: "name_pashto", rules: ["required", "max:128", "min:5"] },
      { name: "abbr", rules: ["required"] },
      { name: "username", rules: ["required"] },
      { name: "contact", rules: ["required"] },
      { name: "email", rules: ["required"] },
      { name: "province", rules: ["required"] },
      { name: "district", rules: ["required"] },
      { name: "area_english", rules: ["required", "max:128", "min:5"] },
      { name: "area_pashto", rules: ["required", "max:128", "min:5"] },
      { name: "area_farsi", rules: ["required", "max:128", "min:5"] },
    ];
    const passed = await validate(compulsoryFields, donorData, setError);
    if (!passed) {
      setLoading(false);
      return;
    }
    const content = {
      ...donorData,
    };
    // 2. Store
    const formData = new FormData();
    formData.append("id", id);
    formData.append("contents", JSON.stringify(content));
    // formData.append("contents", JSON.stringify(content));
    try {
      const response = await axiosClient.post(`donors/${id}`, formData);
      if (response.status == 200) {
        toast({
          toastType: "SUCCESS",
          title: t("success"),
          description: response.data.message,
        });
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

  const information = permissions.sub.get(
    PermissionEnum.donor.sub.donor_information
  );
  const hasEdit = information?.edit;
  return (
    <Card>
      <CardHeader className="space-y-0">
        <CardTitle className="rtl:text-3xl-rtl ltr:text-2xl-ltr">
          {t("account_information")}
        </CardTitle>
        <CardDescription className="rtl:text-xl-rtl ltr:text-lg-ltr">
          {t("update_user_acc_info")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <NastranSpinner />
        ) : (
          <div className="grid gap-x-4 gap-y-6 w-full xl:w-1/2">
            <BorderContainer
              title={t("donor_name")}
              required={true}
              parentClassName="p-t-4 pb-0 px-0"
              className="grid grid-cols-1 gap-y-3"
            >
              <MultiTabInput
                optionalKey={"optional_lang"}
                onTabChanged={(key: string, tabName: string) => {
                  setDonorData((prev: any) => ({
                    ...prev,
                    [key]: tabName,
                    optional_lang: tabName,
                  }));
                }}
                onChanged={(value: string, name: string) => {
                  setDonorData((prev: any) => ({
                    ...prev,
                    [name]: value,
                  }));
                }}
                name="name"
                highlightColor="bg-tertiary"
                userData={donorData}
                errorData={error}
                placeholder={t("content")}
                className="rtl:text-xl-rtl rounded-none border-t border-x-0 border-b-0"
                tabsClassName="gap-x-5 px-3"
              >
                <SingleTab>english</SingleTab>
                <SingleTab>farsi</SingleTab>
                <SingleTab>pashto</SingleTab>
              </MultiTabInput>
            </BorderContainer>

            <CustomInput
              readOnly={!hasEdit}
              required={true}
              requiredHint={`* ${t("required")}`}
              size_="sm"
              lable={t("abbr")}
              name="abbr"
              defaultValue={donorData["abbr"]}
              placeholder={t("abbr_english")}
              type="text"
              className="uppercase"
              errorMessage={error.get("abbr")}
              onBlur={(e: any) => {
                const { name, value } = e.target;
                setDonorData({ ...donorData, [name]: value });
              }}
            />
            <CustomInput
              readOnly={!hasEdit}
              required={true}
              requiredHint={`* ${t("required")}`}
              size_="sm"
              lable={t("username")}
              name="username"
              defaultValue={donorData["username"]}
              placeholder={t("username")}
              type="text"
              className="uppercase"
              errorMessage={error.get("username")}
              onBlur={(e: any) => {
                const { name, value } = e.target;
                setDonorData({ ...donorData, [name]: value });
              }}
            />

            <CustomInput
              size_="sm"
              dir="ltr"
              required={true}
              requiredHint={`* ${t("required")}`}
              className="rtl:text-end"
              lable={t("contact")}
              placeholder={t("enter_ur_pho_num")}
              defaultValue={donorData["contact"]}
              type="text"
              name="contact"
              errorMessage={error.get("contact")}
              onChange={(e: any) => {
                const { name, value } = e.target;
                setDonorData({ ...donorData, [name]: value });
              }}
              readOnly={!hasEdit}
            />
            <CustomInput
              size_="sm"
              name="email"
              required={true}
              requiredHint={`* ${t("required")}`}
              lable={t("email")}
              defaultValue={donorData["email"]}
              placeholder={t("enter_your_email")}
              type="email"
              errorMessage={error.get("email")}
              onChange={(e: any) => {
                const { name, value } = e.target;
                setDonorData({ ...donorData, [name]: value });
              }}
              dir="ltr"
              className="rtl:text-right"
              readOnly={!hasEdit}
            />

            <BorderContainer
              title={t("address")}
              required={true}
              parentClassName="mt-3"
              className="flex flex-col items-start gap-y-3"
            >
              <APICombobox
                placeholderText={t("search_item")}
                errorText={t("no_item")}
                onSelect={(selection: any) =>
                  setDonorData({ ...donorData, ["province"]: selection })
                }
                lable={t("province")}
                required={true}
                selectedItem={donorData["province"]?.name}
                placeHolder={t("select_a")}
                errorMessage={error.get("province")}
                apiUrl={"provinces/" + 1}
                mode="single"
                readonly={!hasEdit}
              />
              {donorData.province && (
                <APICombobox
                  placeholderText={t("search_item")}
                  errorText={t("no_item")}
                  onSelect={(selection: any) =>
                    setDonorData({ ...donorData, ["district"]: selection })
                  }
                  lable={t("district")}
                  required={true}
                  selectedItem={donorData["district"]?.name}
                  placeHolder={t("select_a")}
                  errorMessage={error.get("district")}
                  apiUrl={"districts/" + donorData?.province?.id}
                  mode="single"
                  key={donorData?.province?.id}
                  readonly={!hasEdit}
                />
              )}

              {donorData.district && (
                <MultiTabInput
                  title={t("area")}
                  parentClassName="w-full"
                  optionalKey={"optional_lang"}
                  onTabChanged={(key: string, tabName: string) => {
                    setDonorData({
                      ...donorData,
                      [key]: tabName,
                      optional_lang: tabName,
                    });
                  }}
                  onChanged={(value: string, name: string) => {
                    setDonorData({
                      ...donorData,
                      [name]: value,
                    });
                  }}
                  name="area"
                  highlightColor="bg-tertiary"
                  userData={donorData}
                  errorData={error}
                  placeholder={t("content")}
                  className="rtl:text-xl-rtl"
                  tabsClassName="gap-x-5"
                  readOnly={!hasEdit}
                >
                  <SingleTab>english</SingleTab>
                  <SingleTab>farsi</SingleTab>
                  <SingleTab>pashto</SingleTab>
                </MultiTabInput>
              )}
            </BorderContainer>

            <PrimaryButton onClick={saveData} className={`shadow-lg`}>
              <ButtonSpinner loading={loading}>{t("save")}</ButtonSpinner>
            </PrimaryButton>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
