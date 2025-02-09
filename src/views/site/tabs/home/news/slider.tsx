import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import CachedImage from "@/components/custom-ui/image/CachedImage";
import { useParams } from "react-router";

interface SliderProps {
  id: number;
  picture: string;
}

function SliderSection() {
  const { t, i18n } = useTranslation();
  let { id } = useParams();
  const [failed, setFailed] = useState(false);
  const [slider, setSlider] = useState<SliderProps[]>([]);
  // const [loading, setLoading] = useState<boolean>(false);
  // const [error, setError] = useState<string | null>(null);
  const initialize = async () => {
    try {
      // 1. Organize date
      const response = await axiosClient.get(`public/sliders`);
      if (response.status == 200) {
        const fetch = response.data.sliders as SliderProps[];
        setSlider(fetch);
        if (failed) {
          setFailed(false);
        }
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: error.response.data.message,
      });
      setFailed(true);
    }
  };

  useEffect(() => {
    initialize();
  }, [i18n.language]);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>{error}</div>;
  // }

  return (
    <div className="w-full max-w-lg mx-auto py-20">
      <Carousel opts={{ align: "start" }}>
        <CarouselContent className="relative group">
          {slider?.map((slide) => (
            <CarouselItem key={slide.id} className=" w-full">
              <Card className="relative group">
                <CardContent className="p-0  h-[300px] ">
                  <CachedImage
                    src={slide.picture}
                    alt="Avatar"
                    shimmerClassName="size-[86px] !mt-6 mx-auto shadow-lg border border-primary/30 rounded-full"
                    className="size-[86px] !mt-6 object-center object-cover mx-auto shadow-lg border border-primary/50 rounded-full"
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

export default SliderSection;
