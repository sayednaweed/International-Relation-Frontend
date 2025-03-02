import { ChangeEvent, useEffect, useState } from "react";
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";

import IconButton from "@/components/custom-ui/button/IconButton";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";

import { useTranslation } from "react-i18next";
import CachedImage from "@/components/custom-ui/image/CachedImage";

type SliderProps = {
  id: string;
  picture: string;
  isactive: boolean;
};
type PictureProps = {
  id: string;
  picture: File | undefined | string;
  imageUrl: string;
  isactive: boolean;
};

export default function SilderSectoin() {
  const { t } = useTranslation();
  const [slider, setSlider] = useState<SliderProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [pictureData, setPictureData] = useState<PictureProps>({
    id: "",
    picture: undefined,
    imageUrl: "",
    isactive: true,
  });

  const initialize = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get("/sliders");
      if (response.status == 200) {
        setSlider(response.data.slider as SliderProps[]);
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: error.response?.data?.message || "An error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  const saveData = async () => {
    if (!pictureData.picture) return;

    const formData = new FormData();
    formData.append("id", pictureData.id);
    formData.append("picture", pictureData.picture);

    try {
      const response = await axiosClient.post("slider/store", formData);
      if (response.status == 200) {
        setPictureData({
          id: "",
          picture: undefined,
          imageUrl: "",
          isactive: false,
        });

        toast({
          toastType: "SUCCESS",
          title: t("success"),
          description: response.data.message,
        });

        initialize();
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: error.response?.data?.message || "An error occurred",
      });
    }
  };

  const onFileUploadChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;
    const maxFileSize = 2 * 1024 * 1024; // 2MB

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

    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: t("ples_sel_vali_img_file"),
      });
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setPictureData((prev) => ({
      ...prev,
      picture: file,
      imageUrl: imageUrl,
    }));
  };

  useEffect(() => {
    if (pictureData.picture) {
      saveData();
    }
  }, [pictureData.picture]);

  return (
    <div className="flex flex-col gap-y-16">
      <IconButton className="hover:bg-primary/85 bg-primary text-white ml-4 mt-3">
        <label className="flex w-fit gap-x-1 items-center cursor-pointer justify-center">
          <h1 className="rtl:text-lg-rtl ltr:text-md-ltr font-bold p-1">
            {t("add_picture")}
          </h1>
          <input type="file" className="hidden" onChange={onFileUploadChange} />
        </label>
      </IconButton>

      {loading ? (
        <NastranSpinner />
      ) : (
        <div className="grid grid-cols-1 gap-y-10 px-4 md:grid-cols-2 lg:grid-cols-3 gap-x-4 2xl:grid-cols-3">
          {slider.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-1 gap-y-10 px-4 md:grid-cols-2 lg:grid-cols-3 gap-x-4 2xl:grid-cols-3"
            >
              <CachedImage
                src={item.picture}
                alt="Avatar"
                className="w-full object-contain rounded-md shadow-lg shadow-primary/70"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
