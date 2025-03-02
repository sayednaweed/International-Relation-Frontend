import CheckListChooser from "@/components/custom-ui/chooser/CheckListChooser";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import { StepperContext } from "@/components/custom-ui/stepper/StepperContext";
import { toast } from "@/components/ui/use-toast";
import { CheckList } from "@/database/tables";
import axiosClient from "@/lib/axois-client";
import { CountryEnum } from "@/lib/constants";
import { getConfiguration } from "@/lib/utils";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";

export default function CheckListTab() {
  const { t } = useTranslation();
  let { id } = useParams();
  const { userData, setUserData } = useContext(StepperContext);
  const [list, setList] = useState<CheckList[] | undefined>(undefined);
  const loadInformation = async () => {
    try {
      const url =
        userData.nationality.id == CountryEnum.afghanistan
          ? "ngo/register/checklist"
          : "ngo/register/abroad/director-checklist";
      const response = await axiosClient.get(url);
      if (response.status == 200) {
        setList(response.data.checklist);
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: error.response.data.message,
      });
      console.log(error);
    }
  };
  useEffect(() => {
    loadInformation();
  }, []);

  return (
    <div className="flex flex-col gap-y-6 pb-12">
      {list ? (
        list.map((checklist: CheckList, index: number) => {
          return (
            <CheckListChooser
              number={`${index + 1}`}
              key={checklist.id}
              url={`${
                import.meta.env.VITE_API_BASE_URL
              }/api/v1/ngo/file/upload`}
              headers={{
                "X-API-KEY": import.meta.env.VITE_BACK_END_API_TOKEN,
                "X-SERVER-ADDR": import.meta.env.VITE_BACK_END_API_IP,
                Authorization: "Bearer " + getConfiguration()?.token,
              }}
              maxSize={1024}
              accept={checklist.acceptable_mimes}
              name={checklist.name}
              defaultFile={userData.checklistMap.get(checklist.id)}
              validTypes={["image/png", "image/jpeg", "image/gif"]}
              uploadParam={{
                checklist_id: checklist.id,
                ngo_id: id,
              }}
              onComplete={async (record: any) => {
                for (const element of record) {
                  const item = element[element.length - 1];
                  const checklistMap: Map<string, any> = userData.checklistMap;
                  checklistMap.set(checklist.id, item);
                  setUserData({
                    ...userData,
                    checklistMap: checklistMap,
                  });
                }
              }}
              onStart={async (file: File) => {
                const checklistMap: Map<string, any> = userData.checklistMap;
                checklistMap.set(checklist.id, file);
                setUserData({
                  ...userData,
                  checklistMap: checklistMap,
                });
              }}
            />
          );
        })
      ) : (
        <NastranSpinner />
      )}
    </div>
  );
}
