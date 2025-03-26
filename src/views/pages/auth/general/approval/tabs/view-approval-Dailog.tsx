import CloseButton from "@/components/custom-ui/button/CloseButton";
import IconButton from "@/components/custom-ui/button/IconButton";
import StatusButton from "@/components/custom-ui/button/StatusButton";
import CheckListDownloader from "@/components/custom-ui/chooser/CheckListDownloader";
import FakeCombobox from "@/components/custom-ui/combobox/FakeCombobox";
import CustomTextarea from "@/components/custom-ui/input/CustomTextarea";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { useGlobalState } from "@/context/GlobalStateContext";
import { AgreementDocument } from "@/database/tables";
import axiosClient from "@/lib/axois-client";
import { IApproval } from "@/lib/types";
import { toLocaleDate } from "@/lib/utils";
import { CalendarDays, Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface ViewApprovalDailogprops {
  onComplete: (id: string) => void;
  onClose: () => void;
  approval_id: string;
}
export default function ViewApprovalDailog(props: ViewApprovalDailogprops) {
  const { onComplete, onClose, approval_id } = props;
  const [loading, setLoading] = useState(true);
  const [state] = useGlobalState();
  const { t } = useTranslation();
  const [approval, setApproval] = useState<IApproval | undefined>(undefined);

  const loadInformation = async () => {
    try {
      const response = await axiosClient.get(`approval/${approval_id}`);
      if (response.status == 200) {
        setApproval(response.data);
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
      setLoading(true);
      const response = await axiosClient.post("approval/submit", {
        approved: approved,
        approval_id: approval_id,
        respond_comment: approval?.respond_comment,
      });
      if (response.status === 200) {
        toast({
          toastType: "SUCCESS",
          description: response.data.message,
        });
        onComplete(approval_id);
        onClose();
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        description: error.response.data.message,
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full my-16 self-center [backdrop-filter:blur(20px)] bg-card">
      {loading ? (
        <NastranSpinner className="mt-4" />
      ) : (
        <>
          <CardHeader className="text-start sticky top-0 rounded-t-lg border-b bg-card pb-2 z-10">
            <CardTitle className="rtl:text-4xl-rtl mb-4 ltr:text-3xl-ltr text-tertiary">
              {t("approval")}
            </CardTitle>
            <CloseButton
              className=" "
              parentClassName="absolute rtl:left-0 ltr:right-2 top-0"
              dismissModel={onClose}
            />
            {approval?.completed == 0 && (
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
                  <h1 className="rtl:text-lg-rtl ltr:text-md-ltr">
                    {t("reject")}
                  </h1>
                </IconButton>
              </div>
            )}

            <StatusButton
              status_id={approval?.notifier_type_id}
              status={approval?.notifier_type}
              className="ltr:text-[12px] rtl:text-[13px] rtl:py-0 self-end"
            />
          </CardHeader>
          <CardContent className="flex flex-col gap-y-4 pb-12 pt-4 text-start">
            <FakeCombobox
              className="w-full md:w-1/2 xl:w-1/3"
              title={t("requester")}
              selected={approval?.requester_name}
            />
            <FakeCombobox
              icon={
                <CalendarDays className="size-[16px] text-tertiary absolute top-1/2 transform -translate-y-1/2 ltr:right-4 rtl:left-4" />
              }
              className="w-full md:w-1/2 xl:w-1/3"
              title={t("request_date")}
              selected={toLocaleDate(new Date(approval!.request_date), state)}
            />
            <FakeCombobox
              icon={
                <CalendarDays className="size-[16px] text-tertiary absolute top-1/2 transform -translate-y-1/2 ltr:right-4 rtl:left-4" />
              }
              className="w-full md:w-1/2 xl:w-1/3"
              title={t("start_date")}
              selected={toLocaleDate(new Date(approval!.start_date), state)}
            />
            <FakeCombobox
              icon={
                <CalendarDays className="size-[16px] text-tertiary absolute top-1/2 transform -translate-y-1/2 ltr:right-4 rtl:left-4" />
              }
              className="w-full md:w-1/2 xl:w-1/3"
              title={t("end_date")}
              selected={toLocaleDate(new Date(approval!.end_date), state)}
            />
            <CustomTextarea
              disabled={true}
              lable={t("request_comment")}
              rows={4}
              placeholder={`${t("detail")}...`}
              defaultValue={approval?.request_comment}
            />
            {approval?.respond_date && (
              <>
                <FakeCombobox
                  className="w-full md:w-1/2 xl:w-1/3"
                  title={t("responder")}
                  selected={approval?.responder}
                />
                <FakeCombobox
                  icon={
                    <CalendarDays className="size-[16px] text-tertiary absolute top-1/2 transform -translate-y-1/2 ltr:right-4 rtl:left-4" />
                  }
                  className="w-full md:w-1/2 xl:w-1/3"
                  title={t("respond_date")}
                  selected={toLocaleDate(
                    new Date(approval.respond_date),
                    state
                  )}
                />
              </>
            )}

            <CustomTextarea
              lable={t("responder_comment")}
              rows={4}
              disabled={approval?.respond_comment ? true : false}
              maxLength={300}
              placeholder={`${t("detail")}...`}
              defaultValue={approval?.respond_comment}
              onChange={(e: any) => {
                const { value } = e.target;
                const newApproval = approval;
                if (newApproval) newApproval.respond_comment = value;
                setApproval(newApproval);
              }}
            />
            <div className="mt-3 border rounded-lg">
              <h1 className="text-tertiary rtl:text-lg-rtl ltr:text-lg-ltr-ltr p-2 font-bold">
                {t("documents")}
              </h1>
              {approval?.approval_documents?.map(
                (file: AgreementDocument, index: number) => {
                  return (
                    <CheckListDownloader
                      key={index}
                      document={file}
                      index={index}
                      checklist_name={file.checklist_name}
                      className="p-2"
                      apiUrl={"ngo/media"}
                      params={undefined}
                    />
                  );
                }
              )}
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
}
