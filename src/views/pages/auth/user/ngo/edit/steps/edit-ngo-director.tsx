import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import { RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import axiosClient from "@/lib/axois-client";
import { useUserAuthState } from "@/context/AuthContextProvider";
import { setServerError, validate } from "@/validation/validation";
import ButtonSpinner from "@/components/custom-ui/spinner/ButtonSpinner";
import {
  Country,
  District,
  Gender,
  NidType,
  Province,
  UserPermission,
} from "@/database/tables";
import { LanguageEnum, SectionEnum } from "@/lib/constants";
import { useParams } from "react-router";
import SingleTab from "@/components/custom-ui/input/mult-tab/parts/SingleTab";
import BorderContainer from "@/components/custom-ui/container/BorderContainer";
import { DateObject } from "react-multi-date-picker";
import { ValidateItem } from "@/validation/types";
import MultiTabInput from "@/components/custom-ui/input/mult-tab/MultiTabInput";
import MultiTabTextarea from "@/components/custom-ui/input/mult-tab/MultiTabTextarea";
interface EditNgoDirectorProps {
  name_english: string;
  name_pashto: string;
  name_farsi: string;
  surname_english: string;
  surname_pashto: string;
  surname_farsi: string;
  contact: string;
  email: string;
  gender: Gender;
  moe_registration_no: string;
  nationality: Country;
  nid: string;
  identity_type: NidType;
  province: Province;
  district: District;
  establishment_date: DateObject;
  status: boolean;
  optional_lang: string;
}
export default function EditNgoDirector() {
  const { user } = useUserAuthState();
  const { t } = useTranslation();
  let { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [error, setError] = useState<Map<string, string>>(new Map());
  const [ngoData, setNgoData] = useState<EditNgoDirectorProps>();

  const per: UserPermission | undefined = user?.permissions.get(
    SectionEnum.ngo
  );
  const hasEdit = per ? per?.edit : false;

  const loadInformation = async () => {
    try {
      const response = await axiosClient.get(`ngo/director/${id}`);
      if (response.status == 200) {
        const director = response.data.director;
        setNgoData(director);
      }
      // setNgoData({
      //   registration_no: "",
      //   name_english: "",
      //   name_pashto: "",
      //   name_farsi: "",
      //   area_english: "",
      //   area_pashto: "",
      //   area_farsi: "",
      //   abbr: "",
      //   type: {
      //     id: "",
      //     name: "",
      //     created_at: "",
      //   },
      //   contact: "",
      //   email: "",
      //   moe_registration_no: "",
      //   place_of_establishment: undefined,
      //   country: {
      //     id: "",
      //     name: "",
      //   },
      //   province: {
      //     id: "",
      //     name: "",
      //   },
      //   district: {
      //     id: "",
      //     name: "",
      //   },
      //   establishment_date: new DateObject(new Date()),
      //   status: true,
      //   optional_lang: "english",
      // });
      // }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: error.response.data.message,
      });
      console.log(error);
      setFailed(true);
    }
    setLoading(false);
  };
  useEffect(() => {
    loadInformation();
  }, []);

  const handleChange = (_e: any) => {
    // const { name, value } = e.target;
  };
  const saveData = async () => {
    if (loading || id === undefined) {
      setLoading(false);
      return;
    }
    setLoading(true);
    // 1. Validate data changes
    // 2. Validate form
    const compulsoryFields: ValidateItem[] = [
      {
        name: "registration_no",
        rules: ["required"],
      },
      {
        name: "name_english",
        rules: ["required", "max:128", "min:3"],
      },
      {
        name: "moe_registration_no",
        rules: ["required"],
      },
      {
        name: "abbr",
        rules: ["required"],
      },
      {
        name: "ngo_type",
        rules: ["required"],
      },
      {
        name: "contact",
        rules: ["required"],
      },
      {
        name: "email",
        rules: ["required"],
      },
      {
        name: "place_of_establishment",
        rules: ["required"],
      },
      {
        name: "address",
        rules: ["required"],
      },
      {
        name: "establishment_date",
        rules: ["required"],
      },
      {
        name: "last_agreement_date",
        rules: ["required"],
      },
      {
        name: "status",
        rules: ["required"],
      },
    ];
    if (ngoData?.optional_lang == LanguageEnum.farsi) {
      compulsoryFields.push({
        name: "name_pashto",
        rules: ["required", "max:128", "min:3"],
      });
    } else {
      compulsoryFields.push({
        name: "name_farsi",
        rules: ["required", "max:128", "min:3"],
      });
    }

    compulsoryFields.push();
    const passed = await validate(compulsoryFields, ngoData, setError);
    if (!passed) {
      setLoading(false);
      return;
    }
    // 2. Store
    const formData = new FormData();
    formData.append("id", id);
    try {
      const response = await axiosClient.post("user/update", formData);
      if (response.status == 200) {
        // Update user state
        const details = response.data.ngo_details;
        setNgoData(details);
        toast({
          toastType: "SUCCESS",
          title: t("success"),
          description: response.data.message,
        });
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: error.response.data.message,
      });
      setServerError(error.response.data.errors, setError);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-0">
        <CardTitle className="rtl:text-3xl-rtl ltr:text-2xl-ltr">
          {t("account_information")}
        </CardTitle>
        <CardDescription className="rtl:text-xl-rtl ltr:text-lg-ltr">
          {t("update_user_acc_info")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {failed ? (
          <h1 className="rtl:text-2xl-rtl">{t("u_are_not_authzed!")}</h1>
        ) : ngoData === undefined ? (
          <NastranSpinner />
        ) : (
          <div className="grid gap-x-4 gap-y-6 w-full xl:w-1/2">
            <BorderContainer
              title={t("name")}
              required={true}
              parentClassName="p-t-4 pb-0 px-0"
              className="grid grid-cols-1 gap-y-3"
            >
              <MultiTabInput
                optionalKey={"optional_lang"}
                onTabChanged={(key: string, tabName: string) => {
                  setNgoData({
                    ...ngoData,
                    [key]: tabName,
                    optional_lang: tabName,
                  });
                }}
                onChanged={(value: string, name: string) => {
                  setNgoData({
                    ...ngoData,
                    [name]: value,
                  });
                }}
                name="name"
                highlightColor="bg-tertiary"
                userData={ngoData}
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
                  setNgoData({
                    ...ngoData,
                    [key]: tabName,
                    optional_lang: tabName,
                  });
                }}
                onChanged={(value: string, name: string) => {
                  setNgoData({
                    ...ngoData,
                    [name]: value,
                  });
                }}
                name="surname"
                highlightColor="bg-tertiary"
                userData={ngoData}
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
              lable={t("contact")}
              placeholder={t("enter_ur_pho_num")}
              defaultValue={ngoData["contact"]}
              type="text"
              name="contact"
              errorMessage={error.get("contact")}
              onChange={handleChange}
            />
            <CustomInput
              size_="sm"
              dir="ltr"
              required={true}
              requiredHint={`* ${t("required")}`}
              className="rtl:text-end"
              lable={t("email")}
              placeholder={t("enter_your_email")}
              defaultValue={ngoData["email"]}
              type="text"
              name="email"
              errorMessage={error.get("email")}
              onChange={handleChange}
            />
            <APICombobox
              placeholderText={t("search_item")}
              errorText={t("no_item")}
              onSelect={(selection: any) =>
                setNgoData({ ...ngoData, ["gender"]: selection })
              }
              lable={t("gender")}
              required={true}
              selectedItem={ngoData["gender"]?.name}
              placeHolder={t("select_a")}
              errorMessage={error.get("gender")}
              apiUrl={"genders"}
              mode="single"
            />

            <APICombobox
              placeholderText={t("search_item")}
              errorText={t("no_item")}
              onSelect={(selection: any) =>
                setNgoData({ ...ngoData, ["nationality"]: selection })
              }
              lable={t("nationality")}
              required={true}
              selectedItem={ngoData["nationality"]?.name}
              placeHolder={t("select_a")}
              errorMessage={error.get("nationality")}
              apiUrl={"countries"}
              mode="single"
            />
            <APICombobox
              placeholderText={t("search_item")}
              errorText={t("no_item")}
              onSelect={(selection: any) =>
                setNgoData({ ...ngoData, ["identity_type"]: selection })
              }
              lable={t("identity_type")}
              required={true}
              selectedItem={ngoData["identity_type"]?.name}
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
              defaultValue={ngoData["nid"]}
              type="text"
              name="nid"
              errorMessage={error.get("nid")}
              onChange={handleChange}
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
                  setNgoData({ ...ngoData, ["province"]: selection })
                }
                lable={t("province")}
                required={true}
                selectedItem={ngoData["province"]?.name}
                placeHolder={t("select_a")}
                errorMessage={error.get("province")}
                apiUrl={"provinces"}
                params={{ country_id: 1 }}
                mode="single"
              />
              {ngoData.province && (
                <APICombobox
                  placeholderText={t("search_item")}
                  errorText={t("no_item")}
                  onSelect={(selection: any) =>
                    setNgoData({ ...ngoData, ["district"]: selection })
                  }
                  lable={t("district")}
                  required={true}
                  selectedItem={ngoData["district"]?.name}
                  placeHolder={t("select_a")}
                  errorMessage={error.get("district")}
                  apiUrl={"districts"}
                  params={{ province_id: ngoData?.province?.id }}
                  mode="single"
                  key={ngoData?.province?.id}
                />
              )}

              {ngoData.district && (
                <MultiTabTextarea
                  title={t("area")}
                  parentClassName="w-full"
                  optionalKey={"optional_lang"}
                  onTabChanged={(key: string, tabName: string) => {
                    setNgoData({
                      ...ngoData,
                      [key]: tabName,
                      optional_lang: tabName,
                    });
                  }}
                  onChanged={(value: string, name: string) => {
                    setNgoData({
                      ...ngoData,
                      [name]: value,
                    });
                  }}
                  name="area"
                  highlightColor="bg-tertiary"
                  userData={ngoData}
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
        )}
      </CardContent>
      <CardFooter>
        {failed ? (
          <PrimaryButton
            onClick={async () => await loadInformation()}
            className="bg-red-500 hover:bg-red-500/70"
          >
            {t("failed_retry")}
            <RefreshCcw className="ltr:ml-2 rtl:mr-2" />
          </PrimaryButton>
        ) : (
          ngoData &&
          hasEdit && (
            <PrimaryButton
              onClick={async () => {
                if (user?.permissions.get(SectionEnum.users)?.edit)
                  await saveData();
              }}
              className={`shadow-lg`}
            >
              <ButtonSpinner loading={loading}>{t("save")}</ButtonSpinner>
            </PrimaryButton>
          )
        )}
      </CardFooter>
    </Card>
  );
}
