import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import StepTab from "./step-tab";

export interface DonorApprovalPageProps {
  pendingUrl: string;
  approvedUrl: string;
  rejectedUrl: string;
}

export default function ApprovalTab(props: DonorApprovalPageProps) {
  const { pendingUrl, approvedUrl, rejectedUrl } = props;
  const { t } = useTranslation();

  return (
    <div className="px-4">
      <Tabs className="border rounded-lg p-2" defaultValue="pending">
        <TabsList className="overflow-x-auto overflow-y-hidden w-full gap-x-2 justify-start">
          <TabsTrigger
            value="pending"
            className={`rtl:flex-row-reverse rounded-br-none rounded-bl-none data-[state=active]:border-tertiary data-[state=active]:border-b-[2px] transition-[border] ease-out`}
          >
            {t("pending")}
          </TabsTrigger>
          <TabsTrigger
            value="approved"
            className={`rtl:flex-row-reverse rounded-br-none rounded-bl-none data-[state=active]:border-tertiary data-[state=active]:border-b-[2px] transition-[border] ease-out`}
          >
            {t("approved")}
          </TabsTrigger>

          <TabsTrigger
            value="rejected"
            className={`rtl:flex-row-reverse rounded-br-none rounded-bl-none data-[state=active]:border-tertiary data-[state=active]:border-b-[2px] transition-[border] ease-out`}
          >
            {t("rejected")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="overflow-y-auto">
          <StepTab url={pendingUrl} />
        </TabsContent>
        <TabsContent value="approved">
          <StepTab url={approvedUrl} />
        </TabsContent>
        <TabsContent value="rejected">
          <StepTab url={rejectedUrl} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
