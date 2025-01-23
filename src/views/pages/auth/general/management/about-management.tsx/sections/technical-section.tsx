import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import Card from "@/components/custom-ui/card/Card";
import FileChooser from "@/components/custom-ui/chooser/FileChooser";
import CachedImage from "@/components/custom-ui/image/CachedImage";
import { useModelOnRequestHide } from "@/components/custom-ui/model/hook/useModelOnRequestHide";
import CustomInput from "@/components/custom-ui/input/CustomInput";

import { setServerError } from "@/validation/validation";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";

import axiosClient from "@/lib/axois-client";
import { validate } from "@/validation/validation";

import { t } from "i18next";
import { useState } from "react";

import SingleTab from "@/components/custom-ui/input/mult-tab/parts/SingleTab";
import MultiTabTextarea from "@/components/custom-ui/input/mult-tab/MultiTabTextarea";
import AboutManagementPage from "../about-management-page";
interface IStaff {
  profile: File | undefined;
  address_english: string;
  address_farsi: string;
  address_pashto: string;
  name: string;
  contact: string;
  email: string;
}
interface IAbout {
  office: {
    address_english: string;
    address_farsi: string;
    address_pashto: string;
    contact: string;
    email: string;
  };
  director: IStaff;
  manager: IStaff;
  technicalSupport: IStaff[];
}

export default function TechnicalSection() {
  const [about, setAbout] = useState<IAbout>({
    office: {
      address_english: "",
      address_farsi: "",
      address_pashto: "",
      contact: "",
      email: "",
    },
    director: {
      profile: undefined,
      address_english: "",
      address_farsi: "",
      address_pashto: "",
      name: "",
      contact: "",
      email: "",
    },
    manager: {
      profile: undefined,
      address_english: "",
      address_farsi: "",
      address_pashto: "",
      name: "",
      contact: "",
      email: "",
    },
    technicalSupport: [],
  });

  const [profiles, setProfiles] = useState<any[]>([]);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(new Map<string, string>());
  const { modelOnRequestHide } = useModelOnRequestHide();

  const store = async () => {
    try {
      if (loading) return;
      setLoading(true);
      // 1. Validate form
      const passed = await validate(
        [
          {
            name: "name",
            rules: ["required"],
          },
          {
            name: "contact",
            rules: ["required"],
          },
          {
            name: "profile_pic",
            rules: ["required"],
          },
        ],
        AboutManagementPage,
        setError
      );
      if (!passed) return;
      // 2. Store
      let formData = new FormData();
      formData.append("name", about.director.name);
      formData.append("contact", about.director.contact);
      // formData.append("profile_pic", about.director.profile);
      const response = await axiosClient.post("about/store", formData);
      if (response.status === 200) {
        toast({
          toastType: "SUCCESS",
          description: response.data.message,
        });
        // onComplete(response.data.about);
        modelOnRequestHide();
      }
    } catch (error: any) {
      setServerError(error.response.data.errors, setError);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // const updates = async () => {
  //   try {
  //     if (loading) return;
  //     setLoading(true);
  //     // 1. Validate form
  //     const passed = await validate(
  //       [
  //         {
  //           name: "name",
  //           rules: ["required"],
  //         },
  //         {
  //           name: "contact",
  //           rules: ["required"],
  //         },
  //         {
  //           name: "profile_pic",
  //           rules: ["required"],
  //         },
  //       ],
  //       about,
  //       setError
  //     );
  //     if (!passed) return;
  //     // 2. update
  //     let formData = new FormData();
  //     if (about?.id) formData.append("id", about.id);
  //     formData.append("name", about.director.name);
  //     formData.append("contact", details.contact);
  //     formData.append("profile_pic", details.profile_pic);
  //     const response = await axiosClient.post(`about/update`, formData);
  //     if (response.status === 200) {
  //       toast({
  //         toastType: "SUCCESS",
  //         description: response.data.message,
  //       });
  //       onComplete(response.data.about);
  //       modelOnRequestHide();
  //     }
  //   } catch (error: any) {
  //     toast({
  //       toastType: "ERROR",
  //       description: error.response.data.message,
  //     });
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <form action="">
      <Card className="w-full self-center [backdrop-filter:blur(20px)] bg-white/70 dark:!bg-black/40">
        <CardHeader className="relative text-start">
          <CardTitle className="rtl:text-4xl-rtl ltr:text-4xl-ltr text-tertiary text-start">
            {t("technical_sup")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row justify-between">
            <div className="flex flex-col justify-center items-center">
              <FileChooser
                parentClassName="mt-6 mb-6 w-full md:w-[60%] lg:w-[392px]"
                lable={t("profile_pic")}
                required={true}
                requiredHint={`* ${t("required")}`}
                defaultFile={about.director.profile}
                errorMessage={error?.get("profile_pic")}
                onchange={(file: File | undefined) => {
                  ("");
                }}
                validTypes={["image/png", "image/jpeg", "image/gif"]}
                maxSize={2}
                accept="image/png, image/jpeg, image/gif"
              />

              <MultiTabTextarea
                optionalKey={"optional_lang"}
                onTabChanged={(key: string, tabName: string) => {
                  setAbout({
                    ...about,
                    [key]: tabName,
                    // optional_lang: tabName,
                  });
                }}
                onChanged={(value: string, name: string) => {
                  setAbout({
                    ...about,
                    [name]: value,
                  });
                }}
                name="name"
                highlightColor="bg-tertiary"
                userData={about.technicalSupport}
                errorData={error}
                placeholder={t("detail")}
                rows={1}
                className="rtl:text-xl-rtl rounded-none border-t border-x-0 w-[400px]"
                tabsClassName="gap-x-5 px-3"
              >
                <SingleTab>english</SingleTab>
                <SingleTab>farsi</SingleTab>
                <SingleTab>pashto</SingleTab>
              </MultiTabTextarea>
              <CustomInput
                size_="lg"
                type="number"
                className="w-[400px]"
                lable={t("contact")}
                name="contact"
                value={about.director.contact}
                onChange={() => {}}
              />
            </div>
            <div className="relative rounded-xl overflow-auto p-8">
              <Table className="bg-card rounded-md my-[2px] py-8 w-[400px]">
                <TableHeader className="rtl:text-3xl-rtl ltr:text-xl-ltr">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-center px-1 w-[80px]">
                      {t("profile")}
                    </TableHead>
                    <TableHead className="text-start">{t("name")}</TableHead>
                    <TableHead className="text-start">{t("contact")}</TableHead>
                    <TableHead className="text-center">
                      {t("actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="rtl:text-xl-rtl ltr:text-2xl-ltr">
                  {profiles.map((profile, index) => (
                    <TableRow key={index} className="hover:bg-transparent">
                      <TableCell className="px-1 py-0">
                        <CachedImage
                          src={profile.profile_pic || ""}
                          alt="Avatar"
                          iconClassName="size-[18px]"
                          loaderClassName="size-[36px] mx-auto shadow-lg border border-tertiary rounded-full"
                          className="size-[36px] object-center object-cover mx-auto shadow-lg border border-tertiary rounded-full"
                        />
                      </TableCell>
                      <TableCell className="text-start">
                        {profile.name}
                      </TableCell>
                      <TableCell className="text-start">
                        {profile.contact}
                      </TableCell>
                      <TableCell className="text-center">
                        <PrimaryButton onClick={() => {}}>
                          {t("edit")}
                        </PrimaryButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className=" mt-10">
            {editingRow === null ? (
              <PrimaryButton onClick={(e) => {}}>{t("save")}</PrimaryButton>
            ) : (
              <PrimaryButton onClick={() => {}}>{t("save")}</PrimaryButton>
            )}
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
