import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CustomProjectSelect } from "./tabs/custom-project-select";
import { NormalProjectSelect } from "./tabs/normal-project-select";
import { useNavigate, useParams } from "react-router";
import EditScheduleTab from "./tabs/edit-schedule-tab";
import {
  Breadcrumb,
  BreadcrumbHome,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/custom-ui/Breadcrumb/Breadcrumb";
import { DateObject } from "react-multi-date-picker";
import { useGlobalState } from "@/context/GlobalStateContext";
import axiosClient from "@/lib/axois-client";
import { useDatasource } from "@/hooks/use-datasource";
import { Project } from "@/database/tables";

export type Schedule = {
  presentation_count: number;
  projects: Project[];
  validationChecklist: any;
  special_projects: {
    project: { id: string; name: string };
    attachment: {
      pending_id: number;
      name: string;
      size: number;
      check_list_id: string;
      extension: string;
      path: string;
    };
  }[];
};
export default function AddOrEditSchedule() {
  const { t, i18n } = useTranslation();
  const [state] = useGlobalState();
  const [tab, setTab] = useState<string>("count");
  const direction = i18n.dir();
  const { data, "*": restPath } = useParams();
  const fullDate = restPath ? `${data}/${restPath}` : data;

  const navigate = useNavigate();
  const handleGoHome = () => navigate("/dashboard", { replace: true });
  const handleGoBack = () => navigate("/schedules", { replace: true });

  const loadList = async () => {
    const date = new DateObject({
      date: fullDate,
      calendar: state.systemLanguage.calendar,
      locale: state.systemLanguage.local,
      format: "YYYY/MM/DD", // important for parsing correctly
    });
    if (date.isValid) {
      return {
        presentation_count: 10,
        projects: [],
        special_projects: [],
      };
    } else {
      const response = await axiosClient.get(`projects/${data}`);
      return response.data;
    }
  };
  const { schedule, setSchedule, isLoading, refetch } = useDatasource<
    Schedule | any,
    "schedule"
  >(
    {
      queryFn: loadList,
      queryKey: "schedule",
    },
    [],
    []
  );

  const tabStyle = useMemo(
    () =>
      "data-[state=active]:border-tertiary border-b-[2px] border-transparent data-[state=active]:border-b-[2px] h-full rounded-none",
    []
  );
  return (
    <div className="px-2 pt-2 pb-12 flex flex-col gap-y-[2px] relative select-none rtl:text-2xl-rtl ltr:text-xl-ltr">
      <Breadcrumb>
        <BreadcrumbHome onClick={handleGoHome} />
        <BreadcrumbSeparator />
        <BreadcrumbItem onClick={handleGoBack}>{t("schedules")}</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>{fullDate}</BreadcrumbItem>
      </Breadcrumb>
      <Card className="w-full mt-2 self-center [backdrop-filter:blur(20px)] bg-card">
        <CardHeader className="text-start sticky top-0 rounded-t-lg border-b bg-card pb-2 z-10">
          <CardTitle className="rtl:text-4xl-rtl mb-4 ltr:text-3xl-ltr text-tertiary">
            {t("schedule")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-4 p-0 pb-4 text-start">
          <Tabs
            onValueChange={setTab}
            dir={direction}
            className="p-0 h-full space-y-0"
            value={tab}
          >
            <TabsList className="overflow-x-auto border-b overflow-y-hidden bg-card w-full justify-start p-0 m-0 rounded-none">
              <TabsTrigger value={"count"} className={tabStyle}>
                <div className="rounded-full data-[state=active]:bg-tertiary bg-primary ltr:mr-2 rtl:ml-2 text-primary-foreground size-[21px] flex items-center justify-center shadow-md ltr:text-[12px]">
                  <span
                    className={
                      tab == "count"
                        ? "text-tertiary"
                        : "text-primary-foreground"
                    }
                  >
                    1
                  </span>
                </div>
                {t("count")}
              </TabsTrigger>
              <TabsTrigger value={"select"} className={tabStyle}>
                <div className="rounded-full bg-primary ltr:mr-2 rtl:ml-2 text-primary-foreground size-[21px] flex items-center justify-center shadow-md ltr:text-[12px]">
                  <span
                    className={
                      tab == "select"
                        ? "text-tertiary"
                        : "text-primary-foreground"
                    }
                  >
                    2
                  </span>
                </div>
                {t("select")}
              </TabsTrigger>
              <TabsTrigger value={"detail"} className={tabStyle}>
                <div className="rounded-full bg-primary ltr:mr-2 rtl:ml-2 text-primary-foreground size-[21px] flex items-center justify-center shadow-md ltr:text-[12px]">
                  <span
                    className={
                      tab == "detail"
                        ? "text-tertiary"
                        : "text-primary-foreground"
                    }
                  >
                    3
                  </span>
                </div>
                {t("detail")}
              </TabsTrigger>
            </TabsList>
            <TabsContent value={"count"} className="p-4">
              <NormalProjectSelect
                schedule={schedule}
                setSchedule={setSchedule}
              />
            </TabsContent>
            <TabsContent value={"select"} className="p-4">
              <CustomProjectSelect
                schedule={schedule}
                setSchedule={setSchedule}
              />
            </TabsContent>
            <TabsContent value={"detail"} className="p-4">
              <EditScheduleTab schedule={schedule} setSchedule={setSchedule} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
