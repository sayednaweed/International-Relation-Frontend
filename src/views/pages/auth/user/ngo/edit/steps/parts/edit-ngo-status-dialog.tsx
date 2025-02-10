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
import { useParams } from "react-router";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import { NgoStatus } from "@/database/tables";
import APICombobox from "@/components/custom-ui/combobox/APICombobox";

export interface EditNgoStatusDialogProps {
  onComplete: (ngoStatus: NgoStatus) => void;
  ngoStatus?: NgoStatus;
}
export default function EditNgoStatusDialog(props: EditNgoStatusDialogProps) {
  const { onComplete, ngoStatus } = props;
  const [loading, setLoading] = useState(false);
  const [storing, setStoring] = useState(false);
  const [error, setError] = useState(new Map<string, string>());
  let { id } = useParams();

  const [userData, setUserData] = useState<NgoStatus>({
    id: "",
    ngo_id: "",
    status_type_id: "",
    is_active: "",
    name: "",
    comment: "",
    created_at: "",
    optional_lang: "english",
  });
  const { modelOnRequestHide } = useModelOnRequestHide();
  const { t } = useTranslation();

  const fetch = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get(`ngo/ngoStatus/${ngoStatus?.id}`);
      if (response.status === 200) {
        const ngoStatus = response.data.status;
        setUserData(ngoStatus);
      }
    } catch (error: any) {
      console.log(error);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (ngoStatus) fetch();
  }, []);

  const addOrUpdate = async () => {
    const url = ngoStatus ? "ngo/status/update" : "ngo/status/store";
    const idToPass = ngoStatus ? ngoStatus.id : id;
    try {
      if (loading) return;
      setStoring(true);
      // 1. Validate form
      const passed = await validate(
        [
          {
            name: "name_english",
            rules: ["required", "max:128", "min:5"],
          },
          {
            name: "name_farsi",
            rules: ["required", "max:128", "min:5"],
          },
          {
            name: "name_pashto",
            rules: ["required", "max:128", "min:5"],
          },
          {
            name: "surname_english",
            rules: ["required", "max:128", "min:3"],
          },
          {
            name: "surname_pashto",
            rules: ["required", "max:128", "min:3"],
          },
          {
            name: "surname_farsi",
            rules: ["required", "max:128", "min:3"],
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
            name: "gender",
            rules: ["required"],
          },
          {
            name: "nationality",
            rules: ["required"],
          },
          {
            name: "identity_type",
            rules: ["required"],
          },
          {
            name: "nid",
            rules: ["required"],
          },
          {
            name: "province",
            rules: ["required"],
          },
          {
            name: "district",
            rules: ["required"],
          },
          {
            name: "area_english",
            rules: ["required", "max:128", "min:5"],
          },
          {
            name: "area_farsi",
            rules: ["required", "max:128", "min:5"],
          },
          {
            name: "area_pashto",
            rules: ["required", "max:128", "min:5"],
          },
        ],
        userData,
        setError
      );
      if (!passed) return;
      // 2. Store
      let formData = new FormData();
      if (idToPass) formData.append("id", idToPass.toString());
      formData.append("contents", JSON.stringify(userData));

      const response = await axiosClient.post(url, formData);
      if (response.status === 200) {
        toast({
          toastType: "SUCCESS",
          description: response.data.message,
        });
        onComplete(response.data.ngoStatus);
        modelOnRequestHide();
      }
    } catch (error: any) {
      setServerError(error.response.data.errors, setError);
      console.log(error);
    } finally {
      setStoring(false);
    }
  };
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (userData) setUserData({ ...userData, [name]: value });
  };

  return (
    <Card className="w-full self-center [backdrop-filter:blur(20px)] bg-card dark:bg-card-secondary">
      <CardHeader className="relative text-start">
        <CardTitle className="rtl:text-4xl-rtl ltr:text-3xl-ltr text-tertiary">
          {ngoStatus ? t("edit") : t("add")}
        </CardTitle>
      </CardHeader>
      {loading ? (
        <NastranSpinner className=" mx-auto" />
      ) : (
        <CardContent className="flex flex-col mt-10 w-full md:w-[60%] lg:w-[400px] gap-y-6 pb-12">
          <APICombobox
            placeholderText={t("search_item")}
            errorText={t("no_item")}
            onSelect={(selection: any) => {
              if (ngoStatus)
                setUserData({
                  ...ngoStatus,
                  status_type_id: selection.id,
                  name: selection.name,
                });
            }}
            lable={t("gender")}
            required={true}
            selectedItem={ngoStatus?.name}
            placeHolder={t("select_a")}
            errorMessage={error.get("gender")}
            apiUrl={"genders"}
            mode="single"
          />
        </CardContent>
      )}
      <CardFooter className="flex justify-between">
        <Button
          className="rtl:text-xl-rtl ltr:text-lg-ltr"
          variant="outline"
          onClick={modelOnRequestHide}
        >
          {t("cancel")}
        </Button>
        <PrimaryButton
          disabled={storing || loading}
          onClick={addOrUpdate}
          className={`${storing && "opacity-90"}`}
          type="submit"
        >
          <ButtonSpinner loading={storing}>{t("save")}</ButtonSpinner>
        </PrimaryButton>
      </CardFooter>
    </Card>
  );
}
