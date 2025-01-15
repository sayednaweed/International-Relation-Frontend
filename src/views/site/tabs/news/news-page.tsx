import OptionalTabs from "@/components/custom-ui/input/mult-tab/parts/OptionalTab";
import SingleTab from "@/components/custom-ui/input/mult-tab/parts/SingleTab";
import SingleTabTextarea from "@/components/custom-ui/input/mult-tab/SingleTabTextarea";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function NewsPage() {
  const { t } = useTranslation();

  const [errorData, setErrorData] = useState<{
    username_english: string;
  }>({
    username_english: "Username is required",
  });
  const [userData, setUserData] = useState<{
    optional_lang: string;
  }>({
    optional_lang: "",
  });
  return (
    <div className="p-2 flex flex-col gap-y-4">
      <SingleTabTextarea
        name="username"
        title={t("username")}
        highlightColor="bg-tertiary"
        userData={userData}
        setUserData={setUserData}
        placeholder={t("content")}
        rows={3}
        className="rtl:text-xl-rtl"
        tabsClassName="gap-x-8"
      >
        <SingleTab>english</SingleTab>
        <OptionalTabs>
          <SingleTab>farsi</SingleTab>
          <SingleTab>pashto</SingleTab>
        </OptionalTabs>
      </SingleTabTextarea>
      <SingleTabTextarea
        name="objective"
        title={t("objective")}
        highlightColor="bg-tertiary"
        userData={userData}
        setUserData={setUserData}
        placeholder={t("content")}
        rows={3}
        className="rtl:text-xl-rtl"
        tabsClassName="gap-x-8"
      >
        <SingleTab>english</SingleTab>
        <OptionalTabs>
          <SingleTab>farsi</SingleTab>
          <SingleTab>pashto</SingleTab>
        </OptionalTabs>
      </SingleTabTextarea>
    </div>
  );
}
