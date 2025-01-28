import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import BorderContainer from "@/components/custom-ui/container/BorderContainer";
import CustomDatePicker from "@/components/custom-ui/DatePicker/CustomDatePicker";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import MultiTabTextarea from "@/components/custom-ui/input/mult-tab/MultiTabTextarea";
import SingleTab from "@/components/custom-ui/input/mult-tab/parts/SingleTab";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import { StepperContext } from "@/components/custom-ui/stepper/StepperContext";
import { toast } from "@/components/ui/use-toast";
import axiosClient from "@/lib/axois-client";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DateObject } from "react-multi-date-picker";
import { useNavigate, useParams } from "react-router";

export default function NgoInformationTab() {
  const { t } = useTranslation();
  let { id } = useParams();
  const navigate = useNavigate();
  const { userData, setUserData, error } = useContext(StepperContext);
  const [allowed, setAllowed] = useState(false);

  const initialize = async () => {
    try {
      const response = await axiosClient.get(`user/news/${id}`);
      if (response.status == 200) {
        setAllowed(true);
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
      });
      console.log(error);
      navigate("/unauthorized", { replace: true });
    }
  };
  useEffect(() => {
    initialize();
  }, []);

  // The passed state
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  return allowed ? (
    <div className="flex flex-col mt-10 w-full md:w-[60%] lg:w-[400px] gap-y-6 pb-12">
      <BorderContainer
        title={t("ngo_name")}
        required={true}
        parentClassName="p-t-4 pb-0 px-0"
        className="grid grid-cols-1 gap-y-3"
      >
        <MultiTabTextarea
          optionalKey={"optional_lang"}
          onTabChanged={(key: string, tabName: string) => {
            setUserData({
              ...userData,
              [key]: tabName,
              optional_lang: tabName,
            });
          }}
          onChanged={(value: string, name: string) => {
            setUserData({
              ...userData,
              [name]: value,
            });
          }}
          name="name"
          highlightColor="bg-tertiary"
          userData={userData}
          errorData={error}
          placeholder={t("content")}
          rows={3}
          className="rtl:text-xl-rtl rounded-none border-t border-x-0 border-b-0"
          tabsClassName="gap-x-5 px-3"
        >
          <SingleTab>english</SingleTab>
          <SingleTab>farsi</SingleTab>
          <SingleTab>pashto</SingleTab>
        </MultiTabTextarea>
      </BorderContainer>

      <CustomInput
        required={true}
        requiredHint={`* ${t("required")}`}
        size_="sm"
        lable={t("abbr")}
        name="abbr"
        defaultValue={userData["abbr"]}
        placeholder={t("abbr_english")}
        type="text"
        className="uppercase"
        errorMessage={error.get("abbr")}
        onBlur={handleChange}
      />
      <APICombobox
        placeholderText={t("search_item")}
        errorText={t("no_item")}
        onSelect={(selection: any) =>
          setUserData({ ...userData, ["type"]: selection })
        }
        lable={t("type")}
        required={true}
        requiredHint={`* ${t("required")}`}
        selectedItem={userData["type"]?.name}
        placeHolder={t("select_a")}
        errorMessage={error.get("type")}
        apiUrl={"ngo-types"}
        mode="single"
      />
      <CustomInput
        size_="sm"
        dir="ltr"
        required={true}
        requiredHint={`* ${t("required")}`}
        className="rtl:text-end"
        lable={t("contact")}
        placeholder={t("enter_ur_pho_num")}
        defaultValue={userData["contact"]}
        type="text"
        name="contact"
        errorMessage={error.get("contact")}
        onChange={handleChange}
      />
      <CustomInput
        size_="sm"
        name="email"
        required={true}
        requiredHint={`* ${t("required")}`}
        lable={t("email")}
        defaultValue={userData["email"]}
        placeholder={t("enter_your_email")}
        type="email"
        errorMessage={error.get("email")}
        onChange={handleChange}
        dir="ltr"
        className="rtl:text-right"
      />

      <CustomInput
        size_="sm"
        name="moe_registration_no"
        required={true}
        requiredHint={`* ${t("required")}`}
        lable={t("moe_registration_no")}
        defaultValue={userData["moe_registration_no"]}
        placeholder={t("enter_your_email")}
        type="moe_registration_no"
        errorMessage={error.get("moe_registration_no")}
        onChange={handleChange}
        dir="ltr"
        className="rtl:text-right"
      />

      <BorderContainer
        title={t("place_of_establishment")}
        required={true}
        parentClassName="mt-3"
        className="flex flex-col items-stretch gap-y-3"
      >
        <APICombobox
          placeholderText={t("search_item")}
          errorText={t("no_item")}
          onSelect={(selection: any) =>
            setUserData({ ...userData, ["country"]: selection })
          }
          lable={t("country")}
          required={true}
          selectedItem={userData["country"]?.name}
          placeHolder={t("select_a")}
          errorMessage={error.get("country")}
          apiUrl={"countries"}
          mode="single"
        />
        <CustomDatePicker
          placeholder={t("select_a_date")}
          lable={t("establishment_date")}
          requiredHint={`* ${t("required")}`}
          required={true}
          value={userData.establishment_date}
          dateOnComplete={(date: DateObject) => {
            setUserData({ ...userData, establishment_date: date });
          }}
          className="py-3 w-full"
          errorMessage={error.get("establishment_date")}
        />
      </BorderContainer>

      <BorderContainer
        title={t("head_office_add")}
        required={true}
        parentClassName="mt-3"
        className="flex flex-col items-start gap-y-3"
      >
        <APICombobox
          placeholderText={t("search_item")}
          errorText={t("no_item")}
          onSelect={(selection: any) =>
            setUserData({ ...userData, ["province"]: selection })
          }
          lable={t("province")}
          required={true}
          selectedItem={userData["province"]?.name}
          placeHolder={t("select_a")}
          errorMessage={error.get("province")}
          apiUrl={"provinces"}
          params={{ country_id: 1 }}
          mode="single"
        />
        {userData.province && (
          <APICombobox
            placeholderText={t("search_item")}
            errorText={t("no_item")}
            onSelect={(selection: any) =>
              setUserData({ ...userData, ["district"]: selection })
            }
            lable={t("district")}
            required={true}
            selectedItem={userData["district"]?.name}
            placeHolder={t("select_a")}
            errorMessage={error.get("district")}
            apiUrl={"districts"}
            params={{ province_id: userData?.province?.id }}
            mode="single"
            key={userData?.province?.id}
          />
        )}

        {userData.district && (
          <MultiTabTextarea
            title={t("area")}
            parentClassName="w-full"
            optionalKey={"optional_lang"}
            onTabChanged={(key: string, tabName: string) => {
              setUserData({
                ...userData,
                [key]: tabName,
                optional_lang: tabName,
              });
            }}
            onChanged={(value: string, name: string) => {
              setUserData({
                ...userData,
                [name]: value,
              });
            }}
            name="area"
            highlightColor="bg-tertiary"
            userData={userData}
            errorData={error}
            placeholder={t("content")}
            rows={5}
            className="rtl:text-xl-rtl"
            tabsClassName="gap-x-5"
          >
            <SingleTab>english</SingleTab>
            <SingleTab>farsi</SingleTab>
            <SingleTab>pashto</SingleTab>
          </MultiTabTextarea>
        )}
      </BorderContainer>
    </div>
  ) : (
    <NastranSpinner />
  );
}
