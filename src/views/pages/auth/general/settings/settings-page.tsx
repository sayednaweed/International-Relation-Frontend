import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Languages, MapPinHouse } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageTab from "./tabs/language/language-tab";
import JobTab from "./tabs/job/job-tab";
import DestinationTab from "./tabs/destination/destination-tab";
import { useUserAuthState } from "@/context/AuthContextProvider";
import { UserPermission } from "@/database/tables";
import { PermissionEnum } from "@/lib/constants";

export default function SettingsPage() {
  const { user } = useUserAuthState();
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();
  const per: UserPermission = user?.permissions.get(
    PermissionEnum.settings.name
  ) as UserPermission;
  const hasView = per.sub.get(
    PermissionEnum.settings.sub.setting_destination
  )?.view;
  return (
    <Tabs
      dir={direction}
      defaultValue="lang"
      className="flex flex-col items-center"
    >
      <TabsList className="px-0 pb-1 h-fit mt-2 flex-wrap overflow-x-auto overflow-y-hidden justify-center gap-y-1 gap-x-1">
        <TabsTrigger
          value="lang"
          className="gap-x-1 bg-card shadow rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
        >
          <Languages className="size-[16px] ltr:mr-1 rtl:ml-1" />
          {t("language")}
        </TabsTrigger>
        <TabsTrigger
          value="job"
          className="gap-x-1 bg-card shadow  rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
        >
          <Briefcase className="size-[16px] ltr:mr-1 rtl:ml-1" />
          {t("job")}
        </TabsTrigger>
        <TabsTrigger
          value="destinationtype"
          className="gap-x-1 bg-card shadow rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
        >
          <MapPinHouse className="size-[16px] ltr:mr-1 rtl:ml-1" />
          {t("reference")}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="lang" className="overflow-y-auto self-start w-1/2">
        <LanguageTab />
      </TabsContent>
      <TabsContent value="job" className="w-full px-4 pt-8">
        <JobTab />
      </TabsContent>
      <TabsContent value="destinationtype" className="w-full px-4 pt-8">
        <DestinationTab />
      </TabsContent>
    </Tabs>
  );
}
