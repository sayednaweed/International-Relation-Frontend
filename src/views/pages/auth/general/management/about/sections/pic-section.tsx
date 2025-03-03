import { useEffect, useState } from "react";
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import { useTranslation } from "react-i18next";
import CachedImage from "@/components/custom-ui/image/CachedImage";
import ChunkFileUploader from "@/components/custom-ui/chooser/ChunkFileUploader";

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

export default function PicSection() {
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
    // initialize();
  }, []);

  return (
    <div className="flex flex-col items-center gap-y-16">
      {loading ? (
        <NastranSpinner />
      ) : (
        <>
          <ChunkFileUploader
            className="border-2 border-tertiary mx-auto w-fit px-16 py-4 rounded-lg border-dashed"
            name={""}
            inputFieldName="file"
            maxSize={0}
            validTypes={[]}
            onComplete={function (record: any): Promise<void> {
              throw new Error("Function not implemented.");
            }}
            onStart={function (file: File): Promise<void> {
              throw new Error("Function not implemented.");
            }}
            url={""}
            headers={undefined}
          />
          {slider.map((item) => {
            console.log(item.picture, "undefined"); // Add this for debugging
            return (
              <div
                key={item.id}
                className=" grid grid-cols-1 gap-y-10 px-4 md:grid-cols-2 lg:grid-cols-3 gap-x-4 2xl:grid-cols-3"
              >
                <CachedImage
                  src={item.picture}
                  alt="Avatar"
                  className="w-full object-contain rounded-md shadow-lg shadow-primary/70"
                />
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
