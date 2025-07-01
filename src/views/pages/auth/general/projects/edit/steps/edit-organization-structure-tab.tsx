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
import { useParams } from "react-router";
import SingleTab from "@/components/custom-ui/input/mult-tab/parts/SingleTab";
import BorderContainer from "@/components/custom-ui/container/BorderContainer";
import MultiTabInput from "@/components/custom-ui/input/mult-tab/MultiTabInput";
import { ProjectOrganizationStructureType } from "@/lib/types";
import NastranModel from "@/components/custom-ui/model/NastranModel";
import AddProjectManagerDailog from "../parts/add-project-manager-Dailog";

interface EditOrganizationStructureTabProps {
  hasEdit: boolean;
}
export default function EditOrganizationStructureTab(
  props: EditOrganizationStructureTabProps
) {
  const { hasEdit } = props;
  const { t } = useTranslation();
  let { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [projectStruction, setProjectStruction] = useState<
    | Pick<
        ProjectOrganizationStructureType,
        | "pro_manager_name_english"
        | "pro_manager_name_farsi"
        | "pro_manager_name_pashto"
        | "pro_manager_contact"
        | "pro_manager_email"
      >
    | undefined
  >(undefined);

  const loadInformation = async () => {
    try {
      const response = await axiosClient.get(
        `projects/organization/structure/${id}`
      );
      if (response.status == 200) {
        setProjectStruction(response.data);
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
    setLoading(false);
  };
  useEffect(() => {
    loadInformation();
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setProjectStruction((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <Card>
      <CardHeader className="space-y-0">
        <CardTitle className="rtl:text-3xl-rtl ltr:text-2xl-ltr">
          {t("organ_structure")}
        </CardTitle>
        <CardDescription className="rtl:text-xl-rtl ltr:text-lg-ltr">
          {t("update_organ_structure_info")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {failed ? (
          <h1 className="rtl:text-2xl-rtl">{t("u_are_not_authzed!")}</h1>
        ) : loading ? (
          <NastranSpinner />
        ) : (
          <div className="flex flex-col mt-10 w-full lg:w-1/2 2xl:w-1/3 gap-y-6 pb-12">
            {hasEdit && (
              <NastranModel
                size="lg"
                visible={true}
                isDismissable={false}
                button={undefined}
                showDialog={async () => true}
              >
                <AddProjectManagerDailog
                  onComplete={(manager) => setProjectStruction(manager)}
                />
              </NastranModel>
            )}

            <BorderContainer
              title={t("pro_manager_name")}
              required={true}
              parentClassName="p-t-4 pb-0 px-0"
              className="grid grid-cols-1 gap-3"
            >
              <MultiTabInput
                optionalKey={"optional_lang"}
                onTabChanged={(key: string, tabName: string) => {
                  setProjectStruction((prev: any) => ({
                    ...prev,
                    [key]: tabName,
                    optional_lang: tabName,
                  }));
                }}
                onChanged={(value: string, name: string) => {
                  setProjectStruction((prev: any) => ({
                    ...prev,
                    [name]: value,
                  }));
                }}
                name="pro_manager_name"
                highlightColor="bg-tertiary"
                userData={projectStruction}
                placeholder={t("name")}
                className="rtl:text-xl-rtl rounded-none border-t border-x-0 border-b-0 resize-none"
                tabsClassName="gap-x-5 px-3"
              >
                <SingleTab>english</SingleTab>
                <SingleTab>farsi</SingleTab>
                <SingleTab>pashto</SingleTab>
              </MultiTabInput>
            </BorderContainer>
            <CustomInput
              size_="sm"
              dir="ltr"
              required={true}
              requiredHint={`* ${t("required")}`}
              className="rtl:text-end"
              lable={t("pro_manager_contact")}
              placeholder={t("contact")}
              defaultValue={projectStruction?.pro_manager_contact}
              type="text"
              name="pro_manager_contact"
              onChange={handleChange}
            />
            <CustomInput
              size_="sm"
              dir="ltr"
              required={true}
              requiredHint={`* ${t("required")}`}
              className="rtl:text-end"
              lable={t("pro_manager_email")}
              placeholder={t("email")}
              defaultValue={projectStruction?.pro_manager_email}
              type="email"
              name="pro_manager_email"
              onChange={handleChange}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
