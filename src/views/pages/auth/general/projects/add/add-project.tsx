import { useTranslation } from "react-i18next";
import { useModelOnRequestHide } from "@/components/custom-ui/model/hook/useModelOnRequestHide";
import CloseButton from "@/components/custom-ui/button/CloseButton";
import Stepper from "@/components/custom-ui/stepper/Stepper";
import CompleteStep from "@/components/custom-ui/stepper/CompleteStep";
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";
import { Dispatch, SetStateAction } from "react";
import { setServerError } from "@/validation/validation";
import {
  Building2,
  Check,
  Coins,
  NotebookPen,
  User as UserIcon,
} from "lucide-react";
import AddNgoAccount from "./steps/AddNgoAccount";
import { NgoInformation } from "@/lib/types";
import AddNgoRepresentative from "./steps/AddNgoRepresentative";
import { checkStrength, passwordStrengthScore } from "@/validation/utils";
import CheckListTab from "./steps/checklist-tab";
import AddProjectDetails from "./steps/add-project-details";

export interface AddProjectProps {
  onComplete: (ngo: NgoInformation) => void;
}
export default function AddProject(props: AddProjectProps) {
  const { onComplete } = props;
  const { t } = useTranslation();
  const { modelOnRequestHide } = useModelOnRequestHide();
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
    formData.append("repre_name_english", userData.repre_name_english);
    formData.append("repre_name_pashto", userData.repre_name_pashto);
    formData.append("repre_name_farsi", userData.repre_name_farsi);
    formData.append("pending_id", userData.letter_of_intro.pending_id);
    try {
      const response = await axiosClient.post("ngo/store", formData);
      if (response.status == 200) {
        const item = response.data.ngo;
        item.type = userData.type.name;
        onComplete(response.data.ngo);
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
  const closeModel = () => {
    modelOnRequestHide();
  };

  return (
    <div className="pt-4">
      {/* Header */}
      <div className="flex px-1 py-1 fixed w-full justify-end">
        <CloseButton dismissModel={closeModel} />
      </div>
      {/* Body */}
      <Stepper
        isCardActive={true}
        size="wrap-height"
        className="bg-transparent dark:!bg-transparent"
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
            description: t("detail"),
            icon: <UserIcon className="size-[16px]" />,
          },
          {
            description: t("center_budget"),
            icon: <Coins className="size-[16px]" />,
          },
          {
            description: t("organ_structure"),
            icon: <Building2 className="size-[16px]" />,
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
            component: <AddProjectDetails />,
            validationRules: [
              { name: "name_english", rules: ["required", "max:128", "min:3"] },
              { name: "name_farsi", rules: ["required", "max:128", "min:3"] },
              { name: "name_pashto", rules: ["required", "max:128", "min:3"] },
              { name: "abbr", rules: ["required"] },
              { name: "type", rules: ["required"] },
              { name: "province", rules: ["required"] },
              { name: "district", rules: ["required"] },
              { name: "area_english", rules: ["required", "max:200", "min:3"] },
              { name: "area_pashto", rules: ["required", "max:200", "min:3"] },
              { name: "area_farsi", rules: ["required", "max:200", "min:3"] },
            ],
          },
          {
            component: <AddNgoRepresentative />,
            validationRules: [
              {
                name: "repre_name_english",
                rules: ["required", "max:128", "min:3"],
              },
              {
                name: "repre_name_farsi",
                rules: ["required", "max:128", "min:3"],
              },
              {
                name: "repre_name_pashto",
                rules: ["required", "max:128", "min:3"],
              },
              {
                name: "letter_of_intro",
                rules: ["required"],
              },
            ],
          },
          {
            component: <AddNgoAccount />,
            validationRules: [
              { name: "username", rules: ["required", "max:128", "min:2"] },
              { name: "contact", rules: ["required"] },
              { name: "email", rules: ["required"] },
              {
                name: "password",
                rules: [
                  (value: any) => {
                    const strength = checkStrength(value, t);
                    const score = passwordStrengthScore(strength);
                    if (score === 4) return true;
                    return false;
                  },
                ],
              },
            ],
          },
          {
            component: (
              <CheckListTab
                onSaveClose={async (
                  userData: any,
                  currentStep: number,
                  onlySave: boolean
                ) => {}}
                type="register"
              />
            ),
            validationRules: [
              { name: "username", rules: ["required", "max:128", "min:2"] },
              { name: "contact", rules: ["required"] },
              { name: "email", rules: ["required"] },
              {
                name: "password",
                rules: [
                  (value: any) => {
                    const strength = checkStrength(value, t);
                    const score = passwordStrengthScore(strength);
                    if (score === 4) return true;
                    return false;
                  },
                ],
              },
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
