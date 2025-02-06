import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useModelOnRequestHide } from "@/components/custom-ui/model/hook/useModelOnRequestHide";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import ButtonSpinner from "@/components/custom-ui/spinner/ButtonSpinner";
import { useEffect, useState } from "react";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";
import { setServerError, validate } from "@/validation/validation";
import {
  Country,
  District,
  Gender,
  Job,
  NidType,
  Province,
} from "@/database/tables";
import { DateObject } from "react-multi-date-picker";
import BorderContainer from "@/components/custom-ui/container/BorderContainer";
import MultiTabInput from "@/components/custom-ui/input/mult-tab/MultiTabInput";
import { useParams } from "react-router";
import { IDirector } from "@/lib/types";
import SingleTab from "@/components/custom-ui/input/mult-tab/parts/SingleTab";
import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import MultiTabTextarea from "@/components/custom-ui/input/mult-tab/MultiTabTextarea";

interface EditNgoDirector {
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
export interface AddDirectorDialogProps {
  onComplete: (director: IDirector) => void;
  job?: Job;
}
export default function AddDirectorDialog(props: AddDirectorDialogProps) {
  const { onComplete, job } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(new Map<string, string>());
  const [director, setDirector] = useState<EditNgoDirector>();
  let { id } = useParams();

  const { modelOnRequestHide } = useModelOnRequestHide();
  const { t } = useTranslation();

  const fetch = async () => {
    try {
      const response = await axiosClient.get(`add/ngo/director/${id}`);
      if (response.status === 200) {
        const director = response.data.director;
        onComplete(director);
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (job) fetch();
  }, []);
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (director) setDirector({ ...director, [name]: value });
  };
  const store = async () => {
    try {
      if (loading) return;
      setLoading(true);
      // 1. Validate form
      const passed = await validate(
        [
          {
            name: "English",
            rules: ["required"],
          },
          {
            name: "Farsi",
            rules: ["required"],
          },
          {
            name: "Pashto",
            rules: ["required"],
          },
        ],
        director,
        setError
      );
      if (!passed) return;
      // 2. Store
      let formData = new FormData();

      const response = await axiosClient.post("job/store", formData);
      if (response.status === 200) {
        toast({
          toastType: "SUCCESS",
          description: response.data.message,
        });
        onComplete(response.data.job);
        modelOnRequestHide();
      }
    } catch (error: any) {
      setServerError(error.response.data.errors, setError);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const update = async () => {
    try {
      if (loading) return;
      setLoading(true);
      // 1. Validate form
      const passed = await validate(
        [
          {
            name: "English",
            rules: ["required"],
          },
          {
            name: "Farsi",
            rules: ["required"],
          },
          {
            name: "Pashto",
            rules: ["required"],
          },
        ],
        director,
        setError
      );
      if (!passed) return;
      // 2. update
      let formData = new FormData();
      if (job?.id) formData.append("id", job.id);

      const response = await axiosClient.post(`job/update`, formData);
      if (response.status === 200) {
        toast({
          toastType: "SUCCESS",
          description: response.data.message,
        });
        onComplete(response.data.job);
        modelOnRequestHide();
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        description: error.response.data.message,
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-fit min-w-[400px] self-center [backdrop-filter:blur(20px)] bg-white/70 dark:!bg-black/40">
      <CardHeader className="relative text-start">
        <CardTitle className="rtl:text-4xl-rtl ltr:text-3xl-ltr text-tertiary">
          {job ? t("Edit") : t("Add")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!director ? (
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
                  setDirector({
                    ...director,
                    [key]: tabName,
                    optional_lang: tabName,
                  });
                }}
                onChanged={(value: string, name: string) => {
                  setDirector({
                    ...director,
                    [name]: value,
                  });
                }}
                name="name"
                highlightColor="bg-tertiary"
                userData={director}
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
                  setDirector({
                    ...director,
                    [key]: tabName,
                    optional_lang: tabName,
                  });
                }}
                onChanged={(value: string, name: string) => {
                  setDirector({
                    ...director,
                    [name]: value,
                  });
                }}
                name="surname"
                highlightColor="bg-tertiary"
                userData={director}
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
              defaultValue={director["contact"]}
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
              defaultValue={director["email"]}
              type="text"
              name="email"
              errorMessage={error.get("email")}
              onChange={handleChange}
            />
            <APICombobox
              placeholderText={t("search_item")}
              errorText={t("no_item")}
              onSelect={(selection: any) =>
                setDirector({ ...director, ["gender"]: selection })
              }
              lable={t("gender")}
              required={true}
              selectedItem={director["gender"]?.name}
              placeHolder={t("select_a")}
              errorMessage={error.get("gender")}
              apiUrl={"genders"}
              mode="single"
            />

            <APICombobox
              placeholderText={t("search_item")}
              errorText={t("no_item")}
              onSelect={(selection: any) =>
                setDirector({ ...director, ["nationality"]: selection })
              }
              lable={t("nationality")}
              required={true}
              selectedItem={director["nationality"]?.name}
              placeHolder={t("select_a")}
              errorMessage={error.get("nationality")}
              apiUrl={"countries"}
              mode="single"
            />
            <APICombobox
              placeholderText={t("search_item")}
              errorText={t("no_item")}
              onSelect={(selection: any) =>
                setDirector({ ...director, ["identity_type"]: selection })
              }
              lable={t("identity_type")}
              required={true}
              selectedItem={director["identity_type"]?.name}
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
              defaultValue={director["nid"]}
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
                  setDirector({ ...director, ["province"]: selection })
                }
                lable={t("province")}
                required={true}
                selectedItem={director["province"]?.name}
                placeHolder={t("select_a")}
                errorMessage={error.get("province")}
                apiUrl={"provinces"}
                params={{ country_id: 1 }}
                mode="single"
              />
              {director.province && (
                <APICombobox
                  placeholderText={t("search_item")}
                  errorText={t("no_item")}
                  onSelect={(selection: any) =>
                    setDirector({ ...director, ["district"]: selection })
                  }
                  lable={t("district")}
                  required={true}
                  selectedItem={director["district"]?.name}
                  placeHolder={t("select_a")}
                  errorMessage={error.get("district")}
                  apiUrl={"districts"}
                  params={{ province_id: director?.province?.id }}
                  mode="single"
                  key={director?.province?.id}
                />
              )}

              {director.district && (
                <MultiTabTextarea
                  title={t("area")}
                  parentClassName="w-full"
                  optionalKey={"optional_lang"}
                  onTabChanged={(key: string, tabName: string) => {
                    setDirector({
                      ...director,
                      [key]: tabName,
                      optional_lang: tabName,
                    });
                  }}
                  onChanged={(value: string, name: string) => {
                    setDirector({
                      ...director,
                      [name]: value,
                    });
                  }}
                  name="area"
                  highlightColor="bg-tertiary"
                  userData={director}
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
      <CardFooter className="flex justify-between">
        <Button
          className="rtl:text-xl-rtl ltr:text-lg-ltr"
          variant="outline"
          onClick={modelOnRequestHide}
        >
          {t("Cancel")}
        </Button>
        <PrimaryButton
          disabled={loading}
          onClick={job ? update : store}
          className={`${loading && "opacity-90"}`}
          type="submit"
        >
          <ButtonSpinner loading={loading}>{t("Save")}</ButtonSpinner>
        </PrimaryButton>
      </CardFooter>
    </Card>
  );
}
