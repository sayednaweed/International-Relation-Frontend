import AnimHomeIcon from "@/components/custom-ui/icons/AnimHomeIcon";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import ApprovalTab from "./tabs/approval-tab";

export default function ApprovalPage() {
  const { t } = useTranslation();
  return (
    <div className="px-2 pt-2 flex flex-col gap-y-[2px] relative select-none rtl:text-2xl-rtl ltr:text-xl-ltr">
      <Breadcrumb className="bg-card w-fit py-1 ltr:ps-3 ltr:pe-8 rtl:pe-3 rtl:ps-8 rounded-md border">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/dashboard">
              <AnimHomeIcon />
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="rtl:rotate-180" />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-tertiary">
              {t("approval")}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Tabs className="mt-8 border rounded-lg p-2 h-full" defaultValue="user">
        <TabsList className="overflow-x-auto overflow-y-hidden w-full justify-start">
          <TabsTrigger value="user" className="rtl:flex-row-reverse">
            {t("user")}
          </TabsTrigger>
          <TabsTrigger value="ngo" className="rtl:flex-row-reverse">
            {t("ngo")}
          </TabsTrigger>
          <TabsTrigger value="donor" className="rtl:flex-row-reverse">
            {t("donor")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="user">
          <ApprovalTab title="user" />
        </TabsContent>
        <TabsContent value="ngo">
          <ApprovalTab title="ngo" />
        </TabsContent>
        <TabsContent value="donor">
          <ApprovalTab title="donor" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
