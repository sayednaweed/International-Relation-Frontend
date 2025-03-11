import CloseButton from "@/components/custom-ui/button/CloseButton";
import IconButton from "@/components/custom-ui/button/IconButton";
import Downloader from "@/components/custom-ui/chooser/Downloader";
import FakeCombobox from "@/components/custom-ui/combobox/FakeCombobox";
import CustomTextarea from "@/components/custom-ui/input/CustomTextarea";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { useGlobalState } from "@/context/GlobalStateContext";
import axiosClient from "@/lib/axois-client";
import { FileType } from "@/lib/types";
import { toLocaleDate } from "@/lib/utils";
import { setServerError } from "@/validation/validation";
import { CalendarDays, Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DateObject } from "react-multi-date-picker";

interface ViewApprovalDailogprops {
  onComplete: () => void;
  onClose: () => void;
  approval_id: string;
}
export default function ViewApprovalDailog(props: ViewApprovalDailogprops) {
  const { onComplete, onClose } = props;
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<FileType[] | undefined>(undefined);
  const [state] = useGlobalState();
  const { t } = useTranslation();
  const [error, setError] = useState(new Map<string, string>());
  const [userData, setUserData] = useState<{
    start_date: DateObject;
    end_date: DateObject;
    files: FileType[];
  }>({
    start_date: new DateObject(),
    end_date: new DateObject(),
    files: [],
  });

  const loadInformation = async () => {
    try {
      const response = await axiosClient.get(
        "ngo/register/signed/form/checklist"
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
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadInformation();
  }, []);
  const action = async (approved: boolean) => {
    try {
      if (loading) return;
      const response = await axiosClient.post(
        "ngo/store/signed/register/form",
        {
          approved: approved,
        }
      );
      if (response.status === 200) {
        toast({
          toastType: "SUCCESS",
          description: response.data.message,
        });
        onComplete();
        onClose();
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        description: error.response.data.message,
      });
      setServerError(error.response.data.errors, setError);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed left-0 top-0 flex justify-center items-center bg-black/30 z-50 h-screen w-screen">
      <Card className="w-[90%] custom-track-scrollbar relative h-[90%] pb-4 self-center overflow-y-auto [backdrop-filter:blur(20px)] bg-card">
        <CardHeader className="text-start sticky top-0 bg-card border-b z-10">
          <CardTitle className="rtl:text-4xl-rtl mb-4 ltr:text-3xl-ltr text-tertiary">
            {t("approval")}
          </CardTitle>
          <CloseButton
            className=" "
            parentClassName="absolute rtl:left-2 ltr:right-2 top-0"
            dismissModel={onClose}
          />
          <div className="flex gap-x-3">
            <IconButton
              className="hover:bg-green-400/30 transition-all border-green-400/40 text-green-400"
              onClick={() => action(true)}
            >
              <Check className="size-[13px] pointer-events-none" />
              <h1 className="rtl:text-lg-rtl ltr:text-md-ltr">
                {t("approve")}
              </h1>
            </IconButton>
            <IconButton
              className="hover:bg-red-400/30 transition-all border-red-400/40 text-red-400"
              onClick={() => action(false)}
            >
              <X className="size-[13px] pointer-events-none" />
              <h1 className="rtl:text-lg-rtl ltr:text-md-ltr">{t("reject")}</h1>
            </IconButton>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-4 pt-4">
          {loading ? (
            <NastranSpinner />
          ) : (
            <>
              <FakeCombobox
                className="w-full md:w-1/2 xl:w-1/3"
                title={t("requester")}
                selected={"Ahmadd jan"}
              />
              <FakeCombobox
                icon={
                  <CalendarDays className="size-[16px] text-tertiary absolute top-1/2 transform -translate-y-1/2 ltr:right-4 rtl:left-4" />
                }
                className="w-full md:w-1/2 xl:w-1/3"
                title={t("request_date")}
                selected={toLocaleDate(new Date(), state)}
              />
              <FakeCombobox
                icon={
                  <CalendarDays className="size-[16px] text-tertiary absolute top-1/2 transform -translate-y-1/2 ltr:right-4 rtl:left-4" />
                }
                className="w-full md:w-1/2 xl:w-1/3"
                title={t("start_date")}
                selected={toLocaleDate(new Date(), state)}
              />
              <FakeCombobox
                icon={
                  <CalendarDays className="size-[16px] text-tertiary absolute top-1/2 transform -translate-y-1/2 ltr:right-4 rtl:left-4" />
                }
                className="w-full md:w-1/2 xl:w-1/3"
                title={t("end_date")}
                selected={toLocaleDate(new Date(), state)}
              />
              <CustomTextarea
                disabled={true}
                lable={t("request_comment")}
                rows={4}
                placeholder={`${t("detail")}...`}
              />
              <div className="grid grid-cols-[auto_1fr] mt-3 p-2 border items-center rounded-lg">
                <h1 className="text-tertiary rtl:text-lg-rtl ltr:text-lg-ltr-ltr ltr:border-r rtl:border-l pe-2 me-2 border-primary/10 font-bold">
                  {t("documents")}
                </h1>
                <div className="flex gap-4">
                  {list?.map((file: FileType, index: number) => {
                    return (
                      <Downloader
                        key={index}
                        cancelText={t("cancel")}
                        filetoDownload={file}
                        downloadText={t("download")}
                        errorText={t("error")}
                      />
                    );
                  })}
                </div>
              </div>
              <FakeCombobox
                className="w-full md:w-1/2 xl:w-1/3"
                title={t("responder")}
                selected={"Mahmood"}
              />
              <FakeCombobox
                icon={
                  <CalendarDays className="size-[16px] text-tertiary absolute top-1/2 transform -translate-y-1/2 ltr:right-4 rtl:left-4" />
                }
                className="w-full md:w-1/2 xl:w-1/3"
                title={t("respond_date")}
                selected={toLocaleDate(new Date(), state)}
              />
              <CustomTextarea
                lable={t("responder_comment")}
                rows={4}
                placeholder={`${t("detail")}...`}
                onChange={(e: any) => {}}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
