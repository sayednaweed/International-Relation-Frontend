import FileChooser from "@/components/custom-ui/chooser/FileChooser";
import FileChooserTest from "@/components/custom-ui/chooser/FileChooserTest";
import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import BorderContainer from "@/components/custom-ui/container/BorderContainer";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import MultiTabInput from "@/components/custom-ui/input/mult-tab/MultiTabInput";
import MultiTabTextarea from "@/components/custom-ui/input/mult-tab/MultiTabTextarea";
import SingleTab from "@/components/custom-ui/input/mult-tab/parts/SingleTab";
import { StepperContext } from "@/components/custom-ui/stepper/StepperContext";
import { CountryEnum } from "@/lib/constants";
import { useContext } from "react";
import { useTranslation } from "react-i18next";

export default function DirectorInformationTab() {
  const { t } = useTranslation();
  const { userData, setUserData, error } = useContext(StepperContext);

  // The passed state
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  return (
    <div className="flex flex-col mt-10 w-full md:w-[60%] lg:w-[400px] gap-y-6 pb-12">
      <BorderContainer
        title={t("director_name")}
        required={true}
        parentClassName="p-t-4 pb-0 px-0"
        className="grid grid-cols-1 gap-y-3"
      >
        <MultiTabInput
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
          name="director_name"
          highlightColor="bg-tertiary"
          userData={userData}
          errorData={error}
          placeholder={t("content")}
          className="rtl:text-xl-rtl rounded-none border-t border-x-0 border-b-0 resize-none"
          tabsClassName="gap-x-5 px-3"
        >
          <SingleTab>english</SingleTab>
          <SingleTab>farsi</SingleTab>
          <SingleTab>pashto</SingleTab>
        </MultiTabInput>
      </BorderContainer>

      <BorderContainer
        title={t("director_sur_en")}
        required={true}
        parentClassName="p-t-4 pb-0 px-0"
        className="grid grid-cols-1 gap-y-3"
      >
        <MultiTabInput
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
          name="surname"
          highlightColor="bg-tertiary"
          userData={userData}
          errorData={error}
          placeholder={t("content")}
          className="rtl:text-xl-rtl rounded-none border-t border-x-0 border-b-0"
          tabsClassName="gap-x-5 px-3"
        >
          <SingleTab>english</SingleTab>
          <SingleTab>farsi</SingleTab>
          <SingleTab>pashto</SingleTab>
        </MultiTabInput>
      </BorderContainer>

      <CustomInput
        size_="sm"
        dir="ltr"
        required={true}
        requiredHint={`* ${t("required")}`}
        className="rtl:text-end"
        lable={t("director_contact")}
        placeholder={t("enter_ur_pho_num")}
        defaultValue={userData["director_contact"]}
        type="text"
        name="director_contact"
        errorMessage={error.get("director_contact")}
        onChange={handleChange}
      />
      <CustomInput
        size_="sm"
        dir="ltr"
        required={true}
        requiredHint={`* ${t("required")}`}
        className="rtl:text-end"
        lable={t("director_email")}
        placeholder={t("enter_your_email")}
        defaultValue={userData["director_email"]}
        type="text"
        name="director_email"
        errorMessage={error.get("director_email")}
        onChange={handleChange}
      />
      <APICombobox
        placeholderText={t("search_item")}
        errorText={t("no_item")}
        onSelect={(selection: any) =>
          setUserData({ ...userData, ["gender"]: selection })
        }
        lable={t("gender")}
        required={true}
        selectedItem={userData["gender"]?.name}
        placeHolder={t("select_a")}
        errorMessage={error.get("gender")}
        apiUrl={"genders"}
        mode="single"
      />

      <APICombobox
        placeholderText={t("search_item")}
        errorText={t("no_item")}
        onSelect={(selection: any) =>
          setUserData({ ...userData, ["nationality"]: selection })
        }
        lable={t("nationality")}
        required={true}
        selectedItem={userData["nationality"]?.name}
        placeHolder={t("select_a")}
        errorMessage={error.get("nationality")}
        apiUrl={"countries"}
        mode="single"
      />
      <APICombobox
        placeholderText={t("search_item")}
        errorText={t("no_item")}
        onSelect={(selection: any) =>
          setUserData({ ...userData, ["identity_type"]: selection })
        }
        lable={t("identity_type")}
        required={true}
        selectedItem={userData["identity_type"]?.name}
        placeHolder={t("select_a")}
        errorMessage={error.get("identity_type")}
        apiUrl={"nid/types"}
        mode="single"
      />

      <CustomInput
        size_="sm"
        dir="ltr"
        required={true}
        requiredHint={`* ${t("required")}`}
        className="rtl:text-end"
        lable={t("nid")}
        placeholder={t("enter_ur_pho_num")}
        defaultValue={userData["nid"]}
        type="text"
        name="nid"
        errorMessage={error.get("nid")}
        onChange={handleChange}
      />
      {userData.nationality?.id != CountryEnum.afghanistan && (
        <>
          {/* <FileChooser
            parentClassName="mt-6"
            lable={t("nid_attach")}
            required={true}
            requiredHint={`* ${t("required")}`}
            defaultFile={userData.nid_attach}
            errorMessage={error.get("nid_attach")}
            onchange={(file: File | undefined) =>
              setUserData({ ...userData, nid_attach: file })
            }
            validTypes={[
              "image/png",
              "image/jpeg",
              "image/gif",
              "application/pdf",
            ]}
            maxSize={2}
            accept="image/png, image/jpeg, image/gif, application/pdf"
          /> */}
          <BorderContainer
            title={t("nid_attach")}
            required={true}
            parentClassName="mt-3 p-0 rounded-md"
            className="flex flex-col items-start"
          >
            <FileChooserTest
              maxSize={1024}
              accept="image/png, image/jpeg, image/gif, application/pdf"
              name={""}
              defaultFile={userData?.nid_attach}
              errorMessage={error.get("nid_attach")}
              validTypes={[
                "image/png",
                "image/jpeg",
                "image/gif",
                "application/pdf",
              ]}
              uploadParam={{
                checklist_id: 3,
                ngo_id: 1,
              }}
              onComplete={async (record: any) => {
                for (const element of record) {
                  const item = element[element.length - 1] as File;
                  console.log(item);
                }
              }}
              onStart={async (file: File) => {
                setUserData({ ...userData, nid_attach: file });
              }}
            />
          </BorderContainer>
        </>
      )}

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
            setUserData({ ...userData, ["director_province"]: selection })
          }
          lable={t("province")}
          required={true}
          selectedItem={userData["director_province"]?.name}
          placeHolder={t("select_a")}
          errorMessage={error.get("director_province")}
          apiUrl={"provinces"}
          params={{ country_id: 1 }}
          mode="single"
        />
        {userData.director_province && (
          <APICombobox
            placeholderText={t("search_item")}
            errorText={t("no_item")}
            onSelect={(selection: any) =>
              setUserData({ ...userData, ["director_dis"]: selection })
            }
            lable={t("director_dis")}
            required={true}
            selectedItem={userData["director_dis"]?.name}
            placeHolder={t("select_a")}
            errorMessage={error.get("director_dis")}
            apiUrl={"districts"}
            params={{ province_id: userData?.province?.id }}
            mode="single"
            key={userData?.province?.id}
          />
        )}

        {userData.director_dis && (
          <MultiTabTextarea
            title={t("director_area")}
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
            name="director_area"
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
  );
}
