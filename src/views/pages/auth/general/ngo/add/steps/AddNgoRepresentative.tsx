import CheckListChooser from "@/components/custom-ui/chooser/CheckListChooser";
import BorderContainer from "@/components/custom-ui/container/BorderContainer";
import MultiTabInput from "@/components/custom-ui/input/mult-tab/MultiTabInput";
import SingleTab from "@/components/custom-ui/input/mult-tab/parts/SingleTab";
import { StepperContext } from "@/components/custom-ui/stepper/StepperContext";
import { ChecklistEnum, TaskTypeEnum } from "@/lib/constants";
import { FileType } from "@/lib/types";
import { getConfiguration } from "@/lib/utils";
import { useContext } from "react";
import { useTranslation } from "react-i18next";

export default function AddNgoRepresentative() {
  const { t } = useTranslation();
  const { userData, setUserData, error } = useContext(StepperContext);
  return (
    <div className="flex flex-col mt-10 w-full xl:w-1/3 gap-y-6 pb-12">
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
          placeholder={t("enter_your_name")}
          className="rtl:text-xl-rtl rounded-none border-t border-x-0 border-b-0"
          tabsClassName="gap-x-5 px-3"
        >
          <SingleTab>english</SingleTab>
          <SingleTab>farsi</SingleTab>
          <SingleTab>pashto</SingleTab>
        </MultiTabInput>
      </BorderContainer>
      <BorderContainer
        title={t("letter_of_intro")}
        required={true}
        parentClassName="p-t-4 pb-0 px-0 "
        className="grid grid-cols-1 gap-y-3 px-2"
      >
        <CheckListChooser
          number={undefined}
          hasEdit={true}
          url={`${
            import.meta.env.VITE_API_BASE_URL
          }/api/v1/single/checklist/file/upload`}
          headers={{
            "X-API-KEY": import.meta.env.VITE_BACK_END_API_TOKEN,
            "X-SERVER-ADDR": import.meta.env.VITE_BACK_END_API_IP,
            Authorization: "Bearer " + getConfiguration()?.token,
          }}
          maxSize={1024}
          accept={".pdf,.jpeg,.jpg,.png"}
          name={t("letter_of_intro")}
          defaultFile={userData.letter_of_intro as FileType}
          validTypes={["image/png", "image/jpeg", "application/pdf"]}
          uploadParam={{
            checklist_id: ChecklistEnum.ngo_representor_letter,
            task_type: TaskTypeEnum.ngo_registeration,
          }}
          onComplete={async (record: any) => {
            for (const element of record) {
              const checklist = element[element.length - 1];
              setUserData({
                ...userData,
                letter_of_intro: checklist,
              });
            }
          }}
          onStart={async (_file: any) => {
            // const updated = documents.map((item) =>
            //   item.checklist_id === file.checklist_id ? file : item
            // );
            // setDocuments(updated);
          }}
        />
        {error.get("letter_of_intro") && (
          <h1 className="rtl:text-md-rtl ltr:text-sm-ltr px-2 capitalize text-start text-red-400">
            {error.get("letter_of_intro")}
          </h1>
        )}
      </BorderContainer>
    </div>
  );
}
