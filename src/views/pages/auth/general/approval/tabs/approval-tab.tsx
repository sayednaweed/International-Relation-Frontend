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
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();

  const tabStyle =
    "data-[state=active]:border-tertiary data-[state=active]:border-b-[2px] h-full rounded-none";

  return (
    <Tabs
      dir={direction}
      className="border-t rounded-lg p-0 h-full"
      defaultValue="pending"
    >
      <TabsList className="overflow-x-auto overflow-y-hidden bg-card w-full justify-start p-0 m-0 rounded-none">
        <TabsTrigger value="pending" className={tabStyle}>
          {t("pending")}
        </TabsTrigger>
        <TabsTrigger value="approved" className={tabStyle}>
          {t("approved")}
        </TabsTrigger>

        <TabsTrigger value="rejected" className={tabStyle}>
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
  );
}
