import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { useGlobalState } from "@/context/GlobalStateContext";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { News } from "@/database/tables";
import axiosClient from "@/lib/axois-client";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import CachedImage from "@/components/custom-ui/image/CachedImage";
import { PriorityEnum } from "@/lib/constants";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import { RefreshCcw } from "lucide-react";
import { toLocaleDate } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbHome,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/custom-ui/Breadcrumb/Breadcrumb";
const ViewNewsItem = () => {
  const { t, i18n } = useTranslation();
  const [news, setNews] = useState<News | undefined>(undefined);
  const [failed, setFailed] = useState(false);
  const [state] = useGlobalState();
  let { id } = useParams();

  const navigate = useNavigate();
  const initialize = async () => {
    try {
      // 1. Organize date
      const response = await axiosClient.get(`public/news/${id}`);
      if (response.status == 200) {
        const fetch = response.data.news as News;
        setNews(fetch);
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
  const handleGoBack = () => navigate(-1);
  const handleGoHome = () => navigate("/dashboard", { replace: true });

  return (
    <div className="px-2 pt-2 pb-20 flex flex-col gap-y-[2px] relative select-none rtl:text-2xl-rtl ltr:text-xl-ltr">
      <Breadcrumb>
        <BreadcrumbHome onClick={handleGoHome} />
        <BreadcrumbSeparator />
        <BreadcrumbItem onClick={handleGoBack}>{t("news")}</BreadcrumbItem>
      </Breadcrumb>
      {failed ? (
        <PrimaryButton
          onClick={async () => await initialize()}
          className="bg-red-500 mx-auto mt-12 hover:bg-red-500/70"
        >
          {t("failed_retry")}
          <RefreshCcw className="ltr:ml-2 rtl:mr-2" />
        </PrimaryButton>
      ) : !news ? (
        <NastranSpinner />
      ) : (
        <>
          <div className="mx-auto space-y-4 text-center rtl:text-[24px] md:w-[500px] sm:rtl:text-[28px] mt-12 font-bold">
            <div className="bg-card shadow-sm p-4 rounded-xl flex justify-between items-center">
              <h1>{news.title}</h1>
              <h1 className=" text-[18px] text-primary/85">
                {toLocaleDate(new Date(news.date), state)}
              </h1>
            </div>
            <CachedImage
              src={news.image}
              shimmerClassName="object-fill rounded-xl w-full"
              className="shadow-lg object-fill rounded-xl w-full"
            />
          </div>
          <h1 className="rounded-xl sm:mx-8 bg-card text-justify ltr:font-normal p-4 sm:p-8 mt-12 mb-1 border">
            {news.contents}
          </h1>
          <div className="flex flex-col sm:flex-row shadow-md sm:mx-8 p-4 sm:p-8 gap-y-6 sm:gap-16 bg-card rounded-xl">
            <div>
              <div className="font-bold">{t("saved_by")}</div>
              <p>{news.user}</p>
            </div>
            <div>
              <div className="font-bold">{t("type")}:</div>
              <p>{news.news_type}</p>
            </div>
            <div>
              <div className="font-bold">{t("priority")}:</div>
              <p
                className={
                  news.priority_id === PriorityEnum.high
                    ? "text-green-500/90"
                    : news.priority_id === PriorityEnum.medium
                    ? "text-orange-500/90"
                    : "text-red-500/90"
                }
              >
                {news.priority}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default ViewNewsItem;
