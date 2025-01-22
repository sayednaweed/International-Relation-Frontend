import MultiTabTextarea from "@/components/custom-ui/input/mult-tab/MultiTabTextarea";
import SingleTab from "@/components/custom-ui/input/mult-tab/parts/SingleTab";
import { Card, CardContent } from "@/components/ui/card";
import { t } from "i18next";

import Input from "@/components/custom-ui/input/CustomInput";
import { useState } from "react";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";

function DirectorSection() {
  const [error, setError] = useState(new Map<string, string>());
  const [direct, setDirect] = useState([]);
  return (
    <div>
      <Card className="w-full self-center [backdrop-filter:blur(20px)] bg-white/70 dark:!bg-black/40 ">
        <CardContent>
          <div className="flex flex-row justify-center ">
            <div>
              <div className="flex flex-col justify-between items-center mt-4">
                <img
                  className="size-24  rounded-full"
                  src="https://cdn.pixabay.com/photo/2022/08/17/13/16/guy-7392546_640.jpg "
                  alt="image"
                />
                <div className="rtl:text-4xl-rtl ltr:ml-2 ltr:text-4xl-ltr text-tertiary text-start font-bold mb-4 ">
                  {t("director")}
                </div>
              </div>

              <MultiTabTextarea
                optionalKey={"optional_lang"}
                onTabChanged={(key: string, tabName: string) => {
                  setDirect({
                    ...direct,
                    [key]: tabName,
                    //optional_lang: tabName,
                  });
                }}
                onChanged={(value: string, name: string) => {
                  setDirect({
                    ...direct,
                    [name]: value,
                  });
                }}
                name=""
                highlightColor="bg-tertiary"
                userData={direct}
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
                type="email"
                className="w-[400px]"
              ></Input>
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <PrimaryButton>{t("save")}</PrimaryButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default DirectorSection;
