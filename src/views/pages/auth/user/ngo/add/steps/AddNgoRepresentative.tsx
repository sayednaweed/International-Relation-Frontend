import BorderContainer from "@/components/custom-ui/container/BorderContainer";
import MultiTabInput from "@/components/custom-ui/input/mult-tab/MultiTabInput";
import SingleTab from "@/components/custom-ui/input/mult-tab/parts/SingleTab";
import { StepperContext } from "@/components/custom-ui/stepper/StepperContext";
import { useContext } from "react";
import { useTranslation } from "react-i18next";

export default function AddNgoRepresentative() {
  const { t } = useTranslation();
  const { userData, setUserData, error } = useContext(StepperContext);
  return (
    <div className="flex flex-col mt-10 w-full md:w-[60%] lg:w-[400px] xl:w-1/3 gap-y-6 pb-12">
      <BorderContainer
        title={t("representative")}
        required={true}
        parentClassName="p-t-4 pb-0 px-0"
        className="grid grid-cols-1 gap-y-3"
      >
        <MultiTabInput
          optionalKey={"optional_lang"}
          onTabChanged={(key: string, tabName: string) => {
            setUserData({
              ...userData,
              [key]: tabName,
              optional_lang: tabName,
            });
          }}
          onChanged={(value: string, name: string) => {
            setUserData({
              ...userData,
              [name]: value,
            });
          }}
          name="repre_name"
          highlightColor="bg-tertiary"
          userData={userData}
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
    </div>
  );
}
