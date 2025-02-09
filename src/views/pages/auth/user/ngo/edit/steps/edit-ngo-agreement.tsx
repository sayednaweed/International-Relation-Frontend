import { ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import axiosClient from "@/lib/axois-client";
import { useUserAuthState } from "@/context/AuthContextProvider";
import {
  Agreement,
  AgreementDocument,
  UserPermission,
} from "@/database/tables";
import { SectionEnum } from "@/lib/constants";
import { useParams } from "react-router";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import CheckListChooser from "@/components/custom-ui/chooser/CheckListChooser";
import { toLocaleDate } from "@/lib/utils";
import { useGlobalState } from "@/context/GlobalStateContext";
import { FileType } from "@/lib/types";

export default function EditNgoAgreement() {
  const { user } = useUserAuthState();
  const { t } = useTranslation();
  let { id } = useParams();
  const [state] = useGlobalState();
  const [loading, setLoading] = useState(true);
  const [_failed, setFailed] = useState(false);
  const [agreements, setAgreements] = useState<Agreement[]>([]);

  const per: UserPermission | undefined = user?.permissions.get(
    SectionEnum.ngo
  );
  const _hasEdit = per ? per?.edit : false;

  const loadAgreement = async () => {
    try {
      const response = await axiosClient.get(`ngo/agreement/${id}`);
      if (response.status == 200) {
        const agreement = response.data.agreement;
        setAgreements(agreement);
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

  return (
    <Card className=" h-full">
      <CardHeader className="space-y-0">
        <CardTitle className="rtl:text-3xl-rtl ltr:text-2xl-ltr">
          {t("account_information")}
        </CardTitle>
        <CardDescription className="rtl:text-xl-rtl ltr:text-lg-ltr">
          {t("update_user_acc_info")}
        </CardDescription>
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
                  index={index}
                  state={state}
                  agreement={agreement}
                />
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export interface AgreementProps {
  agreement: Agreement;
  index: number;
  state: any;
  ngo_id: string | undefined;
}

const AgreementDocumentComponent = (props: AgreementProps) => {
  const { agreement, index, state, ngo_id } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [_failed, setFailed] = useState(false);

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
        ) : documents.length == 0 ? (
          <h1 className=" rtl:text-xl-rtl bg-primary/20 text-center">
            {t("no_content")}
          </h1>
        ) : (
          documents.map((document: AgreementDocument, index: number) => (
            <CheckListChooser
              number={`${index + 1}`}
              key={index}
              url={`${
                import.meta.env.VITE_API_BASE_URL
              }/api/v1/ngo/file/upload`}
              headers={{
                "X-API-KEY": import.meta.env.VITE_BACK_END_API_TOKEN,
                "X-SERVER-ADDR": import.meta.env.VITE_BACK_END_API_IP,
                Authorization:
                  "Bearer " +
                  localStorage.getItem(import.meta.env.VITE_TOKEN_STORAGE_KEY),
              }}
              maxSize={1024}
              accept={document.acceptable_mimes}
              name={document.name}
              defaultFile={document as FileType}
              validTypes={["image/png", "image/jpeg", "image/gif"]}
              uploadParam={{
                document_id: document.document_id,
              }}
              onComplete={async (record: any) => {
                for (const element of record) {
                  const item = element[element.length - 1];
                  // setDocuments((prevDocs) => {
                  //   const updatedDocs = new Map(prevDocs); // Create a new Map to preserve immutability
                  //   updatedDocs.set(documents.document_id, item); // Add the new document to the Map
                  //   return updatedDocs; // Return the updated Map
                  // });
                }
              }}
              onStart={async (file: File) => {
                // setAgreementDocuments((prevDocs) => {
                //   const updatedDocs = new Map(prevDocs); // Create a new Map to preserve immutability
                //   updatedDocs.set(
                //     documents.document_id,
                //     file as any
                //   ); // Add the new document to the Map
                //   return updatedDocs; // Return the updated Map
                // });
              }}
            />
          ))
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};
