import { useEffect, useState } from "react";
import axiosClient from "@/lib/axois-client";
import { News } from "@/database/tables";
import { toast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import { NewsPaginationData } from "@/lib/types";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import { PublicNews } from "@/components/custom-ui/card/PublicNews";
import { useGlobalState } from "@/context/GlobalStateContext";
import { useNavigate } from "react-router";
function NewSection() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [state] = useGlobalState();
  const navigate = useNavigate();

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
            sort: "date",
            order: "asc",
            search: {
              column: null,
              value: null,
            },
            date: null,
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

  const viewOnClick = async (news: News) => {
    const newsId = news.id;
    navigate(`/news/${newsId}`);
  };
  return (
    <>
      <h1 className="bg-primary dark:bg-primary/90 h-16 flex items-center justify-center font-bold text-4xl-ltr text-white">
        News
      </h1>
      <div className="flex flex-wrap py-8 justify-center px-4 gap-6">
        {loading ? (
          <NastranSpinner />
        ) : newsList.filterList.data.length === 0 ? (
          <h1 className="rtl:text-xl-rtl text-primary/80">{t("no_content")}</h1>
        ) : (
          newsList.filterList.data.map((news: News) => (
            <PublicNews
              news={news}
              viewOnClick={viewOnClick}
              detailText={t("detail")}
              state={state}
            />
          ))
        )}
      </div>
    </>
  );
}

export default NewSection;
