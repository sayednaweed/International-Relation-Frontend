import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router";
import AnimHomeIcon from "@/components/custom-ui/icons/AnimHomeIcon";
import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react";

interface Img {
  id: number;
  image: string;
  title: string;
  footer: string;
  date: string;
  date_title: string;
}

function NewsPage() {
  const { t } = useTranslation();
  const [images, setImages] = useState<Img[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          "https://newsapi.org/v2/top-headlines?country=us&apiKey=17ca245082a945f7bc6081b9c1a5832c"
        );

        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        const mappedImages = data.articles.map(
          (article: any, index: number) => ({
            id: index,
            image: article.urlToImage || "https://via.placeholder.com/300",
            title: article.title || "No Title",
            footer: article.source?.name || "Unknown Source",
            date:
              new Date(article.publishedAt).toLocaleDateString() || "No Date",
            date_title: "Published",
          })
        );
        setImages(mappedImages);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const [errorData, setErrorData] = useState<{
    username_english: string;
  }>({
    username_english: "Username is required",
  });
  const [userData, setUserData] = useState<{
    optional_lang: string;
  }>({
    optional_lang: "",
  });
  return (
    <>
      <div className="px-2 pt-2 pb-8 flex flex-col gap-y-8 relative select-none rtl:text-2xl-rtl ltr:text-xl-ltr">
        <Breadcrumb className="bg-card w-fit py-1 ltr:ps-3 ltr:pe-8 rtl:pe-3 rtl:ps-8 rounded-md border">
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to="/dashboard">
                <AnimHomeIcon />
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="rtl:rotate-180" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-fourth">
                {t("news")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex flex-wrap justify-center place-items-center px-4 sm:grid sm:grid-cols-2 gap-6 lg:grid-cols-3 2xl:grid-cols-4">
          {images.map((img) => (
            <Card
              key={img.id}
              className="shadow-xl max-h-[600px] w-[300px] md:w-[320px]"
            >
              <CardContent className="p-0  h-[200px] sm:h-[300px]">
                <img
                  src={img.image}
                  alt={img.title}
                  className="min-w-full h-full object-fill rounded-t border-b"
                />
              </CardContent>
              <CardFooter className="flex flex-col justify-start items-start gap-y-2 pt-4">
                <h2 className="font-bold rtl:text-2xl-rtl ltr:text-2xl-ltr line-clamp-2">
                  ما متعهد به ارائه خدمات صحی معیاری در سراسر کشور هستیم.
                </h2>
                <h1 className="rtl:text-xl-rtl ltr:text-xl-ltr text-primary/95 line-clamp-4 px-2">
                  ریاست شفاخانه استقلال از تمام داوطلبان واجد شرایط دعوت می
                  نماید تا در پروسه داوطلبی پروژه تدارک گاز اکسیجن طبی که تحت
                  ریفرنس نمبر(MOPH/EH/NCB/1404/G01) می باشد ...
                </h1>
                <div
                  dir="ltr"
                  className="flex justify-between w-full items-center mt-4 px-2"
                >
                  <h1 className="text-[15px] font-bold text-primary/60">
                    01-09-2025
                  </h1>
                  <h1 className="text-white flex items-center gap-x-1 bg-tertiary px-2 rounded cursor-pointer shadow-md">
                    {t("detail")}
                    <ChevronRight className="size-[20px] font-extrabold" />
                  </h1>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}

export default NewsPage;
