import CheckListChooser from "@/components/custom-ui/chooser/CheckListChooser";
import { StepperContext } from "@/components/custom-ui/stepper/StepperContext";
import { toast } from "@/components/ui/use-toast";
import { CheckList } from "@/database/tables";
import axiosClient from "@/lib/axois-client";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function CheckListTab() {
  const { t } = useTranslation();
  const { userData, setUserData } = useContext(StepperContext);
  const [list, setList] = useState<CheckList[]>([]);
  const loadInformation = async () => {
    try {
      const response = await axiosClient.get(`external/check-list`);
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
      {list.map((item: CheckList) => (
        <CheckListChooser
          number={item.id}
          key={item.id}
          url={`${import.meta.env.VITE_API_BASE_URL}/api/v1/ngo/file/upload`}
          headers={{
            "X-API-KEY": import.meta.env.VITE_BACK_END_API_TOKEN,
            "X-SERVER-ADDR": import.meta.env.VITE_BACK_END_API_IP,
            Authorization:
              "Bearer " +
              localStorage.getItem(import.meta.env.VITE_TOKEN_STORAGE_KEY),
          }}
          maxSize={1024}
          accept={item.acceptable_extensions}
          name={item.name}
          defaultFile={userData[item.checklist_id]}
          validTypes={[
            "image/png",
            "image/jpeg",
            "image/gif",
            "application/pdf",
          ]}
          uploadParam={{
            checklist_id: 1,
            ngo_id: 1,
          }}
          onComplete={async (record: any) => {
            for (const element of record) {
              const item = element[element.length - 1];
              const checklistArray = userData.checklistArray;
              if (checklistArray) {
                const filteredUsers = checklistArray.filter(
                  (checklist: any) =>
                    checklist.check_list_id !== item.check_list_id
                );
                setUserData({
                  ...userData,
                  checklistArray: [...filteredUsers, item],
                });
              } else {
                setUserData({ ...userData, checklistArray: [item] });
              }
            }
          }}
          onStart={async (file: File) => {
            setUserData({ ...userData, [item.checklist_id]: file });
          }}
        />
      ))}
    </div>
  );
}
