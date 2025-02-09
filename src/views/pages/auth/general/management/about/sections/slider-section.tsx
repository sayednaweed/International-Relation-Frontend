import Card from "@/components/custom-ui/card/Card";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { t } from "i18next";
import { ChangeEvent, useEffect, useState } from "react";

import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";

import CachedImage from "@/components/custom-ui/image/CachedImage";
import { Pencil } from "lucide-react";
import IconButton from "@/components/custom-ui/button/IconButton";
import { isFile } from "@/validation/utils";

import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
type SliderProps = {
  id: string;
  picture: string;
};
type PictureDataProps = {
  id: string;
  picture: File | undefined | string;
  imageUrl: string;
  editable: boolean;
};
export default function SliderSection() {
  const [slider, setSlider] = useState<SliderProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [pictureData, setPictureData] = useState<PictureDataProps>({
    id: "",
    picture: undefined,
    imageUrl: "",
    editable: false,
  });

  const initialize = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get("staff/slider");
      if (response.status == 200) {
        // 1. Add data to list
        const technicalStaff = response.data.technicalStaff;
        setSlider(technicalStaff as SliderProps[]);
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

    // 2. Store
    const formData = new FormData();

    if (pictureData.picture) formData.append("picture", pictureData.picture);

    try {
      const url = pictureData.editable ? "slider/update" : "slider/store";
      const response = await axiosClient.post(url, formData);
      if (response.status == 200) {
        const slider = response.data.staff;

        // 1. Add data to list
        setSlider((prev) => [slider, ...prev]);

        setPictureData({
          id: "",
          picture: undefined,
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
      console.log(error);
    } finally {
    }
  };

  // const deleteOnClick = async (slider: SliderProps) => {
  //   try {
  //     const response = await axiosClient.delete("staff/" + slider.id);
  //     if (response.status == 200) {
  //       const filtered: any = slider.filter(
  //         (item: SliderProps) => slider.id != item.id
  //       );
  //       setSlider(filtered);
  //     }
  //     toast({
  //       toastType: "SUCCESS",
  //       title: t("success"),
  //       description: response.data.message,
  //     });
  //   } catch (error: any) {
  //     toast({
  //       toastType: "ERROR",
  //       title: t("error"),
  //       description: error.response.data.message,
  //     });
  //   }
  // };

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
    setPictureData({
      ...pictureData,
      picture: file,
      imageUrl: imageUrl,
    });
    /** Reset file input */
    if (e.currentTarget) {
      e.currentTarget.type = "file"; // Reset to file type
    }
  };
  return (
    <Card className="w-full self-center bg-card">
      <CardHeader className="relative text-start">
        <CardTitle className="rtl:text-4xl-rtl ltr:text-4xl-ltr text-tertiary text-start">
          {t("slider")}
        </CardTitle>
        <CardDescription className="rtl:text-xl-rtl ltr:text-lg-ltr">
          {t("general_desc")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-8">
        {loading ? (
          <NastranSpinner />
        ) : (
          <div className="flex flex-col justify-center gap-y-2">
            {isFile(pictureData.picture) ? (
              <img
                src={pictureData.imageUrl}
                className="size-[86px] !mt-6 mx-auto shadow-lg border border-primary/30 rounded-full"
              />
            ) : (
              <CachedImage
                src={pictureData.picture}
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
        )}
        {slider.map((slide) => (
          <div
            className="bg-card w-[100px] h-[100px] bg-red-400"
            key={slide.id}
          >
            <CachedImage
              src={slide.picture}
              alt="Avatar"
              shimmerClassName="size-[86px] !mt-6 mx-auto shadow-lg border border-primary/30 rounded-full"
              className="size-[86px] !mt-6 object-center object-cover mx-auto shadow-lg border border-primary/50 rounded-full"
            />
          </div>
        ))}

        <PrimaryButton onClick={saveData}>{t("add")}</PrimaryButton>
      </CardContent>
    </Card>
  );
}
