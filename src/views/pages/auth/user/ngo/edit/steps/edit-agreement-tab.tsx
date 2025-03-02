import { ChevronsUpDown, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import axiosClient from "@/lib/axois-client";
import {
  Agreement,
  AgreementDocument,
  UserPermission,
} from "@/database/tables";
import { useParams } from "react-router";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import CheckListChooser from "@/components/custom-ui/chooser/CheckListChooser";
import { getConfiguration, toLocaleDate } from "@/lib/utils";
import { useGlobalState } from "@/context/GlobalStateContext";
import { FileType } from "@/lib/types";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import ButtonSpinner from "@/components/custom-ui/spinner/ButtonSpinner";
import { PermissionEnum } from "@/lib/constants";

interface EditAgreemenTabProps {
  permissions: UserPermission;
}
export default function EditAgreemenTab(props: EditAgreemenTabProps) {
  const { permissions } = props;
  const { t } = useTranslation();
  const { id } = useParams();
  const [state] = useGlobalState();
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [agreements, setAgreements] = useState<Agreement[]>([]);

  const loadAgreement = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosClient.get(`ngo/agreement/${id}`);
      if (response.status == 200) {
        const agreement = response.data.agreement;
        setAgreements(agreement);
        if (failed) setFailed(false);
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: error.response.data.message,
      });
      console.log(error);
      setFailed(true);
    }
    setLoading(false);
  };
  useEffect(() => {
    loadAgreement();
  }, []);

  const information = permissions.sub.get(PermissionEnum.ngo.sub.ngo_agreement);
  const hasEdit = information?.edit;
  return (
    <Card className="h-fit">
      <CardHeader className="space-y-0">
        <CardTitle className="rtl:text-3xl-rtl ltr:text-2xl-ltr">
          {t("agreement_information")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="flex items-center bg-secondary p-2 rounded-t-md shadow-sm rtl:text-xl-rtl font-bold text-primary/80">
            <div className="max-w-[30px] w-[30px] text-[15px]">#</div>
            <div className="max-w-[140px] w-[140px]">{t("start_date")}</div>
            <div className="max-w-[140px] w-[140px]">{t("end_date")}</div>
          </div>
          <div>
            {loading ? (
              <NastranSpinner className="mt-6" />
            ) : (
              agreements.map((agreement: Agreement, index: number) => (
                <AgreementDocumentComponent
                  ngo_id={id}
                  hasEdit={hasEdit}
                  index={index}
                  key={index}
                  state={state}
                  agreement={agreement}
                />
              ))
            )}
          </div>
        </div>
      </CardContent>

      {failed && (
        <CardFooter>
          <PrimaryButton
            disabled={loading}
            onClick={async () => await loadAgreement()}
            className={`${
              loading && "opacity-90"
            } bg-red-500 hover:bg-red-500/70`}
            type="submit"
          >
            <ButtonSpinner loading={loading}>
              {t("failed_retry")}
              <RefreshCcw className="ltr:ml-2 rtl:mr-2" />
            </ButtonSpinner>
          </PrimaryButton>
        </CardFooter>
      )}
    </Card>
  );
}

export interface AgreementProps {
  agreement: Agreement;
  index: number;
  state: any;
  ngo_id: string | undefined;
  hasEdit?: boolean;
}

const AgreementDocumentComponent = (props: AgreementProps) => {
  const { agreement, index, state, ngo_id, hasEdit } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const [documents, setDocuments] = useState<AgreementDocument[]>([]);
  const loadAgreementDocuments = async (agreement_id: string) => {
    try {
      setLoading(true);
      const response = await axiosClient.get(`ngo/agreement-documents`, {
        params: {
          ngo_id: ngo_id,
          agreement_id: agreement_id,
        },
      });
      if (response.status == 200) {
        const agreement_documents = response.data.agreement_documents;
        setDocuments(agreement_documents);
        if (failed) setFailed(false);
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: error.response.data.message,
      });
      console.log(error);
      setFailed(true);
    }
    setLoading(false);
  };
  return (
    <Collapsible key={agreement.id}>
      <div className="flex items-center p-2">
        <h1 className="max-w-[30px] w-[30px]">{index + 1}</h1>
        <h1 className="text-sm font-semibold max-w-[140px] w-[140px]">
          {toLocaleDate(new Date(agreement.start_date), state)}
        </h1>
        <h1 className="text-sm font-semibold max-w-[140px] w-[140px]">
          {toLocaleDate(new Date(agreement.end_date), state)}
        </h1>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => await loadAgreementDocuments(agreement.id)}
          >
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2">
        {loading ? (
          <NastranSpinner className="size-[20px]" />
        ) : failed ? (
          <h1 className="rtl:text-xl-rtl ltr:text-sm-ltr text-white bg-red-500 text-center">
            {t("error")}
          </h1>
        ) : documents.length == 0 ? (
          <h1 className=" rtl:text-xl-rtl ltr:text-sm-ltr bg-primary/20 text-center">
            {t("no_content")}
          </h1>
        ) : (
          documents.map((document: AgreementDocument, index: number) => (
            <CheckListChooser
              hasEdit={hasEdit}
              number={`${index + 1}`}
              key={index}
              url={`${
                import.meta.env.VITE_API_BASE_URL
              }/api/v1/ngo/checklist/file/upload`}
              headers={{
                "X-API-KEY": import.meta.env.VITE_BACK_END_API_TOKEN,
                "X-SERVER-ADDR": import.meta.env.VITE_BACK_END_API_IP,
                Authorization: "Bearer " + getConfiguration()?.token,
              }}
              maxSize={1024}
              accept={document.acceptable_mimes}
              name={document.checklist_name}
              defaultFile={document as FileType}
              validTypes={["image/png", "image/jpeg", "image/gif"]}
              uploadParam={{
                ngo_id: ngo_id,
                document_id: document.document_id,
                checklist_id: document.checklist_id,
              }}
              onComplete={async (record: any) => {
                for (const element of record) {
                  const checklist = element[element.length - 1];
                  const updated = documents.map((item) =>
                    checklist.checklist_id == item.checklist_id
                      ? checklist
                      : item
                  );
                  setDocuments(updated);
                }
              }}
              onStart={async (_file: any) => {
                // const updated = documents.map((item) =>
                //   item.checklist_id === file.checklist_id ? file : item
                // );
                // setDocuments(updated);
              }}
            />
          ))
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};
