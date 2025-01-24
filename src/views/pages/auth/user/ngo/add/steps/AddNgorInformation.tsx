import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import BorderContainer from "@/components/custom-ui/container/BorderContainer";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import MultiTabTextarea from "@/components/custom-ui/input/mult-tab/MultiTabTextarea";
import SingleTab from "@/components/custom-ui/input/mult-tab/parts/SingleTab";
import { StepperContext } from "@/components/custom-ui/stepper/StepperContext";
import { useContext } from "react";
import { useTranslation } from "react-i18next";

export default function AddNgoInformation() {
  const { t } = useTranslation();
  const { userData, setUserData, error } = useContext(StepperContext);
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  return (
    <div className="flex flex-col mt-10 w-full md:w-[60%] lg:w-[400px] gap-y-6 pb-12">
      <BorderContainer
        title={t("name")}
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
        apiUrl={"ngo/types"}
        mode="single"
      />
      <BorderContainer
        title={t("address")}
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
          // <CustomInput
          //   required={true}
          //   requiredHint={`* ${t("required")}`}
          //   size_="sm"
          //   lable={t("area")}
          //   name="area"
          //   defaultValue={userData["area"]}
          //   placeholder={t("area")}
          //   type="text"
          //   parentClassName="w-full"
          //   errorMessage={error.get("area")}
          //   onBlur={handleChange}
          // />
        )}
      </BorderContainer>
    </div>
  );
}
