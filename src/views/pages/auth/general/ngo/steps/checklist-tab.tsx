import CheckListChooser from "@/components/custom-ui/chooser/CheckListChooser";
import { StepperContext } from "@/components/custom-ui/stepper/StepperContext";
import { toast } from "@/components/ui/use-toast";
import { CheckList } from "@/database/tables";
import axiosClient from "@/lib/axois-client";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ChunkUpload from "../ChunkUpload";

export default function CheckListTab() {
  const { t } = useTranslation();
  const { userData, setUserData, error } = useContext(StepperContext);
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
          defaultFile={userData[""]}
          validTypes={[
            "image/png",
            "image/jpeg",
            "image/gif",
            "application/pdf",
          ]}
          onchange={function (file: File | undefined): void {}}
        />
      ))}
      <ChunkUpload />
    </div>
  );
}
