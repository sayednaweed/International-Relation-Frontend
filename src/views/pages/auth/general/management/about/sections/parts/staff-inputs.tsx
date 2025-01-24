import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import MultiTabTextarea from "@/components/custom-ui/input/mult-tab/MultiTabTextarea";
import SingleTab from "@/components/custom-ui/input/mult-tab/parts/SingleTab";
import ButtonSpinner from "@/components/custom-ui/spinner/ButtonSpinner";
import { Mail, Phone } from "lucide-react";
import { UserPermission } from "@/database/tables";
import { SectionEnum } from "@/lib/constants";
import { useUserAuthState } from "@/context/AuthContextProvider";
import { useTranslation } from "react-i18next";

export interface StaffInputsProps {
  setUserData: any;
  userData: any;
  error: Map<string, string>;
  manipulating: boolean;
  saveData: () => void;
  inputName: string;
}

export default function StaffInputs(props: StaffInputsProps) {
  const { setUserData, userData, manipulating, error, saveData, inputName } =
    props;
  const { user } = useUserAuthState();
  const { t } = useTranslation();
  const per: UserPermission | undefined = user?.permissions.get(
    SectionEnum.about
  );
  const edit = per ? per?.edit : false;
  const add = per ? per?.add : false;
  const handleChange = (e: any) => {
    if (userData) {
      const { name, value } = e.target;
      setUserData({ ...userData, [name]: value });
    }
  };
  return (
    <section className="flex flex-col gap-y-4">
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
        name={inputName}
        highlightColor="bg-tertiary"
        userData={userData}
        errorData={error}
        placeholder={t("detail")}
        rows={3}
        className="rtl:text-xl-rtl rounded-md"
        tabsClassName="gap-x-5 px-3"
      >
        <SingleTab>english</SingleTab>
        <SingleTab>farsi</SingleTab>
        <SingleTab>pashto</SingleTab>
      </MultiTabTextarea>
      <CustomInput
        size_="sm"
        name="email"
        value={userData?.email}
        placeholder={t("enter_your_email")}
        lable={t("email")}
        type="email"
        errorMessage={error.get("email")}
        onChange={handleChange}
        startContent={
          <Mail className="text-secondary-foreground size-[18px] pointer-events-none" />
        }
      />
      <CustomInput
        size_="sm"
        className={`rtl:text-right`}
        placeholder={t("enter_ur_pho_num")}
        value={userData?.contact}
        lable={t("contact")}
        type="text"
        name="contact"
        dir="ltr"
        errorMessage={error.get("contact")}
        onChange={handleChange}
        startContent={
          <Phone className="text-primary-icon size-[18px] pointer-events-none" />
        }
      />
      {(add || edit) && (
        <PrimaryButton
          disabled={manipulating}
          onClick={async () => await saveData()}
          className={`shadow-lg`}
        >
          <ButtonSpinner loading={manipulating}>
            {userData.editable ? t("edit") : t("save")}
          </ButtonSpinner>
        </PrimaryButton>
      )}
    </section>
  );
}
