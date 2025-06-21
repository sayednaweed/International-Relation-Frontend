import BorderContainer from "@/components/custom-ui/container/BorderContainer";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import MultiTabInput from "@/components/custom-ui/input/mult-tab/MultiTabInput";
import SingleTab from "@/components/custom-ui/input/mult-tab/parts/SingleTab";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import { StepperContext } from "@/components/custom-ui/stepper/StepperContext";
import { useContext } from "react";
import { useTranslation } from "react-i18next";

export default function AddNgoStructure() {
  const { t } = useTranslation();
  const { userData, setUserData, error } = useContext(StepperContext);
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  return !userData?.validationChecklist ? (
    <NastranSpinner />
  ) : (
    <div className="flex flex-col mt-10 w-full lg:w-1/2 2xl:w-1/3 gap-y-6 pb-12">
      <BorderContainer
        title={t("pro_manager_name")}
        required={true}
        parentClassName="p-t-4 pb-0 px-0"
        className="grid grid-cols-1 gap-3"
      >
        <MultiTabInput
          optionalKey={"optional_lang"}
          onTabChanged={(key: string, tabName: string) => {
            setUserData((prev: any) => ({
              ...prev,
              [key]: tabName,
              optional_lang: tabName,
            }));
          }}
          onChanged={(value: string, name: string) => {
            setUserData((prev: any) => ({
              ...prev,
              [name]: value,
            }));
          }}
          name="pro_manager_name"
          highlightColor="bg-tertiary"
          userData={userData}
          errorData={error}
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
        defaultValue={userData["pro_manager_contact"]}
        type="text"
        name="pro_manager_contact"
        errorMessage={error.get("pro_manager_contact")}
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
        defaultValue={userData["pro_manager_email"]}
        type="email"
        name="pro_manager_email"
        errorMessage={error.get("pro_manager_email")}
        onChange={handleChange}
      />
    </div>
  );
}
