import { useTranslation } from "react-i18next";
import Stepper from "@/components/custom-ui/stepper/Stepper";
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Building2, Check, Coins, NotebookPen, UserIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { ServerError } from "@/components/custom-ui/errors/ServerError";
import { StatusEnum, TaskTypeEnum } from "@/lib/constants";
import { setServerError } from "@/validation/validation";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import {
  Breadcrumb,
  BreadcrumbHome,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/custom-ui/Breadcrumb/Breadcrumb";
import CompleteStep from "@/components/custom-ui/stepper/CompleteStep";
import AddProjectDetails from "./steps/add-project-details";
import AddCenterBudget from "./steps/add-center-budget";
import { useGeneralAuthState } from "@/context/AuthContextProvider";
import AddNgoStructure from "./steps/add-ngo-structure";
import { isString } from "@/lib/utils";
import ProjectCheckListTab from "./steps/project-checklist-tab";

export default function AddProject() {
  const { t } = useTranslation();
  const { user } = useGeneralAuthState();
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState(false);
  const fetchData = async () => {
    try {
      const response = await axiosClient.get(`ngo/status/${user.id}`);
      if (response.status == 200) {
        const data = response.data;
        if (data.status_id == StatusEnum.registered) {
          setAllowed(true);
        } else {
          navigate("/unauthorized", { replace: true });
        }
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
      });
      console.log(error);
      navigate("/unauthorized", { replace: true });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const SaveContent = async (formData: FormData) => {
    try {
      const response = await axiosClient.post(
        `store/task/with/content/${user.id}`,
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
      console.log(error);
    }
    return false;
  };
  const beforeStepSuccess = async (
    userData: any,
    currentStep: number,
    setError: Dispatch<SetStateAction<Map<string, string>>>,
    backClicked: boolean
  ) => {
    if (!backClicked && currentStep == 2 && userData?.centers_list) {
      let totalProvince = 0;
      for (const center of userData?.centers_list) {
        totalProvince += Number(center?.budget);
      }
      if (totalProvince != userData?.budget) {
        // 2. Check province budget is not less than total budget
        toast({
          toastType: "ERROR",
          title: t("error"),
          description: "Province budget falls short of total budget.",
        });
        return false;
      }
    }
    if (!backClicked && currentStep == 3) {
      try {
        let formData = new FormData();
        formData.append("email", userData?.pro_manager_email);
        formData.append("contact", userData?.pro_manager_contact);
        const response = await axiosClient.post(
          "validate/email/contact",
          formData
        );
        if (response.status == 200) {
          const emailExist = response.data.email_found === true;
          const contactExist = response.data.contact_found === true;
          if (emailExist || contactExist) {
            const errMap = new Map<string, string>();
            if (emailExist) {
              errMap.set(
                "pro_manager_email",
                `${t("pro_manager_email")} ${t("is_registered_before")}`
              );
            }
            if (contactExist) {
              errMap.set(
                "pro_manager_contact",
                `${t("pro_manager_contact")} ${t("is_registered_before")}`
              );
            }
            setError(errMap);
            return false;
          }
        }
      } catch (error: any) {
        toast({
          toastType: "ERROR",
          title: t("error"),
          description: error.response.data.message,
        });
        console.log(error);
        return false;
      }
    }
    return true;
  };

  const stepsCompleted = async (
    userData: any,
    setError: Dispatch<SetStateAction<Map<string, string>>>
  ) => {
    let formData = new FormData();
    try {
      const content = {
        ...userData, // shallow copy of the userData object
        checklistMap: Array.from(userData.checklistMap),
        start_date: !isString(userData?.start_date)
          ? userData?.start_date?.toDate()?.toISOString()
          : userData?.start_date,
        end_date: !isString(userData?.end_date)
          ? userData?.end_date?.toDate()?.toISOString()
          : userData?.end_date,
      };

      formData.append("ngo_id", user.id.toString());
      formData.append("content", JSON.stringify(content));

      const response = await axiosClient.post("projects", formData);

      if (response.status == 200) {
        // Go to projects page
        navigate("/projects", { replace: true });
        return true;
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: <ServerError errors={error.response.data.errors} />,
        duration: 9000 * 10,
      });
      setServerError(error.response.data.errors, setError);

      return false;
    }
    return true;
  };

  const onSaveClose = async (
    userData: any,
    currentStep: number,
    onlySave: boolean
  ) => {
    const content = {
      ...userData, // shallow copy of the userData object
      checklistMap: Array.from(userData.checklistMap),
      start_date: !isString(userData?.start_date)
        ? userData?.start_date?.toDate()?.toISOString()
        : userData?.start_date,
      end_date: !isString(userData?.end_date)
        ? userData?.end_date?.toDate()?.toISOString()
        : userData?.end_date,
    };
    let formData = new FormData();
    formData.append("contents", JSON.stringify(content));
    formData.append("step", currentStep.toString());
    formData.append("task_type", TaskTypeEnum.project_registeration.toString());
    formData.append("id", user.id.toString());
    await SaveContent(formData);
    if (!onlySave) onClose();
  };
  const handleGoBack = () => navigate(-1);
  const handleGoHome = () => navigate("/dashboard", { replace: true });
  const onClose = () => {
    navigate("/projects", { replace: true });
  };
  return (
    <div className="p-2">
      {allowed ? (
        <>
          <Breadcrumb>
            <BreadcrumbHome onClick={handleGoHome} />
            <BreadcrumbSeparator />
            <BreadcrumbItem onClick={handleGoBack}>
              {t("projects")}
            </BreadcrumbItem>
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
                component: (
                  <AddProjectDetails
                    type="register"
                    fetchUrl={"projects/register-form/"}
                  />
                ),
                validationRules: [
                  {
                    name: "project_name_english",
                    rules: ["required", "max:128", "min:2"],
                  },
                  {
                    name: "project_name_farsi",
                    rules: ["required", "max:128", "min:2"],
                  },
                  {
                    name: "project_name_pashto",
                    rules: ["required", "max:128", "min:2"],
                  },
                  {
                    name: "preamble_english",
                    rules: ["required", "max:4048", "min:2"],
                  },
                  {
                    name: "preamble_farsi",
                    rules: ["required", "max:4048", "min:2"],
                  },
                  {
                    name: "preamble_pashto",
                    rules: ["required", "max:4048", "min:2"],
                  },
                  {
                    name: "abbreviat_english",
                    rules: ["required", "max:4048", "min:2"],
                  },
                  {
                    name: "abbreviat_farsi",
                    rules: ["required", "max:4048", "min:2"],
                  },
                  {
                    name: "abbreviat_pashto",
                    rules: ["required", "max:4048", "min:2"],
                  },
                  {
                    name: "organization_sen_man_english",
                    rules: ["required", "max:4048", "min:2"],
                  },
                  {
                    name: "organization_sen_man_farsi",
                    rules: ["required", "max:4048", "min:2"],
                  },
                  {
                    name: "organization_sen_man_pashto",
                    rules: ["required", "max:4048", "min:2"],
                  },
                  {
                    name: "exper_in_health_english",
                    rules: ["required", "max:4048", "min:2"],
                  },
                  {
                    name: "exper_in_health_farsi",
                    rules: ["required", "max:4048", "min:2"],
                  },
                  {
                    name: "exper_in_health_pashto",
                    rules: ["required", "max:4048", "min:2"],
                  },
                  {
                    name: "project_intro_english",
                    rules: ["required", "max:4048", "min:2"],
                  },
                  {
                    name: "project_intro_farsi",
                    rules: ["required", "max:4048", "min:2"],
                  },
                  {
                    name: "project_intro_pashto",
                    rules: ["required", "max:4048", "min:2"],
                  },
                  {
                    name: "goals_english",
                    rules: ["required", "max:4048", "min:2"],
                  },
                  {
                    name: "goals_farsi",
                    rules: ["required", "max:4048", "min:2"],
                  },
                  {
                    name: "goals_pashto",
                    rules: ["required", "max:4048", "min:2"],
                  },
                  {
                    name: "objective_english",
                    rules: ["required", "max:4048", "min:2"],
                  },
                  {
                    name: "objective_farsi",
                    rules: ["required", "max:4048", "min:2"],
                  },
                  {
                    name: "objective_pashto",
                    rules: ["required", "max:4048", "min:2"],
                  },
                  {
                    name: "expected_outcome_english",
                    rules: ["required", "max:4048", "min:2"],
                  },
                  {
                    name: "expected_outcome_farsi",
                    rules: ["required", "max:4048", "min:2"],
                  },
                  {
                    name: "expected_outcome_pashto",
                    rules: ["required", "max:4048", "min:2"],
                  },
                  {
                    name: "expected_impact_english",
                    rules: ["required", "max:4048", "min:2"],
                  },
                  {
                    name: "expected_impact_farsi",
                    rules: ["required", "max:4048", "min:2"],
                  },
                  {
                    name: "expected_impact_pashto",
                    rules: ["required", "max:4048", "min:2"],
                  },
                  {
                    name: "main_activities_english",
                    rules: ["required", "max:4048", "min:2"],
                  },
                  {
                    name: "main_activities_farsi",
                    rules: ["required", "max:4048", "min:2"],
                  },
                  {
                    name: "main_activities_pashto",
                    rules: ["required", "max:4048", "min:2"],
                  },
                  {
                    name: "action_plan_english",
                    rules: ["required", "max:4048", "min:2"],
                  },
                  {
                    name: "action_plan_farsi",
                    rules: ["required", "max:4048", "min:2"],
                  },
                  {
                    name: "action_plan_pashto",
                    rules: ["required", "max:4048", "min:2"],
                  },
                ],
              },
              {
                component: <AddCenterBudget />,
                validationRules: [
                  {
                    name: "start_date",
                    rules: ["required"],
                  },
                  {
                    name: "end_date",
                    rules: ["required"],
                  },
                  {
                    name: "donor",
                    rules: ["required"],
                  },
                  {
                    name: "donor_register_no",
                    rules: ["required"],
                  },
                  {
                    name: "currency",
                    rules: ["required"],
                  },
                  {
                    name: "budget",
                    rules: ["required"],
                  },
                  {
                    name: "centers_list",
                    rules: [
                      (userData: any) => {
                        if (Array.isArray(userData?.centers_list)) {
                          if (userData.centers_list.length >= 1) return false;
                        }
                        toast({
                          toastType: "ERROR",
                          title: t("error"),
                          description: t("must_be_one_center"),
                        });
                        return true;
                      },
                    ],
                  },
                ],
              },
              {
                component: <AddNgoStructure />,
                validationRules: [
                  {
                    name: "manager",
                    rules: [
                      (userData: any) => {
                        if (userData?.previous_manager) {
                          if (!userData?.manager) {
                            return true;
                          }
                        }
                        return false;
                      },
                    ],
                  },
                  {
                    name: "pro_manager_name_english",
                    rules: [
                      (userData: any) => {
                        if (!userData?.previous_manager) {
                          if (
                            !userData?.pro_manager_name_english ||
                            userData?.pro_manager_name_english?.trim() == ""
                          ) {
                            return true;
                          }
                        }
                        return false;
                      },
                    ],
                  },
                  {
                    name: "pro_manager_name_farsi",
                    rules: [
                      (userData: any) => {
                        if (!userData?.previous_manager) {
                          if (
                            !userData?.pro_manager_name_farsi ||
                            userData?.pro_manager_name_farsi?.trim() == ""
                          ) {
                            return true;
                          }
                        }
                        return false;
                      },
                    ],
                  },
                  {
                    name: "pro_manager_name_pashto",
                    rules: [
                      (userData: any) => {
                        if (!userData?.previous_manager) {
                          if (
                            !userData?.pro_manager_name_pashto ||
                            userData?.pro_manager_name_pashto?.trim() == ""
                          ) {
                            return true;
                          }
                        }
                        return false;
                      },
                    ],
                  },
                  {
                    name: "pro_manager_contact",
                    rules: [
                      (userData: any) => {
                        if (!userData?.previous_manager) {
                          if (
                            !userData?.pro_manager_contact ||
                            userData?.pro_manager_contact?.trim() == ""
                          ) {
                            return true;
                          }
                        }
                        return false;
                      },
                    ],
                  },
                  {
                    name: "pro_manager_email",
                    rules: [
                      (userData: any) => {
                        if (!userData?.previous_manager) {
                          if (
                            !userData?.pro_manager_email ||
                            userData?.pro_manager_email?.trim() == ""
                          ) {
                            return true;
                          }
                        }
                        return false;
                      },
                    ],
                  },
                ],
              },
              {
                component: (
                  <ProjectCheckListTab
                    onSaveClose={onSaveClose}
                    type={"register"}
                  />
                ),
                validationRules: [
                  {
                    name: "pro_manager_name_english",
                    rules: ["required"],
                  },
                  {
                    name: "pro_manager_name_farsi",
                    rules: ["required"],
                  },
                  {
                    name: "pro_manager_name_pashto",
                    rules: ["required"],
                  },
                  {
                    name: "pro_manager_contact",
                    rules: ["required"],
                  },
                  {
                    name: "pro_manager_email",
                    rules: ["required"],
                  },
                ],
              },
              {
                component: (
                  <CompleteStep
                    successText={t("congratulation")}
                    closeText={t("close")}
                    closeModel={onClose}
                    description={t("info_stored")}
                  />
                ),
                validationRules: [],
              },
            ]}
            beforeStepSuccess={beforeStepSuccess}
            stepsCompleted={stepsCompleted}
            onSaveClose={(userData: any, currentStep: number) =>
              onSaveClose(userData, currentStep, false)
            }
            onSaveCloseText={t("save_close")}
          />
        </>
      ) : (
        <NastranSpinner label={t("check_auth")} className="mt-16" />
      )}
    </div>
  );
}
