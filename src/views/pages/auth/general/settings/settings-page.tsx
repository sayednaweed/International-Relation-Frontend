import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Languages, MapPinHouse } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageTab from "./tabs/language/language-tab";
import JobTab from "./tabs/job/job-tab";
import DestinationTab from "./tabs/destination/destination-tab";
import { useUserAuthState } from "@/context/AuthContextProvider";
import { UserPermission } from "@/database/tables";
import { PermissionEnum } from "@/lib/constants";
import ChecklistTab from "./tabs/checklist/checklist-tab";

export default function SettingsPage() {
  const { user } = useUserAuthState();
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();
  const per: UserPermission = user?.permissions.get(
    PermissionEnum.settings.name
  ) as UserPermission;

  const tableList = Array.from(per.sub).map(
    ([key, _subPermission], index: number) => {
      return key == PermissionEnum.settings.sub.setting_language ? (
        <TabsTrigger
          key={index}
          value={key.toString()}
          className="gap-x-1 bg-card shadow rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
        >
          <Languages className="size-[16px] ltr:mr-1 rtl:ml-1" />
          {t("language")}
        </TabsTrigger>
      ) : key == PermissionEnum.settings.sub.setting_job ? (
        <TabsTrigger
          key={index}
          value={key.toString()}
          className="gap-x-1 bg-card shadow  rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
        >
          <Briefcase className="size-[16px] ltr:mr-1 rtl:ml-1" />
          {t("job")}
        </TabsTrigger>
      ) : key == PermissionEnum.settings.sub.setting_destination ? (
        <TabsTrigger
          key={index}
          value={key.toString()}
          className="gap-x-1 bg-card shadow rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
        >
          <MapPinHouse className="size-[16px] ltr:mr-1 rtl:ml-1" />
          {t("reference")}
        </TabsTrigger>
      ) : (
        key == PermissionEnum.settings.sub.setting_checklist && (
          <TabsTrigger
            key={index}
            value={key.toString()}
            className="gap-x-1 bg-card shadow rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
          >
            <MapPinHouse className="size-[16px] ltr:mr-1 rtl:ml-1" />
            {t("checklist")}
          </TabsTrigger>
        )
      );
    }
  );
  return (
    <Tabs
      dir={direction}
      defaultValue={per.sub.values().next().value?.id.toString()}
      className="flex flex-col items-center"
    >
      <TabsList className="px-0 pb-1 h-fit mt-2 flex-wrap overflow-x-auto overflow-y-hidden justify-center gap-y-1 gap-x-1">
        {tableList}
      </TabsList>
      <TabsContent
        value={PermissionEnum.settings.sub.setting_language.toString()}
        className="overflow-y-auto self-start w-1/2"
      >
        <LanguageTab />
      </TabsContent>
      <TabsContent
        value={PermissionEnum.settings.sub.setting_job.toString()}
        className="w-full px-4 pt-8"
      >
        <JobTab permissions={per} />
      </TabsContent>
      <TabsContent
        value={PermissionEnum.settings.sub.setting_destination.toString()}
        className="w-full px-4 pt-8"
      >
        <DestinationTab permissions={per} />
      </TabsContent>
      <TabsContent
        value={PermissionEnum.settings.sub.setting_checklist.toString()}
        className="w-full px-4 pt-8"
      >
        <ChecklistTab permissions={per} />
      </TabsContent>
    </Tabs>
  );
}
