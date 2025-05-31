import { useGlobalState } from "@/context/GlobalStateContext";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CenterBudget } from "@/database/tables";
import { CountryEnum } from "@/lib/constants";
import MultipleSelector from "@/components/custom-ui/select/MultipleSelector";
import { Option } from "@/lib/types";
import { MessageCircleQuestion } from "lucide-react";
import { IconTooltip } from "@/components/custom-ui/tooltip/icon-tooltip";
import SingleTab from "@/components/custom-ui/input/mult-tab/parts/SingleTab";
import MultiTabInput from "@/components/custom-ui/input/mult-tab/MultiTabInput";
import MultiTabTextarea from "@/components/custom-ui/input/mult-tab/MultiTabTextarea";

export interface AddCenterBudgetPartProps {
  onComplete: (center: CenterBudget) => boolean;
  onEditComplete: (center: CenterBudget) => boolean;
  editCenter?: CenterBudget;
}
export default function AddCenterBudgetPart(props: AddCenterBudgetPartProps) {
  const { onComplete, editCenter, onEditComplete } = props;
  const [userData, setUserData] = useState<CenterBudget>({
    id: "",
    province: undefined,
    district: [],
    village: [],
    health_centers: [],
    budget: "",
    direct_benefi: 0,
    in_direct_benefi: 0,
    address: "",
    health_employees: [],
    finance_and_admin: [],
  });
  const [error, setError] = useState<Map<string, string>>(new Map());
  const { t } = useTranslation();
  const [state] = useGlobalState();
  useEffect(() => {
    if (editCenter) {
      setUserData(editCenter);
    }
  }, [editCenter]);
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const province = useMemo(() => {
    return (
      <MultipleSelector
        popoverClassName="h-36"
        commandProps={{
          label: "Select frameworks",
          className: "mt-0 h-full min-w-[15rem] max-w-[15rem]",
        }}
        placeholder={t("select")}
        onChange={(option: Option[]) => {
          setUserData((prev: any) => ({
            ...prev,
            province: option[0],
          }));
        }}
        // defaultOptions={frameworks}
        selectedOptions={
          userData.province && !Array.isArray(userData.province)
            ? ([userData.province] as Option[])
            : []
        }
        required={false}
        apiUrl={"provinces/" + CountryEnum.afghanistan}
        emptyIndicator={<p className="text-center text-sm">{t("no_item")}</p>}
        className="m-0 rounded-none border-none h-full"
        maxSelected={1}
      />
    );
  }, []);
  const district = useMemo(() => {
    return (
      <MultipleSelector
        key={userData?.province ? userData?.province?.name : null}
        popoverClassName="h-36"
        placeholder={t("select")}
        commandProps={{
          label: "Select frameworks",
          className: "mt-0 h-full min-w-[14rem] max-w-[14rem]",
        }}
        onChange={(option: Option[]) => {
          setUserData((prev: any) => ({
            ...prev,
            district: option,
          }));
        }}
        // defaultOptions={frameworks}
        errorMessage={error.get("district")}
        selectedOptions={userData.district as Option[]}
        required={true}
        apiUrl={"districts/" + userData?.province?.id}
        emptyIndicator={<p className="text-center text-sm">{t("no_item")}</p>}
        className="m-0 bg-card rounded-none border-none h-full"
        shouldFetch={userData?.province ? true : false}
      />
    );
  }, [userData?.province?.id]);
  return (
    <>
      <div className="col-span-full border overflow-auto p-4">
        <ul className="w-full h-fit overflow-hidden min-w-fit">
          {/* Header Row */}
          <li className="grid grid-cols-[11rem_15rem_1fr_1fr_8rem_8rem_8rem_1fr] [&>div]:border bg-primary/5 font-semibold">
            <div className="flex justify-start text-wrap p-2">
              <h1>{t("province")}</h1>
            </div>
            <div className="flex justify-start text-wrap p-2">
              <h1>{t("district")}</h1>
            </div>
            <div className="flex justify-between text-wrap text-center p-2 items-start">
              <h1>{t("village")}</h1>
              <IconTooltip
                icon={
                  <MessageCircleQuestion className="size-[18px] text-blue-800 dark:text-white" />
                }
              >
                <h1 className="font-medium ltr:text-2xl-ltr">
                  {t("guideline")}
                </h1>
                <h1 className="ltr:text-xl-ltr">{t("g_w_des")}</h1>
              </IconTooltip>
            </div>
            <div className="flex justify-between text-wrap text-center p-2 items-start">
              <h1>{t("health_centers")}</h1>
              <IconTooltip
                icon={
                  <MessageCircleQuestion className="size-[18px] text-blue-800 dark:text-white" />
                }
              >
                <h1 className="font-medium ltr:text-2xl-ltr">
                  {t("guideline")}
                </h1>
                <h1 className="ltr:text-xl-ltr">{t("g_w_des")}</h1>
              </IconTooltip>
            </div>
            <div className="flex justify-start text-wrap p-2">
              <h1>{t("budget")}</h1>
            </div>
            <div className="flex justify-start text-wrap p-2">
              <h1>{t("direct_benefi")}</h1>
            </div>
            <div className="flex justify-start text-wrap p-2">
              <h1>{t("in_direct_benefi")}</h1>
            </div>
            <div className="flex justify-between text-wrap text-center p-2 items-start">
              <h1>{t("address")}</h1>
              <IconTooltip
                icon={
                  <MessageCircleQuestion className="size-[18px] text-blue-800 dark:text-white" />
                }
              >
                <h1 className="font-medium ltr:text-2xl-ltr">
                  {t("guideline")}
                </h1>
                <h1 className="ltr:text-xl-ltr">{t("a_w_des")}</h1>
              </IconTooltip>
            </div>
          </li>

          {/* Data Row */}
          <li className="grid grid-cols-[11rem_15rem_1fr_1fr_8rem_8rem_8rem_1fr]">
            <div className="border">{province}</div>
            <div className="border">{district}</div>
            <div className="border">
              <MultiTabTextarea
                optionalKey={"optional_lang"}
                onTabChanged={(key: string, tabName: string) => {
                  setUserData((prev: any) => ({
                    ...prev,
                    [key]: tabName,
                    optional_lang: tabName,
                  }));
                }}
                onChanged={(value: string, name: string) => {
                  setUserData((prev: any) => ({
                    ...prev,
                    [name]: value,
                  }));
                }}
                name="village"
                highlightColor="bg-tertiary"
                userData={userData}
                errorData={error}
                placeholder={t("enter")}
                className="rtl:text-xl-rtl resize ltr:placeholder:text-xl-ltr rounded-none m-0 border-t border-x-0 border-b-0"
                tabsClassName="gap-0"
              >
                <SingleTab className="rounded-none bg-transparent text-primary shadow-none border">
                  english
                </SingleTab>
                <SingleTab className="rounded-none bg-transparent text-primary shadow-none border">
                  farsi
                </SingleTab>
                <SingleTab className="rounded-none bg-transparent text-primary shadow-none border">
                  pashto
                </SingleTab>
              </MultiTabTextarea>
            </div>
            <div className="border">
              <MultiTabTextarea
                optionalKey={"optional_lang"}
                onTabChanged={(key: string, tabName: string) => {
                  setUserData((prev: any) => ({
                    ...prev,
                    [key]: tabName,
                    optional_lang: tabName,
                  }));
                }}
                onChanged={(value: string, name: string) => {
                  setUserData((prev: any) => ({
                    ...prev,
                    [name]: value,
                  }));
                }}
                name="health_centers"
                highlightColor="bg-tertiary"
                userData={userData}
                errorData={error}
                placeholder={t("enter")}
                className="rtl:text-xl-rtl resize ltr:placeholder:text-xl-ltr rounded-none m-0 border-t border-x-0 border-b-0"
                tabsClassName="gap-0"
              >
                <SingleTab className="rounded-none bg-transparent text-primary shadow-none border">
                  english
                </SingleTab>
                <SingleTab className="rounded-none bg-transparent text-primary shadow-none border">
                  farsi
                </SingleTab>
                <SingleTab className="rounded-none bg-transparent text-primary shadow-none border">
                  pashto
                </SingleTab>
              </MultiTabTextarea>
            </div>
            <div className="border">
              <textarea
                className="h-full w-full resize-none px-3 pt-1 placeholder:text-muted-foreground ltr:placeholder:text-xl-ltr focus-visible:ring-0 focus-visible:outline-none"
                placeholder={t("enter")}
              />
            </div>
            <div className="border">
              <textarea
                className="h-full w-full resize-none px-3 pt-1 placeholder:text-muted-foreground ltr:placeholder:text-xl-ltr focus-visible:ring-0 focus-visible:outline-none"
                placeholder={t("enter")}
              />
            </div>
            <div className="border">
              <textarea
                className="h-full w-full resize-none px-3 pt-1 placeholder:text-muted-foreground ltr:placeholder:text-xl-ltr focus-visible:ring-0 focus-visible:outline-none"
                placeholder={t("enter")}
              />
            </div>
            <div className="border">
              <MultiTabTextarea
                optionalKey={"optional_lang"}
                onTabChanged={(key: string, tabName: string) => {
                  setUserData((prev: any) => ({
                    ...prev,
                    [key]: tabName,
                    optional_lang: tabName,
                  }));
                }}
                onChanged={(value: string, name: string) => {
                  setUserData((prev: any) => ({
                    ...prev,
                    [name]: value,
                  }));
                }}
                name="address"
                highlightColor="bg-tertiary"
                userData={userData}
                errorData={error}
                placeholder={t("enter")}
                className="rtl:text-xl-rtl resize ltr:placeholder:text-xl-ltr rounded-none m-0 border-t border-x-0 border-b-0"
                tabsClassName="gap-0"
              >
                <SingleTab className="rounded-none bg-transparent text-primary shadow-none border">
                  english
                </SingleTab>
                <SingleTab className="rounded-none bg-transparent text-primary shadow-none border">
                  farsi
                </SingleTab>
                <SingleTab className="rounded-none bg-transparent text-primary shadow-none border">
                  pashto
                </SingleTab>
              </MultiTabTextarea>
            </div>
          </li>
          {/* Project Employees */}
          <li className="grid grid-cols-1 border bg-primary/5">
            <h1 className="text-center p-4 font-bold ltr:text-[17px] text-primary">
              {t("proj_employees")}
            </h1>
          </li>
          {/* Header Row */}
          <li className="grid grid-cols-2 [&>div]:border bg-primary/5 font-semibold">
            <div className="flex justify-between text-wrap text-center p-2 items-center">
              <h1>{t("health_worker")}</h1>
              <IconTooltip
                icon={
                  <MessageCircleQuestion className="size-[18px] text-blue-800 dark:text-white" />
                }
              >
                <h1 className="font-medium ltr:text-2xl-ltr">
                  {t("guideline")}
                </h1>
                <h1 className="ltr:text-xl-ltr">{t("g_w_des")}</h1>
              </IconTooltip>
            </div>
            <div className="flex justify-between text-wrap text-center p-2 items-center">
              <h1>{t("fin_admin_employees")}</h1>
              <IconTooltip
                icon={
                  <MessageCircleQuestion className="size-[18px] text-blue-800 dark:text-white" />
                }
              >
                <h1 className="font-medium ltr:text-2xl-ltr">
                  {t("guideline")}
                </h1>
                <h1 className="ltr:text-xl-ltr">{t("g_w_des")}</h1>
              </IconTooltip>
            </div>
          </li>

          {/* Data Row */}
          <li className="grid grid-cols-[1fr_1fr]">
            <div className="border">
              <MultiTabTextarea
                optionalKey={"optional_lang"}
                onTabChanged={(key: string, tabName: string) => {
                  setUserData((prev: any) => ({
                    ...prev,
                    [key]: tabName,
                    optional_lang: tabName,
                  }));
                }}
                onChanged={(value: string, name: string) => {
                  setUserData((prev: any) => ({
                    ...prev,
                    [name]: value,
                  }));
                }}
                name="health_worker"
                highlightColor="bg-tertiary"
                userData={userData}
                errorData={error}
                placeholder={t("enter")}
                className="rtl:text-xl-rtl resize ltr:placeholder:text-xl-ltr rounded-none m-0 border-t border-x-0 border-b-0"
                tabsClassName="gap-0"
              >
                <SingleTab className="rounded-none bg-transparent text-primary shadow-none border">
                  english
                </SingleTab>
                <SingleTab className="rounded-none bg-transparent text-primary shadow-none border">
                  farsi
                </SingleTab>
                <SingleTab className="rounded-none bg-transparent text-primary shadow-none border">
                  pashto
                </SingleTab>
              </MultiTabTextarea>
            </div>
            <div className="border">
              <MultiTabTextarea
                optionalKey={"optional_lang"}
                onTabChanged={(key: string, tabName: string) => {
                  setUserData((prev: any) => ({
                    ...prev,
                    [key]: tabName,
                    optional_lang: tabName,
                  }));
                }}
                onChanged={(value: string, name: string) => {
                  setUserData((prev: any) => ({
                    ...prev,
                    [name]: value,
                  }));
                }}
                name="fin_admin_employees"
                highlightColor="bg-tertiary"
                userData={userData}
                errorData={error}
                placeholder={t("enter")}
                className="rtl:text-xl-rtl resize ltr:placeholder:text-xl-ltr rounded-none m-0 border-t border-x-0 border-b-0"
                tabsClassName="gap-0"
              >
                <SingleTab className="rounded-none bg-transparent text-primary shadow-none border">
                  english
                </SingleTab>
                <SingleTab className="rounded-none bg-transparent text-primary shadow-none border">
                  farsi
                </SingleTab>
                <SingleTab className="rounded-none bg-transparent text-primary shadow-none border">
                  pashto
                </SingleTab>
              </MultiTabTextarea>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
}
