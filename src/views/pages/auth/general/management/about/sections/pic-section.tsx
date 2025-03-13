import { Dispatch, SetStateAction, useEffect, useState } from "react";
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import { useTranslation } from "react-i18next";
import CachedImage from "@/components/custom-ui/image/CachedImage";
import ChunkFileUploader from "@/components/custom-ui/chooser/ChunkFileUploader";
import { Slider, UserPermission } from "@/database/tables";
import { getConfiguration, validateFile } from "@/lib/utils";
import { CloudDownload, Trash2, X } from "lucide-react";
import { PermissionEnum } from "@/lib/constants";

interface PicSectionProps {
  permission: UserPermission;
}
export default function PicSection(props: PicSectionProps) {
  const { permission } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<Slider[]>([]);
  const [selectedImage, setSelectedImage] = useState<Slider | null>(null);

  const initialize = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get("/sliders");
      if (response.status == 200) {
        setImages(response.data);
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

  const openModal = (image: any) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };
  useEffect(() => {
    initialize();
  }, []);

  const hasAdd = permission.sub.get(PermissionEnum.about.sub.pic)?.add;
  const hasDelete = permission.sub.get(PermissionEnum.about.sub.pic)?.delete;

  return (
    <div className="flex flex-col items-center gap-y-16">
      {hasAdd && (
        <ChunkFileUploader
          className="border-2 border-tertiary mx-auto w-fit px-16 py-4 rounded-lg border-dashed"
          name={""}
          accept=".jpeg,.jpg,.png"
          inputFieldName="file"
          onComplete={async (record: any) => {
            for (const element of record) {
              const newImage = element[element.length - 1] as Slider;
              setImages([newImage, ...images]);
            }
          }}
          onStart={async (_file: File) => {}}
          url={`${import.meta.env.VITE_API_BASE_URL}/api/v1/slider/store`}
          headers={{
            "X-API-KEY": import.meta.env.VITE_BACK_END_API_TOKEN,
            "X-SERVER-ADDR": import.meta.env.VITE_BACK_END_API_IP,
            Authorization: "Bearer " + getConfiguration()?.token,
          }}
          onFailed={async (failed: boolean, response: any) => {
            if (failed) {
              if (response) {
                toast({
                  toastType: "ERROR",
                  description: response.data.message,
                });
              }
            }
          }}
          validateBeforeUpload={function (file: File): boolean {
            const maxFileSize = 2 * 1024 * 1024; // 2MB
            const validTypes: string[] = [
              "image/jpeg",
              "image/png",
              "image/jpg",
            ];

            const resultFile = validateFile(
              file,
              Math.round(maxFileSize),
              validTypes,
              t
            );
            return resultFile ? true : false;
          }}
        />
      )}

      {loading ? (
        <NastranSpinner />
      ) : (
        <div className="columns-1 md:columns-3 xl:columns-4 gap-7">
          {images.map((item: Slider, index: number) => (
            <Image
              openModal={openModal}
              item={item}
              key={index}
              setImages={setImages}
              images={images}
              t={t}
              hasDelete={hasDelete}
            />
          ))}
        </div>
      )}

      {selectedImage && (
        <div className="fixed z-20 top-0 bg-primary/70 w-screen h-screen flex items-center justify-center">
          <X
            className="size-[26px] absolute ltr:left-4 rtl:right-4 hover:bg-red-400 transition ease-in-out duration-300 cursor-pointer text-white top-4 p-1 z-40 bg-red-500 rounded-full"
            onClick={closeModal}
          />
          <CachedImage
            key={selectedImage.id}
            src={selectedImage.path}
            alt="Avatar"
            shimmerClassName="h-auto max-w-full rounded-lg shadow-lg size-60"
            className="rounded-lg shadow-lg w-fit h-fit max-w-[86%] max-h-[86%]"
          />
        </div>
      )}
    </div>
  );
}

interface ImageProps {
  openModal: (item: Slider) => void;
  item: Slider;
  setImages: Dispatch<SetStateAction<Slider[]>>;
  images: Slider[];
  t: any;
  hasDelete?: boolean;
}
const Image = (props: ImageProps) => {
  const { item, openModal, setImages, images, t, hasDelete } = props;
  const [loading, setLoading] = useState(false);

  const deletePicture = async (id: string) => {
    try {
      if (loading) return;
      setLoading(true);
      const response = await axiosClient.delete(`slider/${id}`);
      if (response.status == 200) {
        // 1. Update pictures
        const updated = images.filter((item: Slider) => item.id != id);
        setImages(updated);
        toast({
          toastType: "SUCCESS",
          description: response.data.message,
        });
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
  return (
    <div className="break-inside-avoid mb-8 relative">
      {loading && <NastranSpinner className="absolute top-1/2" label=" " />}
      <CachedImage
        onClick={() => openModal(item)}
        key={item.id}
        src={item.path}
        alt="Avatar"
        shimmerClassName="h-[300px] max-w-full rounded-lg shadow-lg"
        className="h-auto max-w-full rounded-lg shadow-lg"
      />
      <div className="absolute justify-end items-center gap-3 bottom-0 rounded-b-lg bg-primary/50 w-full flex py-1 px-4">
        <CloudDownload className="size-[22px] text-primary-foreground/80 cursor-pointer transition-colors duration-300 hover:text-primary-foreground" />

        {hasDelete && (
          <Trash2
            onClick={() => deletePicture(item.id)}
            className="size-[20px] text-red-400 hover:text-red-500 cursor-pointer transition-colors duration-300"
          />
        )}
      </div>
    </div>
  );
};
