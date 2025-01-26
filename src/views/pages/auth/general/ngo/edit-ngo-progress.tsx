import { useTranslation } from "react-i18next";
import Stepper from "@/components/custom-ui/stepper/Stepper";
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";
import { Dispatch, SetStateAction } from "react";
import CompleteStep from "@/components/custom-ui/stepper/CompleteStep";
import { Check, Database, Grip, NotebookPen, UserRound } from "lucide-react";
import NgoInformationTab from "./steps/ngo-information-tab";
import { setServerError } from "@/validation/validation";
import DirectorInformationTab from "./steps/director-information-tab";
import MoreInformationTab from "./steps/more-information-tab";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router";
import AnimHomeIcon from "@/components/custom-ui/icons/AnimHomeIcon";
import CheckListTab from "./steps/checklist-tab";

export default function EditNgoProgress() {
  const { t } = useTranslation();
  const beforeStepSuccess = async (
    _userData: any,
    _currentStep: number,
    _setError: Dispatch<SetStateAction<Map<string, string>>>
  ) => true;

  const stepsCompleted = async (
    userData: any,
    setError: Dispatch<SetStateAction<Map<string, string>>>
  ) => {
    let formData = new FormData();
    formData.append("email", userData.email);
    formData.append("district_id", userData?.district?.id);
    formData.append("province_id", userData?.province?.id);
    formData.append("password", userData.password);
    formData.append("area_english", userData.area_english);
    formData.append("area_pashto", userData.area_pashto);
    formData.append("area_farsi", userData.area_farsi);
    formData.append("abbr", userData.abbr);
    formData.append("ngo_type_id", userData.type.id);
    formData.append("contact", userData.contact);
    formData.append("name_english", userData.name_english);
    formData.append("name_pashto", userData.name_pashto);
    formData.append("name_farsi", userData.name_farsi);
    formData.append("username", userData.username);
    try {
      const response = await axiosClient.post("ngo/store", formData);
      if (response.status == 200) {
        const item = response.data.ngo;
        item.type = userData.type.name;
        toast({
          toastType: "SUCCESS",
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
      return false;
    }
    return true;
  };

  const closeModel = async () => {};
  return (
    <>
      <Breadcrumb className="select-none rtl:text-2xl-rtl ltr:text-xl-ltr bg-card w-fit py-1 ltr:ps-3 ltr:pe-8 rtl:pe-3 rtl:ps-8 rounded-md border">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/dashboard">
              <AnimHomeIcon />
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="rtl:rotate-180" />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-tertiary">
              {t("ngo")}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Stepper
        isCardActive={true}
        size="wrap-height"
        className="bg-transparent w-[90%] mx-auto mt-4"
        progressText={{
          complete: t("complete"),
          inProgress: t("in_progress"),
          pending: t("pending"),
          step: t("step"),
        }}
        loadingText={t("loading")}
        backText={t("back")}
        nextText={t("next")}
        confirmText={t("confirm")}
        steps={[
          {
            description: t("personal_details"),
            icon: <Database className="size-[16px]" />,
          },
          {
            description: t("director"),
            icon: <UserRound className="size-[16px]" />,
          },
          {
            description: t("more_information"),
            icon: <Grip className="size-[16px]" />,
          },
          {
            description: t("checklist"),
            icon: <NotebookPen className="size-[16px]" />,
          },
          {
            description: t("complete"),
            icon: <Check className="size-[16px]" />,
          },
        ]}
        components={[
          {
            component: <NgoInformationTab />,
            validationRules: [
              //   { name: "name_english", rules: ["required", "max:128", "min:5"] },
              //   { name: "name_farsi", rules: ["required", "max:128", "min:5"] },
              //   { name: "name_pashto", rules: ["required", "max:128", "min:5"] },
              //   { name: "abbr", rules: ["required"] },
              //   { name: "type", rules: ["required"] },
              //   { name: "contact", rules: ["required"] },
              //   { name: "email", rules: ["required"] },
              //   { name: "moe_registration_no", rules: ["required"] },
              //   { name: "country", rules: ["required"] },
              //   { name: "establishment_date", rules: ["required"] },
              //   { name: "province", rules: ["required"] },
              //   { name: "district", rules: ["required"] },
              //   { name: "area_english", rules: ["required"] },
              //   { name: "area_pashto", rules: ["required"] },
              //   { name: "area_farsi", rules: ["required"] },
            ],
          },
          {
            component: <DirectorInformationTab />,
            validationRules: [
              // {
              //   name: "director_name_english",
              //   rules: ["required", "max:128", "min:5"],
              // },
              // {
              //   name: "director_name_farsi",
              //   rules: ["required", "max:128", "min:5"],
              // },
              // {
              //   name: "director_name_pashto",
              //   rules: ["required", "max:128", "min:5"],
              // },
              // {
              //   name: "surname_english",
              //   rules: ["required", "max:128", "min:5"],
              // },
              // {
              //   name: "surname_pashto",
              //   rules: ["required", "max:128", "min:5"],
              // },
              // {
              //   name: "surname_farsi",
              //   rules: ["required", "max:128", "min:5"],
              // },
              // {
              //   name: "director_contact",
              //   rules: ["required"],
              // },
              // {
              //   name: "director_email",
              //   rules: ["required"],
              // },
              // {
              //   name: "gender",
              //   rules: ["required"],
              // },
              // {
              //   name: "nationality",
              //   rules: ["required"],
              // },
              // {
              //   name: "identity_type",
              //   rules: ["required"],
              // },
              // {
              //   name: "nid",
              //   rules: ["required"],
              // },
              // {
              //   name: "nid_attach",
              //   rules: ["required"],
              // },
              // {
              //   name: "director_province",
              //   rules: ["required"],
              // },
              // {
              //   name: "director_dis",
              //   rules: ["required"],
              // },
              // {
              //   name: "director_area",
              //   rules: ["required"],
              // },
            ],
          },
          {
            component: <MoreInformationTab />,
            validationRules: [
              // {
              //   name: "vision_english",
              //   rules: ["required", "min:30"],
              // },
              // {
              //   name: "vision_pashto",
              //   rules: ["required", "min:30"],
              // },
              // {
              //   name: "vision_farsi",
              //   rules: ["required", "min:30"],
              // },
              // {
              //   name: "mission_english",
              //   rules: ["required", "min:30"],
              // },
              // {
              //   name: "mission_pashto",
              //   rules: ["required", "min:30"],
              // },
              // {
              //   name: "mission_farsi",
              //   rules: ["required", "min:30"],
              // },
              // {
              //   name: "general_objes_english",
              //   rules: ["required", "min:30"],
              // },
              // {
              //   name: "general_objes_pashto",
              //   rules: ["required", "min:30"],
              // },
              // {
              //   name: "general_objes_farsi",
              //   rules: ["required", "min:30"],
              // },
              // {
              //   name: "objes_in_afg_english",
              //   rules: ["required", "min:30"],
              // },
              // {
              //   name: "objes_in_afg_pashto",
              //   rules: ["required", "min:30"],
              // },
              // {
              //   name: "objes_in_afg_farsi",
              //   rules: ["required", "min:30"],
              // },
            ],
          },
          {
            component: <CheckListTab />,
            validationRules: [
              // {
              //   name: "vision_english",
              //   rules: ["required", "min:30"],
              // },
              // {
              //   name: "vision_pashto",
              //   rules: ["required", "min:30"],
              // },
              // {
              //   name: "vision_farsi",
              //   rules: ["required", "min:30"],
              // },
            ],
          },
          {
            component: (
              <CompleteStep
                successText={t("congratulation")}
                closeText={t("close")}
                againText={t("again")}
                closeModel={closeModel}
                description={t("account_created")}
              />
            ),
            validationRules: [],
          },
        ]}
        beforeStepSuccess={beforeStepSuccess}
        stepsCompleted={stepsCompleted}
      />
    </>
  );
}
