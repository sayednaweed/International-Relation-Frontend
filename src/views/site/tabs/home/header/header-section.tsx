import { useEffect, useState } from "react";
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import { Slider } from "@/database/tables";
import Shimmer from "@/components/custom-ui/shimmer/Shimmer";
import Carousel from "@/components/custom-ui/carousel/Carousel";

function HeaderSection() {
  const { t } = useTranslation();

  const [images, setImages] = useState<Slider[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const initialize = async () => {
    try {
      const response = await axiosClient.get(`public/sliders`);
      if (response.status == 200) {
        setImages(response.data);
      }
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

  return (
    <div className="px-2 flex justify-center mx-auto sm:px-6 xl:px-16 mt-2 sm:mt-6 h-[200px] xxl:h-[350px] sm:h-[480px] lg:w-[85%] xl:h-[530px] 2xl:h-[700px] xl:w-[90%]">
      {loading ? (
        <Shimmer className="relative w-full h-full rounded-md overflow-hidden" />
      ) : (
        <Carousel images={images} />
      )}
    </div>
  );
}

export default HeaderSection;
