import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import axiosClient from "@/lib/axois-client";
import { News } from "@/database/tables";
import { toast } from "@/components/ui/use-toast";
import i18n from "@/lib/i18n";
import { useTranslation } from "react-i18next";
import { NewsPaginationData } from "@/lib/types";

function NewSection() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [newsList, setNewsList] = useState<{
    filterList: NewsPaginationData;
  }>({
    filterList: {
      data: [],
      lastPage: 1,
      totalItems: 0,
      perPage: 0,
      currentPage: 0,
    },
  });
  const loadList = async (page = 1) => {
    try {
      if (loading) return;
      setLoading(true);
      // 1. Organize date
      // 2. Send data
      const response = await axiosClient.get(`public/newses/${page}`, {
        params: {
          per_page: 12,
          filters: {
            sort: "asc",
            order: "date",
            search: {
              column: "",
              value: "",
            },
            date: "",
          },
        },
      });
      const fetch = response.data.newses.data as News[];
      const lastPage = response.data.newses.last_page;
      const totalItems = response.data.newses.total;
      const perPage = response.data.newses.per_page;
      const currentPage = response.data.newses.current_page;
      setNewsList({
        filterList: {
          data: fetch,
          lastPage: lastPage,
          totalItems: totalItems,
          perPage: perPage,
          currentPage: currentPage,
        },
      });
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
    loadList();
  }, []);

  return (
    <>
      <h1 className="bg-primary dark:bg-primary/90 h-16 flex items-center justify-center font-bold text-4xl-ltr text-white">
        News
      </h1>
      <div
        className="grid gap-8 p-4 mt-28 mb-28 
                    grid-cols-1 
                    sm:grid-cols-1 
                    md:grid-cols-2 
                    lg:grid-cols-2 
                    xl:grid-cols-3 
                    2xl:grid-cols-4"
      >
        {images.map((img) => (
          <Card key={img.id} className="relative group">
            <CardContent className="p-0  h-[300px]">
              <img
                src={img.image}
                alt={img.title}
                className="min-w-full h-full object-fill rounded"
              />
            </CardContent>
            <CardFooter className="flex flex-col justify-start items-start p-4">
              <h2 className="font-bold text-xl ltr:text-left rtl:text-right mb-2">
                {img.title}
              </h2>
              <p className="text-center text-sm text-gray-600">
                {img.footer} | {img.date} {img.date_title}
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}

export default NewSection;
