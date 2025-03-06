import CloseButton from "@/components/custom-ui/button/CloseButton";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import ChunkFileUploader from "@/components/custom-ui/chooser/ChunkFileUploader";
import CustomDatePicker from "@/components/custom-ui/DatePicker/CustomDatePicker";
import ButtonSpinner from "@/components/custom-ui/spinner/ButtonSpinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import axiosClient from "@/lib/axois-client";
import { getConfiguration } from "@/lib/utils";
import { ArrowUp, CloudUpload, SendHorizonal } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DateObject } from "react-multi-date-picker";
import { useParams } from "react-router";

export default function UploadRegisterForm() {
  const { t } = useTranslation();
  let { id } = useParams();
  const [userData, setUserData] = useState<any>([]);
  const [isSaving, _setIsSaving] = useState<boolean>(false);
  const [selected, setSelected] = useState<string | undefined>(undefined);
  const [error, _setError] = useState<Map<string, string>>(new Map());
  const [forms, setForms] = useState<string[]>([]);

  const init = async () => {
    try {
      const response = await axiosClient.get(
        `ngo/missing/register/signed/form/${id}`
      );
      if (response.status == 200) {
        setForms(response.data);
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
    init();
  }, []);
  return (
    forms.length != 0 && (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger className="hover:bg-primary/5 border border-input rounded-md gap-x-4 mx-auto grid grid-cols-[1fr_4fr] w-[90%] xxl:w-[50%] md:w-[90%] transition-all text-primary rtl:px-3 rtl:py-1 ltr:p-2">
            <CloudUpload
              className={`size-[18px] pointer-events-none justify-self-end`}
            />
            <h1
              className={`rtl:text-lg-rtl ltr:text-xl-ltr font-semibold justify-self-start`}
            >
              {t("up_register_fo")}
            </h1>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="rtl:font-semibold rtl:text-sm-rtl">
            {forms.map((item: string, index: number) => (
              <DropdownMenuItem
                key={index}
                onClick={() => {
                  setSelected(item);
                }}
                className="justify-between"
              >
                {t(item)} <ArrowUp className="size-[14px]" />
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {selected && (
          <div className="absolute top-0 left-0 w-screen h-screen bg-primary/90 p-2 md:p-12 z-[100] flex justify-center items-center">
            <div className="bg-card rounded-lg p-6 relative space-y-10 w-full md:w-[80%] lg:w-[60%] xl:w-1/2">
              <CloseButton
                dismissModel={() => setSelected(undefined)}
                parentClassName="absolute right-3 top-3"
              />
              <ChunkFileUploader
                className="border-2 border-tertiary mx-auto w-full [&>label]:mx-auto md:px-32 py-4 rounded-lg border-dashed"
                name={""}
                accept=".jpeg,.jpg,.png"
                inputFieldName="file"
                maxSize={0}
                validTypes={[]}
                onComplete={async (record: any) => {
                  for (const element of record) {
                    const success = element[element.length - 1];
                    const update = forms.filter((item) => item != selected);
                    setForms(update);
                    toast({
                      toastType: "ERROR",
                      title: t("error"),
                      description: success?.message,
                    });
                  }
                }}
                onStart={async (_file: File) => {}}
                url={`${
                  import.meta.env.VITE_API_BASE_URL
                }/api/v1/ngo/register/signed/form/upload`}
                headers={{
                  "X-API-KEY": import.meta.env.VITE_BACK_END_API_TOKEN,
                  "X-SERVER-ADDR": import.meta.env.VITE_BACK_END_API_IP,
                  Authorization: "Bearer " + getConfiguration()?.token,
                }}
                uploadParam={{
                  ngo_id: id,
                  type: selected,
                }}
              />
              {forms.length == 1 && (
                <>
                  <CustomDatePicker
                    placeholder={t("select_a_date")}
                    lable={t("start_date")}
                    requiredHint={`* ${t("required")}`}
                    required={true}
                    value={userData.start_date}
                    dateOnComplete={(date: DateObject) => {
                      setUserData({ ...userData, start_date: date });
                    }}
                    className="py-3 w-full mt-16"
                    errorMessage={error.get("start_date")}
                  />
                  <CustomDatePicker
                    placeholder={t("select_a_date")}
                    lable={t("end_date")}
                    requiredHint={`* ${t("required")}`}
                    required={true}
                    value={userData.end_date}
                    dateOnComplete={(date: DateObject) => {
                      setUserData({ ...userData, end_date: date });
                    }}
                    className="py-3 w-full"
                    errorMessage={error.get("end_date")}
                  />
                  <PrimaryButton
                    type="submit"
                    className={`shadow-lg mt-8 px-3 uppercase`}
                  >
                    <ButtonSpinner loading={isSaving}>
                      {t("submit")}
                    </ButtonSpinner>
                    <SendHorizonal />
                  </PrimaryButton>
                </>
              )}
            </div>
          </div>
        )}
      </>
    )
  );
}
