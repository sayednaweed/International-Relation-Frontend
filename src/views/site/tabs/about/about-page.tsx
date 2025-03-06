import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import CustomTextarea from "@/components/custom-ui/input/CustomTextarea";

import TechnicalStaff from "./sections/technical-staff-section";
import Director from "./sections/director-secion";
import Manager from "./sections/manager-section";
import { useTranslation } from "react-i18next";
import { SendHorizonal } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import ButtonSpinner from "@/components/custom-ui/spinner/ButtonSpinner";

export default function AboutPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const onFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (loading) setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 seconds delay
    toast({
      toastType: "SUCCESS",
      title: t("success"),
    });
    setLoading(false);
  };
  return (
    <>
      <iframe
        src="https://www.google.com/maps/embed?..."
        width="100%"
        height="100%"
        className="h-[600px]"
      ></iframe>

      <div className="mx-3 sm:w-[90%] px-3 sm:px-12 mb-28 -mt-[64px] dark:bg-card-secondary rounded-lg shadow-md bg-card/80 backdrop-blur-md space-y-24 pb-16 sm:mx-auto">
        <h1 className="text-center font-bold text-2xl rounded-md rtl:text-[32px] p-4 text-primary">
          {t("contact_us")}
        </h1>

        <div className="flex flex-col items-center gap-y-12 sm:flex-row sm:justify-around sm:flex-wrap mt-16 justify-between">
          <Director />
          <Manager />
          <TechnicalStaff />
        </div>

        {/* Form */}
        <form
          onSubmit={onFormSubmit}
          className="flex flex-col mx-auto sm:w-[70%] gap-y-4 lg:w-[50%] xl:w-[40%]"
        >
          <CustomInput
            lable={t("name")}
            id="name"
            size_="sm"
            placeholder={t("enter_your_name")}
            type="text"
            name="name"
          />

          <CustomInput
            lable={t("email")}
            id="email"
            size_="sm"
            placeholder={t("enter_your_email")}
            type="email"
            name="email"
          />

          <CustomInput
            lable={t("contact")}
            id="contact"
            size_="sm"
            placeholder={t("enter_ur_pho_num")}
            type="number"
            name="contact"
          />

          <CustomInput
            lable={t("subject")}
            id="subject"
            size_="sm"
            placeholder={t("content")}
            type="text"
            name="subject"
          />

          <CustomTextarea id="message" placeholder={t("content")} />

          <PrimaryButton
            type="submit"
            className={`shadow-lg mt-8 px-3 uppercase self-center`}
          >
            <ButtonSpinner loading={loading}>{t("submit")}</ButtonSpinner>
            <SendHorizonal />
          </PrimaryButton>
        </form>
      </div>
    </>
  );
}
