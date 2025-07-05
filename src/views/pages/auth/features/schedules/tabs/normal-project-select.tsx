import CustomInput from "@/components/custom-ui/input/CustomInput";
import { Dispatch } from "react";
import { useTranslation } from "react-i18next";

export interface CustomProjectSelectProps {
  userData: any;
  setUserData: Dispatch<any>;
  error: Map<string, string>;
}

export function NormalProjectSelect(props: CustomProjectSelectProps) {
  const { error, userData, setUserData } = props;
  const { t } = useTranslation();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserData((prev: any) => ({ ...prev, [name]: value }));
  };
  return (
    <CustomInput
      size_="sm"
      dir="ltr"
      required={true}
      requiredHint={`* ${t("required")}`}
      className="rtl:text-end"
      placeholder={t("presentation_count")}
      defaultValue={userData["presentation_count"]}
      type="text"
      name="presentation_count"
      errorMessage={error.get("presentation_count")}
      onChange={handleChange}
    />
  );
}
