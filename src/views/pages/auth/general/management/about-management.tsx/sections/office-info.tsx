import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { t } from "i18next";

import Input from "@/components/custom-ui/input/CustomInput";
import { useState } from "react";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";

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
            {" "}
            <Input
              size_="lg"
              lable={t("address")}
              type="text"
              className="w-[400px]"
            ></Input>
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
          <div className="ltr:ml-6 rtl:mr-6">
            <PrimaryButton>{t("save")}</PrimaryButton>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default OfficeInfo;
