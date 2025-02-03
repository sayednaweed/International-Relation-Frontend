import { useTranslation } from "react-i18next";
import Stepper from "@/components/custom-ui/stepper/Stepper";
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";
import { Dispatch, SetStateAction } from "react";
import CompleteStep from "@/components/custom-ui/stepper/CompleteStep";
import { Check, Database, Grip, NotebookPen, UserRound } from "lucide-react";
import NgoInformationTab from "./steps/ngo-information-tab";
import { setServerError, validate } from "@/validation/validation";
import DirectorInformationTab from "./steps/director-information-tab";
import MoreInformationTab from "./steps/more-information-tab";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, useNavigate, useParams } from "react-router";
import AnimHomeIcon from "@/components/custom-ui/icons/AnimHomeIcon";
import CheckListTab from "./steps/checklist-tab";
import { ValidateItem } from "@/validation/types";
import { CountryEnum } from "@/lib/constants";
import { isString } from "@/lib/utils";

export default function EditNgoProgress() {
  const { t } = useTranslation();
  let { id } = useParams();

  const navigate = useNavigate();
  const beforeStepSuccess = async (
    userData: any,
    currentStep: number,
    setError: Dispatch<SetStateAction<Map<string, string>>>,
    backClicked: boolean
  ) => {
    if (!backClicked) {
      if (currentStep == 1) {
        let formData = new FormData();
        // Step.1
        const content = userData;
        if (!isString(content.establishment_date))
          content.establishment_date = content.establishment_date
            ?.toDate()
            ?.toISOString();
        formData.append("contents", JSON.stringify(content));
        if (id) formData.append("id", id.toString());
        formData.append("step", currentStep.toString());
        try {
          const response = await axiosClient.post(
            `ngos/storePersonalDetial/${id}`,
            formData
          );
          if (response.status == 200) {
            return true;
          }
        } catch (error: any) {
          toast({
            toastType: "ERROR",
            title: t("error"),
            description: error.response.data.message,
          });
          setServerError(error.response.data.errors, setError);
          console.log(error);
        }
      } else if (currentStep == 2) {
        // 1. Validate
        const compulsoryFields: ValidateItem[] = [];
        if (userData.nationality?.id != CountryEnum.afghanistan) {
          compulsoryFields.push({
            name: "nid_attach",
            rules: ["required"],
          });
        }

        const passed = await validate(compulsoryFields, userData, setError);
        if (!passed) {
          return false;
        }
        let formData = new FormData();
        // Step.1
        formData.append("contents", JSON.stringify(userData));
        formData.append("step", currentStep.toString());
        if (id) formData.append("id", id.toString());
        try {
          const response = await axiosClient.post(
            `ngos/storePersonalDetial/${id}`,
            formData
          );
          if (response.status == 200) {
            return true;
          }
        } catch (error: any) {
          toast({
            toastType: "ERROR",
            title: t("error"),
            description: error.response.data.message,
          });
          setServerError(error.response.data.errors, setError);
          console.log(error);
        }
      } else if (currentStep == 3) {
        let formData = new FormData();
        // Step.1
        formData.append("contents", JSON.stringify(userData));
        formData.append("step", currentStep.toString());
        if (id) formData.append("id", id.toString());
        try {
          const response = await axiosClient.post(
            `ngos/storePersonalDetial/${id}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data", // This is handled by axios automatically, but it's here just for clarity
              },
            }
          );
          if (response.status == 200) {
            return true;
          }
        } catch (error: any) {
          toast({
            toastType: "ERROR",
            title: t("error"),
            description: error.response.data.message,
          });
          setServerError(error.response.data.errors, setError);
          console.log(error);
        }
      }
    } else return true;
    return false;
  };

  const stepsCompleted = async (
    userData: any,
    setError: Dispatch<SetStateAction<Map<string, string>>>
  ) => {
    let formData = new FormData();
    // Step.1

    // Step.2
    try {
      formData.append("content", JSON.stringify(userData));
      const response = await axiosClient.post(
        "ngo/store/personal/detail-final",
        formData
      );

      if (response.status == 200) {
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
    return false;
  };

  const closeModel = async () => {};
  const gotoNews = async () => navigate("/ngo", { replace: true });
  return (
    <div className="p-2">
      <Breadcrumb className="select-none rtl:text-2xl-rtl ltr:text-xl-ltr bg-card dark:bg-card-secondary w-fit py-1 ltr:ps-3 ltr:pe-8 rtl:pe-3 rtl:ps-8 rounded-md border">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/dashboard">
              <AnimHomeIcon />
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="rtl:rotate-180" />
          <BreadcrumbItem onClick={gotoNews}>
            <BreadcrumbPage className="text-tertiary cursor-pointer">
              {t("ngo")}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Stepper
        isCardActive={true}
        size="wrap-height"
        className="mt-3 overflow-y-auto overflow-x-hidden"
        progressText={{
          complete: t("complete"),
          inProgress: t("in_progress"),
          pending: t("pending"),
          step: t("step"),
        }}
        loadingText={t("store_infor")}
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
              { name: "name_english", rules: ["required", "max:128", "min:5"] },
              { name: "name_farsi", rules: ["required", "max:128", "min:5"] },
              { name: "name_pashto", rules: ["required", "max:128", "min:5"] },
              { name: "abbr", rules: ["required"] },
              { name: "type", rules: ["required"] },
              { name: "contact", rules: ["required"] },
              { name: "email", rules: ["required"] },
              { name: "moe_registration_no", rules: ["required"] },
              { name: "country", rules: ["required"] },
              { name: "establishment_date", rules: ["required"] },
              { name: "province", rules: ["required"] },
              { name: "district", rules: ["required"] },
              { name: "area_english", rules: ["required", "max:128", "min:5"] },
              { name: "area_pashto", rules: ["required", "max:128", "min:5"] },
              { name: "area_farsi", rules: ["required", "max:128", "min:5"] },
            ],
          },
          {
            component: <DirectorInformationTab />,
            validationRules: [
              {
                name: "director_name_english",
                rules: ["required", "max:128", "min:5"],
              },
              {
                name: "director_name_farsi",
                rules: ["required", "max:128", "min:5"],
              },
              {
                name: "director_name_pashto",
                rules: ["required", "max:128", "min:5"],
              },
              {
                name: "surname_english",
                rules: ["required", "max:128", "min:3"],
              },
              {
                name: "surname_pashto",
                rules: ["required", "max:128", "min:3"],
              },
              {
                name: "surname_farsi",
                rules: ["required", "max:128", "min:3"],
              },
              {
                name: "director_contact",
                rules: ["required"],
              },
              {
                name: "director_email",
                rules: ["required"],
              },
              {
                name: "gender",
                rules: ["required"],
              },
              {
                name: "nationality",
                rules: ["required"],
              },
              {
                name: "identity_type",
                rules: ["required"],
              },
              {
                name: "nid",
                rules: ["required"],
              },
              {
                name: "director_province",
                rules: ["required"],
              },
              {
                name: "director_dis",
                rules: ["required"],
              },
              {
                name: "director_area_english",
                rules: ["required", "max:128", "min:5"],
              },
              {
                name: "director_area_farsi",
                rules: ["required", "max:128", "min:5"],
              },
              {
                name: "director_area_pashto",
                rules: ["required", "max:128", "min:5"],
              },
            ],
          },
          {
            component: <MoreInformationTab />,
            validationRules: [
              {
                name: "vision_english",
                rules: ["required", "min:30"],
              },
              {
                name: "vision_pashto",
                rules: ["required", "min:30"],
              },
              {
                name: "vision_farsi",
                rules: ["required", "min:30"],
              },
              {
                name: "mission_english",
                rules: ["required", "min:30"],
              },
              {
                name: "mission_pashto",
                rules: ["required", "min:30"],
              },
              {
                name: "mission_farsi",
                rules: ["required", "min:30"],
              },
              {
                name: "general_objes_english",
                rules: ["required", "min:30"],
              },
              {
                name: "general_objes_pashto",
                rules: ["required", "min:30"],
              },
              {
                name: "general_objes_farsi",
                rules: ["required", "min:30"],
              },
              {
                name: "objes_in_afg_english",
                rules: ["required", "min:30"],
              },
              {
                name: "objes_in_afg_pashto",
                rules: ["required", "min:30"],
              },
              {
                name: "objes_in_afg_farsi",
                rules: ["required", "min:30"],
              },
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
    </div>
  );
}
