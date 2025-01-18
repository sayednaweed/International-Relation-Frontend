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
  return <div className="p-2 flex flex-col gap-y-4"></div>;
}
