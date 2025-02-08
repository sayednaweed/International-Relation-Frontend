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

interface SliderProps {
  id: number;
  picture: string;
}

function SliderSection() {
  const { t, i18n } = useTranslation();
  const [slider, setSlider] = useState<SliderProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const initialize = async () => {
    try {
      const response = await axiosClient.get(`staff/puplic/slider`);

      if (response.status === 200) {
        setSlider(response.data.technicalStaff);
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: error.response.data?.message || t("something_went_wrong"),
      });
    }
  };

  useEffect(() => {
    initialize();
  }, [i18n.language]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="w-full max-w-lg mx-auto py-20">
      <Carousel opts={{ align: "start" }}>
        <CarouselContent className="relative group">
          {slider.map((slide) => (
            <CarouselItem key={slide.id} className=" w-full">
              <Card className="relative group">
                <CardContent className="p-0  h-[300px] ">
                  <img
                    src={slide.picture}
                    alt={`Slide ${slide.id} Image`}
                    className="min-w-full h-full object-fill rounded"
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
