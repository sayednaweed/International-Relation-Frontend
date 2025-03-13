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
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";
import { setServerError, validate } from "@/validation/validation";
import { CheckList } from "@/database/tables";
import BorderContainer from "@/components/custom-ui/container/BorderContainer";
import MultiTabInput from "@/components/custom-ui/input/mult-tab/MultiTabInput";
import SingleTab from "@/components/custom-ui/input/mult-tab/parts/SingleTab";
import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import CustomCheckbox from "@/components/custom-ui/checkbox/CustomCheckbox";
import CustomTextarea from "@/components/custom-ui/input/CustomTextarea";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import { Option } from "@/lib/types";
import MultipleSelector from "@/components/custom-ui/select/MultipleSelector";

export interface ChecklistDialogProps {
  onComplete: (checkList: CheckList) => void;
  checklist?: CheckList;
}
const defaultExtensions = [
  {
    name: "pdf",
    label: "PDF",
    frontEndName: "application/pdf",
  },
  {
    name: "jpg",
    label: "JPG",
    frontEndName: "image/jpg",
  },
  {
    name: "png",
    label: "PNG",
    frontEndName: "image/png",
  },
  {
    name: "jpeg",
    label: "JPEG",
    frontEndName: "image/jpeg",
  },
  {
    name: "ppt",
    label: "PPT",
    frontEndName: "application/vnd.ms-powerpoint",
  },
  {
    name: "pptx",
    label: "PPTX",
    frontEndName:
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  },
];
export default function ChecklistDialog(props: ChecklistDialogProps) {
  const { onComplete, checklist } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(new Map<string, string>());
  const [userData, setUserData] = useState<{
    name_farsi: string;
    name_english: string;
    name_pashto: string;
    file_size: number;
    optional_lang: string;
    type:
      | {
          id: string;
          name: string;
        }
      | undefined;
    status: boolean;
    detail: string;
    file_type: Option[];
  }>({
    name_english: "",
    name_farsi: "",
    name_pashto: "",
    optional_lang: "",
    type: undefined,
    status: true,
    file_size: 512,
    detail: "",
    file_type: [],
  });
  const { modelOnRequestHide } = useModelOnRequestHide();
  const { t } = useTranslation();

  const fetch = async () => {
    try {
      const response = await axiosClient.get(`ngo-checklist/${checklist?.id}`);
      if (response.status === 200) {
        setUserData(response.data);
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (checklist) fetch();
  }, []);
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  const store = async () => {
    try {
      if (loading) return;
      setLoading(true);
      // 1. Validate form
      const passed = await validate(
        [
          {
            name: "name_english",
            rules: ["required"],
          },
          {
            name: "name_farsi",
            rules: ["required"],
          },
          {
            name: "name_pashto",
            rules: ["required"],
          },
          {
            name: "file_size",
            rules: ["required"],
          },
          {
            name: "type",
            rules: ["required"],
          },
          {
            name: "status",
            rules: ["required"],
          },
          {
            name: "file_type",
            rules: ["required"],
          },
        ],
        userData,
        setError
      );
      if (!passed) return;
      const response = await axiosClient.post("checklist/store", {
        ...userData,
      });
      if (response.status === 200) {
        toast({
          toastType: "SUCCESS",
          description: response.data.message,
        });
        onComplete(response.data.checklist);
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
            name: "name_english",
            rules: ["required"],
          },
          {
            name: "name_farsi",
            rules: ["required"],
          },
          {
            name: "name_pashto",
            rules: ["required"],
          },
          {
            name: "file_size",
            rules: ["required"],
          },
          {
            name: "type",
            rules: ["required"],
          },
          {
            name: "status",
            rules: ["required"],
          },
          {
            name: "file_type",
            rules: ["required"],
          },
        ],
        userData,
        setError
      );
      if (!passed) return;
      // 2. update
      const response = await axiosClient.post(`checklist/update`, {
        ...userData,
        id: checklist?.id,
      });
      if (response.status === 200) {
        toast({
          toastType: "SUCCESS",
          description: response.data.message,
        });
        onComplete(response.data.checklist);
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
    <Card className="w-full lg:w-1/2 2xl:w-1/3 self-center my-8 [backdrop-filter:blur(20px)] bg-card dark:bg-card-secondary">
      <CardHeader className="relative text-start">
        <CardTitle className="rtl:text-4xl-rtl ltr:text-3xl-ltr text-tertiary">
          {checklist ? t("edit") : t("add")}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-stretch gap-y-4">
        <BorderContainer
          title={t("name")}
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
            name="name"
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
        <APICombobox
          placeholderText={t("search_item")}
          errorText={t("no_item")}
          onSelect={(selection: any) =>
            setUserData({ ...userData, ["type"]: selection })
          }
          lable={t("type")}
          required={true}
          selectedItem={userData["type"]?.name}
          placeHolder={t("select_a")}
          errorMessage={error.get("type")}
          apiUrl={"ngo/checklist/types"}
          mode="single"
          requiredHint={`* ${t("required")}`}
        />
        <CustomInput
          size_="sm"
          required={true}
          requiredHint={`* ${t("required")}`}
          lable={t("file_size")}
          placeholder={t("detail")}
          defaultValue={userData["file_size"]}
          type="number"
          name="file_size"
          errorMessage={error.get("file_size")}
          onChange={handleChange}
        />
        <MultipleSelector
          commandProps={{
            label: "Select frameworks",
          }}
          onChange={(option: Option[]) => {
            setUserData({
              ...userData,
              file_type: option,
            });
          }}
          defaultOptions={defaultExtensions as Option[]}
          label={t("file_type")}
          errorMessage={error.get("file_type")}
          selectedOptions={userData.file_type}
          required={true}
          requiredHint={`* ${t("required")}`}
          placeholder={t("select_a")}
          emptyIndicator={<p className="text-center text-sm">{t("no_item")}</p>}
        />
        <CustomCheckbox
          checked={userData["status"]}
          onCheckedChange={(value: boolean) =>
            setUserData({ ...userData, status: value })
          }
          parentClassName="rounded-md py-[12px] gap-x-1 bg-card border px-[10px]"
          text={t("status")}
          required={true}
          requiredHint={`* ${t("required")}`}
          errorMessage={error.get("status")}
        />
        <CustomTextarea
          defaultValue={userData["detail"]}
          errorMessage={error.get("detail")}
          onChange={handleChange}
          name="detail"
          placeholder={t("detail")}
          rows={5}
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          className="rtl:text-xl-rtl ltr:text-lg-ltr"
          variant="outline"
          onClick={modelOnRequestHide}
        >
          {t("cancel")}
        </Button>
        <PrimaryButton
          disabled={loading}
          onClick={checklist ? update : store}
          className={`${loading && "opacity-90"}`}
          type="submit"
        >
          <ButtonSpinner loading={loading}>{t("save")}</ButtonSpinner>
        </PrimaryButton>
      </CardFooter>
    </Card>
  );
}
