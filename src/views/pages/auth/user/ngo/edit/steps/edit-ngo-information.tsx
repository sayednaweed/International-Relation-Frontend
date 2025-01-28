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
import { Address, Country, NgoType, UserPermission } from "@/database/tables";
import { LanguageEnum, SectionEnum } from "@/lib/constants";
import { useParams } from "react-router";
import SingleTabTextarea from "@/components/custom-ui/input/mult-tab/SingleTabTextarea";
import SingleTab from "@/components/custom-ui/input/mult-tab/parts/SingleTab";
import OptionalTabs from "@/components/custom-ui/input/mult-tab/parts/OptionalTab";
import BorderContainer from "@/components/custom-ui/container/BorderContainer";
import CustomDatePicker from "@/components/custom-ui/DatePicker/CustomDatePicker";
import { DateObject } from "react-multi-date-picker";
import { ValidateItem } from "@/validation/types";
interface EditNgoInformationProps {
  registration_no: string;
  name_english: string | undefined;
  name_pashto: string;
  name_farsi: string;
  abbr: string;
  ngo_type: NgoType;
  contact: string;
  email: string;
  place_of_establishment: Country | undefined;
  moe_registration_no: string | undefined;
  address: Address;
  establishment_date: DateObject | undefined;
  last_agreement_date: DateObject | undefined;
  status: boolean;
  optional_lang: string;
}
export default function EditNgoInformation() {
  const { user } = useUserAuthState();
  const { t } = useTranslation();
  let { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [error, setError] = useState<Map<string, string>>(new Map());
  const [ngoData, setNgoData] = useState<EditNgoInformationProps>();

  const per: UserPermission | undefined = user?.permissions.get(
    SectionEnum.ngo
  );
  const hasEdit = per ? per?.edit : false;

  const loadInformation = async () => {
    try {
      // const response = await axiosClient.get(`ngo/details/${id}`);
      // if (response.status == 200) {
      // const details = response.data.ngo_details;
      setNgoData({
        registration_no: "",
        name_english: "",
        name_pashto: "",
        name_farsi: "",
        abbr: "",
        ngo_type: {
          id: "",
          name: "",
          created_at: "",
        },
        contact: "",
        email: "",
        moe_registration_no: "",
        place_of_establishment: undefined,
        address: {
          id: "",
          country: {
            id: "",
            name: "",
          },
          province: {
            id: "",
            name: "",
          },
          district: {
            id: "",
            name: "",
          },
          area: "",
        },
        establishment_date: true ? undefined : new DateObject(new Date()),
        last_agreement_date: true ? undefined : new DateObject(new Date()),
        status: true,
        optional_lang: "farsi",
      });
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
            <CustomInput
              required={true}
              lable={t("registration_no")}
              requiredHint={`* ${t("required")}`}
              size_="sm"
              name="registration_no"
              defaultValue={ngoData.registration_no}
              placeholder={t("enter_your_name")}
              type="text"
              errorMessage={error.get("registration_no")}
              onBlur={handleChange}
            />
            <SingleTabTextarea
              onTabChanged={(
                key: string,
                data: string,
                isOptional: boolean,
                optionalLang: string
              ) => {
                setNgoData({
                  ...ngoData,
                  [key]: data,
                  optional_lang: isOptional
                    ? optionalLang
                    : ngoData.optional_lang,
                });
              }}
              onChanged={(value: string, name: string) => {
                setNgoData({
                  ...ngoData,
                  [name]: value,
                });
              }}
              name="name"
              title={t("name")}
              highlightColor="bg-tertiary"
              userData={ngoData}
              errorData={error}
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
            <APICombobox
              placeholderText={t("search_item")}
              errorText={t("no_item")}
              onSelect={(selection: any) => {
                setNgoData({ ...ngoData, ngo_type: selection });
              }}
              lable={t("ngo_type")}
              required={true}
              selectedItem={ngoData?.ngo_type?.name}
              placeHolder={t("select_a")}
              errorMessage={error.get("ngo_type")}
              apiUrl={"ngo_type"}
              mode="single"
            />
            <CustomInput
              required={true}
              lable={t("abbr")}
              requiredHint={`* ${t("required")}`}
              size_="sm"
              name="registration_no"
              defaultValue={ngoData.registration_no}
              placeholder={t("abbr_english")}
              type="text"
              errorMessage={error.get("registration_no")}
              onBlur={handleChange}
            />
            <CustomInput
              required={true}
              lable={t("contact")}
              requiredHint={`* ${t("required")}`}
              size_="sm"
              name="contact"
              defaultValue={ngoData.contact}
              placeholder={t("enter_your_contact")}
              type="text"
              errorMessage={error.get("contact")}
              onBlur={handleChange}
            />
            <CustomInput
              required={true}
              lable={t("email")}
              requiredHint={`* ${t("required")}`}
              size_="sm"
              name="email"
              defaultValue={ngoData.email}
              placeholder={t("enter_your_email")}
              type="text"
              errorMessage={error.get("email")}
              onBlur={handleChange}
            />
            <CustomInput
              required={true}
              lable={t("moe_registration_no")}
              requiredHint={`* ${t("required")}`}
              size_="sm"
              name="moe_registration_no"
              defaultValue={ngoData.moe_registration_no}
              placeholder={`${t("enter")} ${t("moe_registration_no")}`}
              type="text"
              errorMessage={error.get("moe_registration_no")}
              onBlur={handleChange}
            />
            <APICombobox
              placeholderText={t("search_item")}
              errorText={t("no_item")}
              onSelect={(selection: any) =>
                setNgoData({
                  ...ngoData,
                  place_of_establishment: selection,
                })
              }
              lable={t("place_of_establishment")}
              required={true}
              requiredHint={`* ${t("required")}`}
              selectedItem={ngoData.place_of_establishment?.name}
              placeHolder={t("select_destination")}
              errorMessage={error.get("place_of_establishment")}
              apiUrl={"destinations"}
              mode="single"
            />
            <CustomDatePicker
              placeholder={t("select_a_date")}
              lable={t("establishment_date")}
              requiredHint={`* ${t("required")}`}
              required={true}
              value={ngoData.establishment_date}
              dateOnComplete={(date: DateObject) => {
                setNgoData({ ...ngoData, establishment_date: date });
              }}
              className="py-3 w-full"
              errorMessage={error.get("establishment_date")}
            />
            <CustomDatePicker
              placeholder={t("select_a_date")}
              lable={t("last_agreement_date")}
              requiredHint={`* ${t("required")}`}
              required={true}
              value={ngoData.last_agreement_date}
              dateOnComplete={(date: DateObject) => {
                setNgoData({ ...ngoData, last_agreement_date: date });
              }}
              className="py-3 w-full"
              errorMessage={error.get("last_agreement_date")}
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
                onSelect={(selection: any) => {
                  let address = ngoData.address;
                  address.province = selection;
                  setNgoData({ ...ngoData, address: address });
                }}
                lable={t("province")}
                required={true}
                selectedItem={ngoData?.address?.province?.name}
                placeHolder={t("select_a")}
                errorMessage={error.get("province")}
                apiUrl={"provinces"}
                mode="single"
              />
              {ngoData?.address?.province && (
                <APICombobox
                  placeholderText={t("search_item")}
                  errorText={t("no_item")}
                  onSelect={(selection: any) => {
                    let address = ngoData.address;
                    address.district = selection;
                    setNgoData({ ...ngoData, address: address });
                  }}
                  lable={t("district")}
                  required={true}
                  requiredHint={`* ${t("required")}`}
                  selectedItem={ngoData.address.district.name}
                  placeHolder={t("select_a")}
                  errorMessage={error.get("district")}
                  apiUrl={"districts"}
                  params={{ provinceId: ngoData.address?.province?.id }}
                  mode="single"
                  key={ngoData?.address.province?.id}
                />
              )}
              {ngoData?.address?.district && (
                <CustomInput
                  required={true}
                  size_="sm"
                  lable={t("area")}
                  name="area"
                  defaultValue={ngoData?.address?.area}
                  placeholder={t("area")}
                  type="text"
                  parentClassName="w-full"
                  errorMessage={error.get("area")}
                  onChange={(e: any) => {
                    const { value } = e.target;
                    let address = ngoData.address;
                    address.area = value;
                    setNgoData({ ...ngoData, address: address });
                  }}
                />
              )}
            </BorderContainer>
            {/* <CustomCheckbox
              checked={tempUserData["grant"]}
              onCheckedChange={(value: boolean) =>
                setTempUserData({ ...tempUserData, grant: value })
              }
              parentClassName="rounded-md py-[12px] gap-x-1 bg-card border px-[10px]"
              text={t("grant")}
              description={t("allows_user_grant")}
              errorMessage={error.get("grant")}
            />  */}
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
