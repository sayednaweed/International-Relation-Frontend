import Card from "@/components/custom-ui/card/Card";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { t } from "i18next";
import { ChangeEvent, useEffect, useState } from "react";
import { IStaff, IStaffSingle } from "@/lib/types";
import { setServerError, validate } from "@/validation/validation";
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";
import { StaffEnum } from "@/lib/constants";
import CachedImage from "@/components/custom-ui/image/CachedImage";
import { Pencil } from "lucide-react";
import IconButton from "@/components/custom-ui/button/IconButton";
import { isFile } from "@/validation/utils";
import TechnicalTable from "./parts/technical-table";
import StaffInputs from "./parts/staff-inputs";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";

interface TechnicalSectionProps {
  hasEdit: boolean;
  hasView: boolean;
  hasRemove: boolean;
  hasAdd: boolean;
}
export default function TechnicalSection(props: TechnicalSectionProps) {
  const { hasEdit, hasView, hasRemove, hasAdd } = props;
  const [technical, setTechnical] = useState<IStaff[]>([]);
  const [loading, setLoading] = useState(false);
  const [manipulating, setManipulating] = useState(false);
  const [userData, setUserData] = useState<IStaffSingle>({
    id: "",
    picture: undefined,
    name_english: "",
    name_farsi: "",
    name_pashto: "",
    contact: "",
    email: "",
    optional_lang: "",
    imageUrl: "",
    editable: false,
  });
  const [error, setError] = useState<Map<string, string>>(new Map());

  const initialize = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get("staff/technicalSupports");
      if (response.status == 200) {
        // 1. Add data to list
        const technicalStaff = response.data.technicalStaff;
        setTechnical(technicalStaff as IStaff[]);
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: error.response.data.message,
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    initialize();
  }, []);
  const saveData = async () => {
    if (loading) {
      return;
    }
    setManipulating(true);
    // 1. Validate form
    const passed = await validate(
      [
        {
          name: "name_english",
          rules: ["required", "max:45", "min:3"],
        },
        {
          name: "name_farsi",
          rules: ["required", "max:45", "min:3"],
        },
        {
          name: "name_pashto",
          rules: ["required", "max:45", "min:3"],
        },
        {
          name: "contact",
          rules: ["required"],
        },
        {
          name: "email",
          rules: ["required"],
        },
      ],
      userData,
      setError
    );
    if (!passed) {
      setManipulating(false);
      return;
    }
    // 2. Store
    const formData = new FormData();
    formData.append("id", userData.id);
    formData.append("name_english", userData.name_english);
    formData.append("name_farsi", userData.name_farsi);
    formData.append("name_pashto", userData.name_pashto);
    formData.append("contact", userData.contact);
    formData.append("email", userData.email);
    formData.append("staff_type_id", StaffEnum.technical_support.toString());
    if (userData.picture) formData.append("picture", userData.picture);

    try {
      const url = userData.editable ? "staff/update" : "staff/store";
      const response = await axiosClient.post(url, formData);
      if (response.status == 200) {
        const staff = response.data.staff;

        if (userData.editable) {
          setTechnical((prevTechnical) => {
            return prevTechnical.map((item) =>
              item.id === userData.id ? staff : item
            );
          });
        } else {
          // 1. Add data to list
          setTechnical((prev) => [staff, ...prev]);
        }
        setUserData({
          id: "",
          picture: undefined,
          name_english: "",
          name_farsi: "",
          name_pashto: "",
          contact: "",
          email: "",
          optional_lang: "",
          imageUrl: "",
          editable: false,
        });
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
      setManipulating(false);
    }
  };
  const editOnClick = async (staff: IStaff) => {
    setUserData({
      id: staff.id,
      picture: staff.picture,
      name_english: staff.name_english,
      name_farsi: staff.name_farsi,
      name_pashto: staff.name_pashto,
      contact: staff.contact,
      email: staff.email,
      optional_lang: "",
      imageUrl: "",
      editable: true,
    });
  };

  const deleteOnClick = async (staff: IStaff) => {
    try {
      const response = await axiosClient.delete("staff/" + staff.id);
      if (response.status == 200) {
        const filtered = technical.filter(
          (item: IStaff) => staff.id != item.id
        );
        setTechnical(filtered);
      }
      toast({
        toastType: "SUCCESS",
        title: t("success"),
        description: response.data.message,
      });
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: error.response.data.message,
      });
    }
  };

  const onFileUploadChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;
    const maxFileSize = 2 * 1024 * 1024; // 2MB

    if (!fileInput.files) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: t("No file was chosen"),
      });
      return;
    }

    if (!fileInput.files || fileInput.files.length === 0) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: t("files_list_is_empty"),
      });
      return;
    }

    const file = fileInput.files[0];
    if (file.size >= maxFileSize) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: t("img_size_shou_less_2MB"),
      });
      return;
    }
    /** Type validation */
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: t("ples_sel_vali_img_file"),
      });
      return;
    }

    const imageUrl = URL.createObjectURL(file); // Create a temporary URL for the image
    setUserData({
      ...userData,
      picture: file,
      imageUrl: imageUrl,
    });
    /** Reset file input */
    if (e.currentTarget) {
      e.currentTarget.type = "text";
      e.currentTarget.type = "file"; // Reset to file type
    }
  };
  return (
    <Card className="w-full self-center bg-card">
      <CardHeader className="relative text-start">
        <CardTitle className="rtl:text-4xl-rtl ltr:text-4xl-ltr text-tertiary text-start">
          {t("technical_sup")}
        </CardTitle>
        <CardDescription className="rtl:text-xl-rtl ltr:text-lg-ltr">
          {t("general_desc")}
        </CardDescription>
      </CardHeader>
      <CardContent className=" px-0 pt-0 flex flex-col gap-y-8">
        {loading ? (
          <NastranSpinner />
        ) : (
          <>
            <div className="flex flex-col justify-center gap-y-2">
              {isFile(userData.picture) ? (
                <img
                  src={userData.imageUrl}
                  className="size-[86px] !mt-6 mx-auto shadow-lg border border-primary/30 rounded-full"
                />
              ) : (
                <CachedImage
                  src={userData.picture}
                  alt="Avatar"
                  shimmerClassName="size-[86px] !mt-6 mx-auto shadow-lg border border-primary/30 rounded-full"
                  className="size-[86px] !mt-6 object-center object-cover mx-auto shadow-lg border border-primary/50 rounded-full"
                />
              )}

              <IconButton className="hover:bg-primary/20 transition-all text-primary mx-auto">
                <label
                  className={`flex w-fit gap-x-1 items-center cursor-pointer justify-center`}
                >
                  <Pencil className={`size-[13px] pointer-events-none`} />
                  <h1 className={`rtl:text-lg-rtl ltr:text-md-ltr`}>
                    {t("choose")}
                  </h1>
                  <input
                    type="file"
                    className={`block w-0 h-0`}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      onFileUploadChange(e);
                    }}
                  />
                </label>
              </IconButton>
            </div>
            <StaffInputs
              inputName={"name"}
              setUserData={setUserData}
              userData={userData}
              error={error}
              manipulating={manipulating}
              saveData={saveData}
              hasEdit={hasEdit}
              hasAdd={hasAdd}
            />

            <TechnicalTable
              deleteOnClick={deleteOnClick}
              editOnClick={editOnClick}
              staffs={technical}
              loading={loading}
              hasEdit={hasEdit}
              hasRemove={hasRemove}
              hasView={hasView}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
