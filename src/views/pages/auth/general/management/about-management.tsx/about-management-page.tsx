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
import { About } from "@/database/tables";
import axiosClient from "@/lib/axois-client";
import { validate } from "@/validation/validation";

import { t } from "i18next";
import { useEffect, useState } from "react";

import Input from "@/components/custom-ui/input/CustomInput";

import DirectorSection from "./sections/director-section";
import ManagerSection from "./sections/manager-section";
import OfficeInfo from "./sections/office-info";

export interface AboutProps {
  onComplete: (about: About) => void;
  about?: About;
}
export default function AboutManagementPage(props: AboutProps) {
  const [details, setDetails] = useState({
    name: "",
    contact: "",
    profile_pic: "",
  });
  const { onComplete, about } = props;
  const [profiles, setProfiles] = useState<any[]>([]);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(new Map<string, string>());
  const { modelOnRequestHide } = useModelOnRequestHide();
  const [abouts, setAbouts] = useState<{
    unFilterList: About[];
    filterList: About[];
  }>({
    unFilterList: [],
    filterList: [],
  });
  const initialize = async () => {
    try {
      if (loading) return;
      setLoading(true);

      // 2. Send data
      const response = await axiosClient.get(`abouts`);
      const fetch = response.data as About[];
      setAbouts({
        unFilterList: fetch,
        filterList: fetch,
      });
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: error.response.data.message,
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    initialize();
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

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
        details,
        setError
      );
      if (!passed) return;
      // 2. Store
      let formData = new FormData();
      formData.append("name", details.name);
      formData.append("contact", details.contact);
      formData.append("profile_pic", details.profile_pic);
      const response = await axiosClient.post("about/store", formData);
      if (response.status === 200) {
        toast({
          toastType: "SUCCESS",
          description: response.data.message,
        });
        onComplete(response.data.about);
        modelOnRequestHide();
      }
    } catch (error: any) {
      setServerError(error.response.data.errors, setError);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const updates = async () => {
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
        details,
        setError
      );
      if (!passed) return;
      // 2. update
      let formData = new FormData();
      if (about?.id) formData.append("id", about.id);
      formData.append("name", details.name);
      formData.append("contact", details.contact);
      formData.append("profile_pic", details.profile_pic);
      const response = await axiosClient.post(`about/update`, formData);
      if (response.status === 200) {
        toast({
          toastType: "SUCCESS",
          description: response.data.message,
        });
        onComplete(response.data.about);
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

  const handleEditRow = (index: number) => {
    const profile = profiles[index];
    setDetails({ ...profile });
    setEditingRow(index);
  };

  const handleSaveEdit = () => {
    if (editingRow !== null) {
      const updatedProfiles = [...profiles];
      updatedProfiles[editingRow] = { ...details };
      setProfiles(updatedProfiles);
      setEditingRow(null);
      setDetails({ name: "", contact: "", profile_pic: "" });
    }
  };

  const update = (about: About) => {
    setAbouts((prevState) => {
      const updatedUnFiltered = prevState.unFilterList.map((item) =>
        item.id === about.id ? { ...item, name: about.name } : item
      );
      const remove = async (about: About) => {
        try {
          // 1. Remove from backend
          const response = await axiosClient.delete(`about/${about.id}`);
          if (response.status === 200) {
            // 2. Remove from frontend
            setAbouts((prevJobs) => ({
              unFilterList: prevJobs.unFilterList.filter(
                (item) => item.id !== about.id
              ),
              filterList: prevJobs.filterList.filter(
                (item) => item.id !== about.id
              ),
            }));
            toast({
              toastType: "SUCCESS",
              description: response.data.message,
            });
          }
        } catch (error: any) {
          console.log(error);
        }
      };
      return {
        ...prevState,
        unFilterList: updatedUnFiltered,
        filterList: updatedUnFiltered,
      };
    });
  };

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
                defaultFile={details.profile_pic}
                errorMessage={error?.get("profile_pic")}
                onchange={(file: File | undefined) => handleChange(file)}
                validTypes={["image/png", "image/jpeg", "image/gif"]}
                maxSize={2}
                accept="image/png, image/jpeg, image/gif"
              />
              <CustomInput
                size_="lg"
                lable={t("name")}
                type="text"
                className="w-[400px]"
                value={details.name}
                name="name"
                onChange={handleChange}
              />
              <CustomInput
                size_="lg"
                type="number"
                className="w-[400px]"
                lable={t("contact")}
                name="contact"
                value={details.contact}
                onChange={handleChange}
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
                        <PrimaryButton onClick={about ? updates : store}>
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
              <PrimaryButton onClick={handleSaveEdit}>
                {t("save")}
              </PrimaryButton>
            )}
          </div>
        </CardContent>
      </Card>
      <DirectorSection />
      <ManagerSection />
      <OfficeInfo />
    </form>
  );
}
