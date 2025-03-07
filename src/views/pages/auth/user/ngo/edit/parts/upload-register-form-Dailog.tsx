import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import CheckListChooser from "@/components/custom-ui/chooser/CheckListChooser";
import CustomDatePicker from "@/components/custom-ui/DatePicker/CustomDatePicker";
import { useModelOnRequestHide } from "@/components/custom-ui/model/hook/useModelOnRequestHide";
import ButtonSpinner from "@/components/custom-ui/spinner/ButtonSpinner";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { CheckList } from "@/database/tables";
import axiosClient from "@/lib/axois-client";
import { TaskTypeEnum } from "@/lib/constants";
import { getConfiguration } from "@/lib/utils";
import { setServerError, validate } from "@/validation/validation";
import { BookOpenText } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DateObject } from "react-multi-date-picker";
import { useParams } from "react-router";

interface UploadRegisterFormDailogprops {
  onComplete: () => void;
}
export default function UploadRegisterFormDailog(
  props: UploadRegisterFormDailogprops
) {
  const { onComplete } = props;
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<CheckList[] | undefined>(undefined);
  let { id } = useParams();

  const { modelOnRequestHide } = useModelOnRequestHide();
  const { t } = useTranslation();
  const [error, setError] = useState(new Map<string, string>());
  const [userData, setUserData] = useState<{
    start_date: DateObject;
    end_date: DateObject;
    checklistMap: Map<string, any>;
  }>({
    start_date: new DateObject(),
    end_date: new DateObject(),
    checklistMap: new Map(),
  });

  const loadInformation = async () => {
    try {
      const response = await axiosClient.get(
        "ngo/missing/register/signed/form"
      );
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
  const store = async () => {
    try {
      if (loading) return;
      setLoading(true);
      // 1. Validate form
      const passed = await validate(
        [
          {
            name: "english",
            rules: ["required"],
          },
          {
            name: "farsi",
            rules: ["required"],
          },
          {
            name: "pashto",
            rules: ["required"],
          },
        ],
        userData,
        setError
      );
      if (!passed) return;
      // 2. Store
      let formData = new FormData();
      const response = await axiosClient.post("job/store", formData);
      if (response.status === 200) {
        toast({
          toastType: "SUCCESS",
          description: response.data.message,
        });
        onComplete();
        modelOnRequestHide();
      }
    } catch (error: any) {
      setServerError(error.response.data.errors, setError);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full my-8 self-center [backdrop-filter:blur(20px)] bg-card">
      <CardHeader className="relative text-start">
        <CardTitle className="rtl:text-4xl-rtl ltr:text-3xl-ltr text-tertiary">
          {t("up_register_fo")}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-4">
        {list ? (
          <>
            {list.map((checklist: CheckList, index: number) => {
              return (
                <CheckListChooser
                  hasEdit={true}
                  number={`${index + 1}`}
                  key={checklist.id}
                  url={`${
                    import.meta.env.VITE_API_BASE_URL
                  }/api/v1/checklist/file/upload`}
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
                    task_type: TaskTypeEnum.ngo_registeration,
                  }}
                  onComplete={async (record: any) => {
                    // 1. Update userData
                    for (const element of record) {
                      const item = element[element.length - 1];
                      const checklistMap: Map<string, any> =
                        userData.checklistMap;
                      checklistMap.set(checklist.id, item);
                      setUserData({
                        ...userData,
                        checklistMap: checklistMap,
                      });
                    }
                  }}
                  onStart={async (file: File) => {
                    const checklistMap: Map<string, any> =
                      userData.checklistMap;
                    checklistMap.set(checklist.id, file);
                    setUserData({
                      ...userData,
                      checklistMap: checklistMap,
                    });
                  }}
                />
              );
            })}
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
              parentClassName="md:w-1/2 xl:w-1/3"
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
              parentClassName="md:w-1/2 xl:w-1/3"
              className="py-3 w-full"
              errorMessage={error.get("end_date")}
            />
            <div className="rtl:text-xl-rtl ltr:text-lg-ltr border rounded-lg py-1 px-2 w-fit bg-primary/5 items-center text-start flex gap-x-2">
              <BookOpenText className="size-[20px] text-primary/90" />
              {t("approval_des")}
            </div>
          </>
        ) : (
          <NastranSpinner />
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          className="rtl:text-xl-rtl ltr:text-lg-ltr"
          variant="outline"
          onClick={modelOnRequestHide}
        >
          {t("cancel")}
        </Button>
        <PrimaryButton
          disabled={loading}
          onClick={store}
          className={`${loading && "opacity-90"}`}
          type="submit"
        >
          <ButtonSpinner loading={loading}>{t("save")}</ButtonSpinner>
        </PrimaryButton>
      </CardFooter>
    </Card>
  );
}
