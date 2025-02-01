import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import { t } from "i18next";
import CustomTextarea from "@/components/custom-ui/input/CustomTextarea";
import { useEffect, useState } from "react";
import axiosClient from "@/lib/axois-client";
import { useParams } from "react-router";
import { toast } from "@/components/ui/use-toast";
import { Staff } from "@/database/tables";

import TechnicalStaff from "./sections/technical-staff-section";
import Director from "./sections/director-secion";
import Manager from "./sections/manager-section";
export default function AboutPage() {
  const { page } = useParams<{ page: string }>();
  const [staffs, setStaffs] = useState<
    | {
        director: Staff;
        manager: Staff;
      }
    | undefined
  >(undefined);

  const initialize = async () => {
    try {
      const response = await axiosClient.get(`/staff/director/${page}`);

      if (response.status === 200) {
        setStaffs(response.data.staffs);
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: error.response?.data?.message || t("something_went_wrong"),
      });
    }
  };

  useEffect(() => {
    if (page) initialize();
  }, [page]);

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
      <div className="w-[90%] mx-auto px-6 md:px-12 mb-28 -mt-[64px]">
        <div className="block rounded-lg bg-[hsla(0,0%,100%,0.8)] px-6 py-12 shadow-md md:py-16 md:px-12 backdrop-blur-md dark:bg-black/30">
          <h1 className="text-center font-bold text-2xl rounded-md bg-sky-200 p-4 text-primary">
            {t("contact_us")}
          </h1>

          <div className="flex flex-row mt-16 justify-between items-center">
            {/* Ird staff */}
            <Director director={staffs?.director} />
            <Manager manager={staffs?.manager} />

            {/* Technical Support */}
            <TechnicalStaff />
          </div>

          {/* Form */}
          <form className="flex flex-col mt-16 items-center">
            <CustomInput
              lable={t("name")}
              id="name"
              size_="sm"
              placeholder={t("enter_your_name")}
              type="text"
              name="name"
              className="md:w-96 mb-4"
            />

            <CustomInput
              lable={t("email")}
              id="email"
              size_="sm"
              placeholder={t("enter_your_email")}
              type="email"
              name="email"
              className="md:w-96 mb-4"
            />

            <CustomInput
              lable={t("contact")}
              id="contact"
              size_="sm"
              placeholder={t("enter_ur_phno")}
              type="number"
              name="contact"
              className="md:w-96 mb-4"
            />

            <CustomInput
              lable={t("subject")}
              id="subject"
              size_="sm"
              placeholder={t("enter_your_subject")}
              type="text"
              name="subject"
              className="md:w-96 mb-4"
            />

            <CustomTextarea
              id="message"
              className="w-[500px] p-3 rounded-lg"
              placeholder={t("enter_ur_messhere...")}
            />

            <PrimaryButton className="w-20 mt-8 uppercase" type="submit">
              {t("submit")}
            </PrimaryButton>
          </form>
        </div>
      </div>
    </>
  );
}
