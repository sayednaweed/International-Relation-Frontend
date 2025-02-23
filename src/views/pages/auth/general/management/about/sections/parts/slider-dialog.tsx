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
import { ChangeEvent, useState } from "react";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";

import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";

import IconButton from "@/components/custom-ui/button/IconButton";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import { isFile } from "@/validation/utils";
import CachedImage from "@/components/custom-ui/image/CachedImage";
import { Pencil } from "lucide-react";
type PictureProps = {
  id: string;
  picture: File | undefined | string;
  imageUrl: string;
  isactive: boolean;
};

export default function SilderDialog() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(new Map<string, string>());
  const [pictureData, setPictureData] = useState<PictureProps>({
    id: "",
    picture: undefined,
    imageUrl: "",
    isactive: true,
  });

  const { modelOnRequestHide } = useModelOnRequestHide();
  const { t } = useTranslation();

  const saveData = async () => {
    // 2. Store
    const formData = new FormData();
    formData.append("id", pictureData.id);
    if (pictureData.picture) formData.append("picture", pictureData.picture);

    try {
      const url = "slider/store";
      const response = await axiosClient.post(url, formData);
      if (response.status == 200) {
        setPictureData({
          id: "",
          picture: undefined,
          imageUrl: "",
          isactive: false,
        });
        modelOnRequestHide();
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
      e.currentTarget.type = "text";
      e.currentTarget.type = "file"; // Reset to file type
    }
  };

  return (
    <Card className="w-fit min-w-[400px] self-center [backdrop-filter:blur(20px)] bg-white/70 dark:!bg-black/40">
      <CardHeader className="relative text-start">
        <CardTitle className="rtl:text-4xl-rtl ltr:text-3xl-ltr text-tertiary">
          {t("add")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {" "}
        {loading ? (
          <NastranSpinner />
        ) : (
          <div className="flex flex-col justify-center gap-y-2 ">
            {isFile(pictureData.picture) ? (
              <>
                <img
                  src={pictureData.imageUrl}
                  className="size-[150px] !mt-6 mx-auto shadow-lg border border-primary/30 rounded-sm"
                />
              </>
            ) : (
              <div>
                <CachedImage
                  src={pictureData.picture}
                  alt="Avatar"
                  shimmerClassName="size-[150px] !mt-6 mx-auto shadow-lg border border-primary/30 rounded-sm"
                  className="size-[120px] !mt-6 object-center object-cover mx-auto shadow-lg border border-primary/50 rounded-full"
                />
                <IconButton className="hover:bg-primary/20 transition-all text-primary mx-auto mt-3">
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
          </div>
        )}
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
          onClick={saveData}
          className={`${loading && "opacity-90"}`}
          type="submit"
        >
          <ButtonSpinner loading={loading}>{t("save")}</ButtonSpinner>
        </PrimaryButton>
      </CardFooter>
    </Card>
  );
}
