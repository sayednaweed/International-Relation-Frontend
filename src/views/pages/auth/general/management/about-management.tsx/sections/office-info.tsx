import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { t } from "i18next";

import Input from "@/components/custom-ui/input/CustomInput";
import { useState } from "react";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import SingleTab from "@/components/custom-ui/input/mult-tab/parts/SingleTab";
import MultiTabTextarea from "@/components/custom-ui/input/mult-tab/MultiTabTextarea";

function OfficeInfo() {
  const [error, setError] = useState(new Map<string, string>());
  const [info, setInfo] = useState({});
  return (
    <div>
      <Card className="w-full self-center [backdrop-filter:blur(20px)] bg-white/70 dark:!bg-black/40">
        <div className="flex flex-col justify-center items-center mt-4">
          {" "}
          <CardHeader className="relative text-start">
            <CardTitle className="rtl:text-4xl-rtl ltr:text-4xl-ltr text-tertiary text-start">
              {t("office_info")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MultiTabTextarea
              optionalKey={"optional_lang"}
              onTabChanged={(key: string, tabName: string) => {
                setInfo({
                  ...info,
                  [key]: tabName,
                  //optional_lang: tabName,
                });
              }}
              onChanged={(value: string, name: string) => {
                setInfo({
                  ...info,
                  [name]: value,
                });
              }}
              name=""
              highlightColor="bg-tertiary"
              userData={info}
              errorData={error}
              placeholder={t("detail")}
              rows={1}
              className="rtl:text-xl-rtl rounded-none border-t border-x-0"
              tabsClassName="gap-x-5 px-3"
            >
              <SingleTab>english</SingleTab>
              <SingleTab>farsi</SingleTab>
              <SingleTab>pashto</SingleTab>
            </MultiTabTextarea>
            <Input
              size_="lg"
              lable={t("contact")}
              type="text"
              className="w-[400px]"
            ></Input>
            <Input
              size_="lg"
              lable={t("email")}
              type="text"
              className="w-[400px]"
            ></Input>
          </CardContent>{" "}
          <div className="ltr:ml-6 rtl:mr-6 mb-6">
            <PrimaryButton>{t("save")}</PrimaryButton>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default OfficeInfo;
