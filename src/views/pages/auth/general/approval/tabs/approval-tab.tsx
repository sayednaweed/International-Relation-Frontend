import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import StepTab from "./step-tab";

export interface DonorApprovalPageProps {
  title: string;
}

export default function ApprovalTab(props: DonorApprovalPageProps) {
  const { title } = props;
  const { t } = useTranslation();

  return (
    <div className="px-4">
      <h1>{title}</h1>
      <Tabs className="border p-2" defaultValue="pending">
        <TabsList className="overflow-x-auto overflow-y-hidden w-full gap-x-2 justify-start">
          <TabsTrigger
            value="pending"
            className={`rtl:flex-row-reverse rounded-br-none rounded-bl-none ${
              1 === 1 && "border-tertiary border-b-[2px]"
            }`}
          >
            {t("pending")}
          </TabsTrigger>
          <TabsTrigger
            value="approved"
            className={`rtl:flex-row-reverse rounded-br-none rounded-bl-none ${
              2 === 2 && "border-tertiary border-b-[2px]"
            }`}
          >
            {t("approved")}
          </TabsTrigger>

          <TabsTrigger
            value="rejected"
            className={`rtl:flex-row-reverse rounded-br-none rounded-bl-none ${
              3 === 3 && "border-tertiary border-b-[2px]"
            }`}
          >
            {t("rejected")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="overflow-y-auto">
          <StepTab title="pending" />
        </TabsContent>
        <TabsContent value="approved">
          <StepTab title="approved" />
        </TabsContent>
        <TabsContent value="rejected">
          <StepTab title="rejected" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
