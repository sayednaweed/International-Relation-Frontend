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
          key={item.id}
          maxSize={1024}
          accept="image/png, image/jpeg, image/gif, application/pdf"
          name={item.name}
          // defaultFile={{
          //   path: "private/user-profile/2dcab70c-36dd-4add-b53e-db92daf3c889.jpg",
          //   size: "20mb",
          //   pending_id: "1",
          //   name: "profile",
          //   extension: "jpg",
          // }}
          defaultFile={userData[item.checklist_id]}
          validTypes={[
            "image/png",
            "image/jpeg",
            "image/gif",
            "application/pdf",
          ]}
          onComplete={async (record: any) => {
            for (const element of record) {
              const item = element[element.length - 1] as File;
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
