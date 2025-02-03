import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import CustomTextarea from "@/components/custom-ui/input/CustomTextarea";

import TechnicalStaff from "./sections/technical-staff-section";
import Director from "./sections/director-secion";
import Manager from "./sections/manager-section";
import { useTranslation } from "react-i18next";
export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <>
      <div
        id="map"
        className="relative h-[600px] overflow-hidden bg-cover bg-[50%] bg-no-repeat"
      >
        <iframe
          src="https://www.google.com/maps/embed?..."
          width="100%"
          height="100%"
          loading="lazy"
        ></iframe>
      </div>
      <div className="mx-3 sm:w-[90%] px-3 sm:px-12 mb-28 -mt-[64px] dark:bg-card-secondary rounded-lg bg-[hsla(0,0%,100%,0.8)] shadow-md backdrop-blur-md space-y-24 pb-16 sm:mx-auto">
        <h1 className="text-center shadow-sm font-bold text-2xl rounded-md bg-primary p-4 text-white dark:bg-secondary">
          {t("contact_us")}
        </h1>

        <div className="flex flex-col items-center gap-y-12 sm:flex-row sm:justify-around sm:flex-wrap mt-16 justify-between">
          <Director />
          <Manager />

          <TechnicalStaff />
        </div>

        {/* Form */}
        <form className="flex flex-col mx-auto sm:w-[70%] lg:w-[50%] xl:w-[40%]">
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
            placeholder={t("enter_your_subject")}
            type="text"
            name="subject"
          />

          <CustomTextarea id="message" placeholder={t("content")} />

          <PrimaryButton
            className="w-20 mt-8 uppercase self-center"
            type="submit"
          >
            {t("submit")}
          </PrimaryButton>
        </form>
      </div>
    </>
  );
}
