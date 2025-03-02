import { useTranslation } from "react-i18next";
import { useModelOnRequestHide } from "@/components/custom-ui/model/hook/useModelOnRequestHide";
import CloseButton from "@/components/custom-ui/button/CloseButton";
import Stepper from "@/components/custom-ui/stepper/Stepper";
import CompleteStep from "@/components/custom-ui/stepper/CompleteStep";
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";
import { Dispatch, SetStateAction } from "react";
import { setServerError } from "@/validation/validation";
import { Check, Database, User as UserIcon, UserRound } from "lucide-react";
import AddNgoInformation from "./steps/AddNgorInformation";
import AddNgoAccount from "./steps/AddNgoAccount";
import { NgoInformation } from "@/lib/types";
import AddNgoRepresentative from "./steps/AddNgoRepresentative";

export interface AddNgoProps {
  onComplete: (ngo: NgoInformation) => void;
}
export default function AddNgo(props: AddNgoProps) {
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
    formData.append("full_name_english", userData.repre_name_english);
    formData.append("full_name_pashto", userData.repre_name_pashto);
    formData.append("full_name_farsi", userData.repre_name_farsi);
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
        loadingText={t("loading")}
        backText={t("back")}
        nextText={t("next")}
        confirmText={t("confirm")}
        steps={[
          {
            description: t("personal_details"),
            icon: <UserIcon className="size-[16px]" />,
          },
          {
            description: t("representative"),
            icon: <UserRound className="size-[16px]" />,
          },
          {
            description: t("account_information"),
            icon: <Database className="size-[16px]" />,
          },
          {
            description: t("complete"),
            icon: <Check className="size-[16px]" />,
          },
        ]}
        components={[
          {
            component: <AddNgoInformation />,
            validationRules: [
              { name: "name_english", rules: ["required", "max:128", "min:3"] },
              { name: "name_farsi", rules: ["required", "max:128", "min:3"] },
              { name: "name_pashto", rules: ["required", "max:128", "min:3"] },
              { name: "abbr", rules: ["required"] },
              { name: "type", rules: ["required"] },
              { name: "province", rules: ["required"] },
              { name: "district", rules: ["required"] },
              { name: "area_english", rules: ["required"] },
              { name: "area_pashto", rules: ["required"] },
              { name: "area_farsi", rules: ["required"] },
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
              { name: "password", rules: ["required", "max:25", "min:8"] },
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
