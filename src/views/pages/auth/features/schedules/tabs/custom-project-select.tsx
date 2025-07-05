import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import { Dispatch } from "react";
import { useTranslation } from "react-i18next";

export interface CustomProjectSelectProps {
  userData: any;
  setUserData: Dispatch<any>;
  error: Map<string, string>;
}

export function CustomProjectSelect(props: CustomProjectSelectProps) {
  const { error, userData, setUserData } = props;
  const { t } = useTranslation();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserData((prev: any) => ({ ...prev, [name]: value }));
  };
  return (
    <APICombobox
      placeholderText={t("search_item")}
      errorText={t("no_item")}
      onSelect={(selection: any) =>
        setUserData((prev: any) => ({
          ...prev,
          ["projects"]: selection,
        }))
      }
      lable={t("projects")}
      required={true}
      selectedItem={userData["projects"]?.name}
      placeHolder={t("select_a")}
      errorMessage={error.get("projects")}
      apiUrl={"projects"}
      mode="single"
    />
  );
}
