import CloseButton from "@/components/custom-ui/button/CloseButton";
import { useModelOnRequestHide } from "@/components/custom-ui/model/hook/useModelOnRequestHide";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import { CustomProjectSelect } from "./tabs/custom-project-select";
import { NormalProjectSelect } from "./tabs/normal-project-select";
import { useParams } from "react-router";
import { isDateString } from "@/lib/utils";
import EditScheduleTab from "./tabs/edit-schedule-tab";

export default function AddOrEditSchedule() {
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();
  let { data } = useParams();
  console.log(isDateString(data));

  const { modelOnRequestHide } = useModelOnRequestHide();
  const [userData, setUserData] = useState<any>([]);
  const [error, setError] = useState<Map<string, string>>(new Map());
  const tabStyle =
    "data-[state=active]:border-tertiary data-[state=active]:border-b-[2px] h-full rounded-none";

  return (
    <Card className="w-full my-16 self-center [backdrop-filter:blur(20px)] bg-card">
      <CardHeader className="text-start sticky top-0 rounded-t-lg border-b bg-card pb-2 z-10">
        <CardTitle className="rtl:text-4xl-rtl mb-4 ltr:text-3xl-ltr text-tertiary">
          {t("schedule")}
        </CardTitle>
        <CloseButton
          className=" "
          parentClassName="absolute rtl:left-0 ltr:right-2 top-0"
          dismissModel={modelOnRequestHide}
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-y-4 p-0 pb-4 text-start">
        <Tabs
          dir={direction}
          className="p-0 h-full space-y-0"
          defaultValue={"normal"}
        >
          <TabsList className="overflow-x-auto overflow-y-hidden bg-card w-full justify-start p-0 m-0 rounded-none">
            <TabsTrigger value={"normal"} className={tabStyle}>
              {t("normal")}
            </TabsTrigger>
            <TabsTrigger value={"customize"} className={tabStyle}>
              {t("customize")}
            </TabsTrigger>
            <TabsTrigger value={"detail"} className={tabStyle}>
              {t("detail")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value={"normal"} className="p-4">
            <NormalProjectSelect
              userData={userData}
              setUserData={setUserData}
              error={error}
            />
          </TabsContent>
          <TabsContent value={"customize"} className="p-4">
            <CustomProjectSelect
              userData={userData}
              setUserData={setUserData}
              error={error}
            />
          </TabsContent>
          <TabsContent value={"detail"} className="p-4">
            <EditScheduleTab
            // userData={userData}
            // setUserData={setUserData}
            // error={error}
            />
          </TabsContent>
        </Tabs>

        <PrimaryButton className="rtl:text-lg-rtl font-semibold ltr:text-md-ltr mx-auto">
          {t("save")}
        </PrimaryButton>
      </CardContent>
    </Card>
  );
}
