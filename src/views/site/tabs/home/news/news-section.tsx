import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { News } from "@/database/tables";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import axiosClient from "@/lib/axois-client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import CachedImage from "@/components/custom-ui/image/CachedImage";
import { ChevronRight } from "lucide-react";

function NewSection() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [newsList, setNewsList] = useState<News[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadImages = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get("public/newses");
        setNewsList(response.data.newses.data);
      } catch (error) {
        console.error("Error loading images", error);
      } finally {
        setLoading(false);
      }
    };
    loadImages();
  }, []);

  const viewOnClick = async (news: News) => {
    navigate(`/news/${news.id}`);
  };

  return (
    <div className="my-16">
      <h1 className="text-center text-tertiary py-2 rtl:text-[24px] ltr:text-4xl-ltr border-b border-primary/10 font-bold">
        {t("news")}
      </h1>
      <div className="flex flex-wrap py-8 px-4 gap-6 justify-evenly">
        {loading ? (
          <NastranSpinner />
        ) : newsList.length === 0 ? (
          <h1 className="text-primary/80">{t("no_content")}</h1>
        ) : (
          newsList.map((news) => (
            <Card
              key={news.id}
              className="shadow-xl max-h-[600px] w-[300px] md:w-[320px]"
            >
              <CardContent className="p-0 h-[200px] sm:h-[200px]">
                <CachedImage
                  src={news.image}
                  shimmerClassName="min-w-full h-full object-fill rounded-t"
                  className="min-w-full shadow-lg h-full object-fill rounded-t"
                />
              </CardContent>
              <CardFooter className="flex flex-col justify-start items-start gap-y-2 pt-4">
                <h2 className="font-bold rtl:text-2xl-rtl ltr:text-2xl-ltr line-clamp-2">
                  {news.title}
                </h2>
                <h1 className="rtl:text-xl-rtl ltr:text-xl-ltr text-primary/95 line-clamp-4 px-2">
                  {news.contents}
                </h1>
                <div
                  dir="ltr"
                  className="flex justify-between w-full gap-y-1 mt-4 px-2"
                >
                  <h1
                    onClick={() => viewOnClick(news)}
                    className="flex items-center select-none gap-x-1 bg-tertiary rounded-sm hover:opacity-70 transition-opacity duration-500 text-white shadow-md px-3 py-1 ltr:text-xl-ltr rtl:text-xl-rtl"
                  >
                    {t("detail")}
                    <ChevronRight className="size-[18px]" />
                  </h1>
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default NewSection;
