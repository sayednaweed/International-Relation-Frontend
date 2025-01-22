import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, useNavigate, useSearchParams } from "react-router";
import AnimHomeIcon from "@/components/custom-ui/icons/AnimHomeIcon";
import { useTranslation } from "react-i18next";
import { ChevronRight, ListFilter, Search } from "lucide-react";
import useCacheDB from "@/lib/indexeddb/useCacheDB";
import { NewsPaginationData, NewsSearch, NewsSort, Order } from "@/lib/types";
import axiosClient from "@/lib/axois-client";
import { News } from "@/database/tables";
import { toast } from "@/components/ui/use-toast";
import { CACHE } from "@/lib/constants";
import { useGlobalState } from "@/context/GlobalStateContext";
import { toLocaleDate } from "@/lib/utils";
import { DateObject } from "react-multi-date-picker";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import SecondaryButton from "@/components/custom-ui/button/SecondaryButton";
import NastranModel from "@/components/custom-ui/model/NastranModel";
import CustomSelect from "@/components/custom-ui/select/CustomSelect";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import CachedImage from "@/components/custom-ui/image/CachedImage";
import Pagination from "@/components/custom-ui/table/Pagination";
import FilterDialog from "@/components/custom-ui/dialog/filter-dialog";

function NewsPage() {
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);
  const { updateComponentCache, getComponentCache } = useCacheDB();

  const [searchParams] = useSearchParams();
  // Accessing individual search filters
  const searchValue = searchParams.get("sch_val");
  const searchColumn = searchParams.get("sch_col");
  const sort = searchParams.get("sort");
  const order = searchParams.get("order");
  const startDate = searchParams.get("st_dt");
  const endDate = searchParams.get("en_dt");
  const filters = {
    sort: sort == null ? "date" : (sort as NewsSort),
    order: order == null ? "asc" : (order as Order),
    search: {
      column: searchColumn == null ? "title" : (searchColumn as NewsSearch),
      value: searchValue == null ? "" : searchValue,
    },
    date:
      startDate && endDate
        ? [
            new DateObject(new Date(startDate)),
            new DateObject(new Date(endDate)),
          ]
        : startDate
        ? [new DateObject(new Date(startDate))]
        : endDate
        ? [new DateObject(new Date(endDate))]
        : [],
  };
  const loadList = async (
    count: number,
    searchInput: string | undefined = undefined,
    page = 1
  ) => {
    try {
      if (loading) return;
      setLoading(true);
      // 1. Organize date
      let dates = {
        startDate: startDate,
        endDate: endDate,
      };
      // 2. Send data
      const response = await axiosClient.get(`public/newses/${page}`, {
        params: {
          per_page: count,
          filters: {
            sort: sort,
            order: order,
            search: {
              column: searchColumn,
              value: searchInput ? searchInput : searchValue,
            },
            date: dates,
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
        unFilterList: {
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
  const initialize = async (searchInput: string | undefined = undefined) => {
    const count = await getComponentCache(CACHE.NEWS_TABLE_PAGINATION_COUNT);
    loadList(count ? count.value : 10, searchInput);
  };
  useEffect(() => {
    initialize();
  }, [sort, startDate, endDate, order, searchColumn, searchValue]);
  const [newsList, setNewsList] = useState<{
    filterList: NewsPaginationData;
    unFilterList: NewsPaginationData;
  }>({
    filterList: {
      data: [],
      lastPage: 1,
      totalItems: 0,
      perPage: 0,
      currentPage: 0,
    },
    unFilterList: {
      data: [],
      lastPage: 1,
      totalItems: 0,
      perPage: 0,
      currentPage: 0,
    },
  });
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [state] = useGlobalState();

  const addItem = (news: News) => {
    setNewsList((prevState) => ({
      filterList: {
        ...prevState.filterList,
        data: [news, ...prevState.filterList.data],
      },
      unFilterList: {
        ...prevState.unFilterList,
        data: [news, ...prevState.unFilterList.data],
      },
    }));
  };

  const deleteOnClick = async (news: News) => {
    try {
      const newsId = news.id;
      const response = await axiosClient.delete("news/" + newsId);
      if (response.status == 200) {
        const filtered = newsList.unFilterList.data.filter(
          (item: News) => newsId != item?.id
        );
        const item = {
          data: filtered,
          lastPage: newsList.unFilterList.lastPage,
          totalItems: newsList.unFilterList.totalItems,
          perPage: newsList.unFilterList.perPage,
          currentPage: newsList.unFilterList.currentPage,
        };
        setNewsList({ ...newsList, filterList: item, unFilterList: item });
      }
      toast({
        toastType: "SUCCESS",
        title: t("success"),
        description: response.data.message,
      });
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: error.response.data.message,
      });
    }
  };

  const editOnClick = async (news: News) => {
    const newsId = news.id;
    navigate(`/management/news/${newsId}`);
  };

  const setDateToURL = (
    queryParams: URLSearchParams,
    selectedDates: DateObject[]
  ) => {
    if (selectedDates.length == 1) {
      queryParams.set(
        "st_dt",
        selectedDates[0].toDate().toISOString().split("T")[0] //2025-01-01
      );
    } else if (selectedDates.length == 2) {
      queryParams.set(
        "st_dt",
        selectedDates[0].toDate().toISOString().split("T")[0] //2025-01-01
      );
      queryParams.set(
        "en_dt",
        selectedDates[1].toDate().toISOString().split("T")[0] //2025-01-01
      );
    }
  };

  return (
    <>
      <div className="flex flex-col sm:items-baseline sm:flex-row rounded-md bg-card gap-2 flex-1 px-2 py-2 mt-4">
        <CustomInput
          size_="lg"
          placeholder={`${t(filters.search.column)}...`}
          parentClassName="sm:flex-1 col-span-3"
          type="text"
          ref={searchRef}
          startContent={
            <Search className="size-[18px] mx-auto rtl:mr-[4px] text-primary pointer-events-none" />
          }
          endContent={
            <SecondaryButton
              onClick={async () => {
                if (searchRef.current != undefined) {
                  await initialize(searchRef.current.value);
                }
              }}
              className="w-[72px] absolute rtl:left-[6px] ltr:right-[6px] -top-[7px] h-[32px] rtl:text-sm-rtl ltr:text-md-ltr hover:shadow-sm shadow-lg"
            >
              {t("search")}
            </SecondaryButton>
          }
        />
        <div className="sm:px-4 col-span-3 flex-1 self-start sm:self-baseline flex justify-end items-center">
          <NastranModel
            size="lg"
            isDismissable={false}
            button={
              <SecondaryButton
                className="px-8 rtl:text-md-rtl ltr:text-md-ltr"
                type="button"
              >
                {t("filter")}
                <ListFilter className="text-secondary mx-2 size-[15px]" />
              </SecondaryButton>
            }
            showDialog={async () => true}
          >
            <FilterDialog
              filters={filters}
              sortOnComplete={async (filterName: NewsSort) => {
                const queryParams = new URLSearchParams();
                queryParams.set("search", filters.search.column);
                queryParams.set("sort", filterName);
                queryParams.set("order", filters.order);
                navigate(`/management/news?${queryParams.toString()}`, {
                  replace: true,
                });
              }}
              searchFilterChanged={async (filterName: NewsSearch) => {
                if (filterName != filters.search.column) {
                  const queryParams = new URLSearchParams();
                  queryParams.set("sort", filters.sort);
                  queryParams.set("order", filterName);
                  queryParams.set("sch_col", filterName);
                  queryParams.set("sch_val", filters.search.value);
                  setDateToURL(queryParams, filters.date);
                  navigate(`/management/news?${queryParams.toString()}`, {
                    replace: true,
                  });
                }
              }}
              orderOnComplete={async (filterName: Order) => {
                if (filterName != filters.order) {
                  const queryParams = new URLSearchParams();
                  queryParams.set("sort", filters.sort);
                  queryParams.set("order", filterName);
                  queryParams.set("sch_col", filters.search.column);
                  queryParams.set("sch_val", filters.search.value);
                  setDateToURL(queryParams, filters.date);
                  navigate(`/management/news?${queryParams.toString()}`, {
                    replace: true,
                  });
                }
              }}
              dateOnComplete={(selectedDates: DateObject[]) => {
                if (selectedDates.length == 2) {
                  const queryParams = new URLSearchParams();
                  queryParams.set("order", filters.order);
                  queryParams.set("sort", filters.sort);
                  queryParams.set("sch_col", filters.search.column);
                  queryParams.set("sch_val", filters.search.value);
                  setDateToURL(queryParams, selectedDates);
                  navigate(`/management/news?${queryParams.toString()}`, {
                    replace: true,
                  });
                }
              }}
              filtersShowData={{
                sort: [
                  {
                    name: "id",
                    translate: t("id"),
                    onClick: () => {},
                  },
                  {
                    name: "type",
                    translate: t("type"),
                    onClick: () => {},
                  },
                  {
                    name: "priority",
                    translate: t("priority"),
                    onClick: () => {},
                  },
                  { name: "date", translate: t("date"), onClick: () => {} },
                ],
                order: [
                  {
                    name: "asc",
                    translate: t("asc"),
                    onClick: () => {},
                  },
                  {
                    name: "desc",
                    translate: t("desc"),
                    onClick: () => {},
                  },
                ],
                search: [
                  {
                    name: "title",
                    translate: t("title"),
                    onClick: () => {},
                  },
                ],
              }}
            />
          </NastranModel>
        </div>

        <CustomSelect
          paginationKey={CACHE.NEWS_TABLE_PAGINATION_COUNT}
          options={[
            { value: "10", label: "10" },
            { value: "20", label: "20" },
            { value: "50", label: "50" },
          ]}
          className="w-fit sm:self-baseline"
          updateCache={updateComponentCache}
          getCache={async () =>
            await getComponentCache(CACHE.NEWS_TABLE_PAGINATION_COUNT)
          }
          placeholder={`${t("select")}...`}
          emptyPlaceholder={t("no_options_found")}
          rangePlaceholder={t("count")}
          onChange={async (value: string) => {
            loadList(parseInt(value));
          }}
        />
      </div>
      <div className="flex flex-wrap py-8 justify-center px-4 gap-6">
        {loading ? (
          <NastranSpinner />
        ) : newsList.filterList.data.length === 0 ? (
          <h1>{t("no_content")}</h1>
        ) : (
          newsList.filterList.data.map((news: News) => (
            <Card
              key={news.id}
              className="shadow-xl max-h-[600px] w-[300px] md:w-[320px]"
            >
              <CardContent className="p-0  h-[200px] sm:h-[200px]">
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
                  <h1 className="text-[15px] font-bold text-primary/60">
                    {toLocaleDate(new Date(news.date), state)}
                  </h1>
                  <Link
                    to={`/news/${news.id}`}
                    className="flex items-center select-none gap-x-1 bg-tertiary rounded-sm hover:opacity-70 transition-opacity duration-500 text-white shadow-md px-3 py-1 ltr:text-xl-ltr rtl:text-xl-rtl"
                  >
                    {t("detail")}
                    <ChevronRight className="size-[18px]" />
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
      <div className="flex justify-between rounded-md bg-card flex-1 p-3 items-center">
        <h1 className="rtl:text-lg-rtl ltr:text-md-ltr font-medium">{`${t(
          "page"
        )} ${newsList.unFilterList.currentPage} ${t("of")} ${
          newsList.unFilterList.lastPage
        }`}</h1>
        <Pagination
          lastPage={newsList.unFilterList.lastPage}
          onPageChange={async (page) => {
            try {
              const count = await getComponentCache(
                CACHE.NEWS_TABLE_PAGINATION_COUNT
              );
              const response = await axiosClient.get(`news/${page}`, {
                params: {
                  per_page: count ? count.value : 10,
                },
              });
              const fetch = response.data.news.data as News[];

              const item = {
                currentPage: page,
                data: fetch,
                lastPage: newsList.unFilterList.lastPage,
                totalItems: newsList.unFilterList.totalItems,
                perPage: newsList.unFilterList.perPage,
              };
              setNewsList({
                filterList: item,
                unFilterList: item,
              });
            } catch (error: any) {
              toast({
                toastType: "ERROR",
                title: t("error"),
                description: error.response.data.message,
              });
            }
          }}
        />
      </div>
    </>
  );
}

export default NewsPage;
