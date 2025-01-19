import { toast } from "@/components/ui/use-toast";
import { useUserAuthState } from "@/context/AuthContextProvider";
import { News, UserPermission } from "@/database/tables";
import { CACHE, SectionEnum } from "@/lib/constants";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";
import axiosClient from "@/lib/axois-client";
import Pagination from "@/components/custom-ui/table/Pagination";
import NastranModel from "@/components/custom-ui/model/NastranModel";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import { ListFilter, Search } from "lucide-react";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import SecondaryButton from "@/components/custom-ui/button/SecondaryButton";
import CustomSelect from "@/components/custom-ui/select/CustomSelect";
import { DateObject } from "react-multi-date-picker";
import {
  NewsFilter,
  NewsPaginationData,
  NewsSearch,
  NewsSort,
  Order,
} from "@/lib/types";
import useCacheDB from "@/lib/indexeddb/useCacheDB";
import AddNews from "./add/add-news";
import { useGlobalState } from "@/context/GlobalStateContext";
import NewsFilterDialog from "./news-filter-dialog";
export default function NewsTable() {
  const { user } = useUserAuthState();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);
  const { updateComponentCache, getComponentCache } = useCacheDB();

  const [searchParams] = useSearchParams();
  // Accessing individual search filters
  const search = searchParams.get("search");
  const sort = searchParams.get("sort");
  const order = searchParams.get("order");
  const [filters, setFilters] = useState<NewsFilter>({
    sort: sort == null ? "date" : (sort as NewsSort),
    order: order == null ? "asc" : (order as Order),
    search: {
      column: search == null ? "title" : (search as NewsSearch),
      value: "",
    },
    date: [],
  });
  const loadList = async (count: number, dataFilters: NewsFilter, page = 1) => {
    try {
      if (loading) return;
      setLoading(true);
      // 1. Organize date
      let dates: {
        startDate: string | null;
        endDate: string | null;
      };
      if (filters.date.length === 1) {
        // set start date
        dates = {
          startDate: filters.date[0].toDate().toISOString(),
          endDate: null,
        };
      } else if (filters.date.length === 2) {
        // set dates
        dates = {
          startDate: filters.date[0].toDate().toISOString(),
          endDate: filters.date[1].toDate().toISOString(),
        };
      } else {
        // Set null
        dates = {
          startDate: null,
          endDate: null,
        };
      }
      // 2. Send data
      const response = await axiosClient.get(`news/${page}`, {
        params: {
          per_page: count,
          filters: {
            sort: dataFilters.sort,
            order: dataFilters.order,
            search: {
              column: dataFilters.search.column,
              value: dataFilters.search.value,
            },
            date: dates,
          },
        },
      });
      const fetch = response.data.news.data as News[];
      const lastPage = response.data.news.last_page;
      const totalItems = response.data.news.total;
      const perPage = response.data.news.per_page;
      const currentPage = response.data.news.current_page;
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
  const initialize = async (dataFilters: NewsFilter) => {
    const count = await getComponentCache(CACHE.NEWS_TABLE_PAGINATION_COUNT);
    loadList(count ? count.value : 10, dataFilters);
  };
  useEffect(() => {
    initialize(filters);
  }, [filters.order, filters.sort]);
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

  const per: UserPermission | undefined = user?.permissions.get(
    SectionEnum.news
  );
  const view = per ? per?.view : false;
  const remove = per ? per?.delete : false;
  const edit = per ? per?.edit : false;
  const add = per ? per?.add : false;
  const editOnClick = async (news: News) => {
    const newsId = news.id;
    navigate(`/news/${newsId}`);
  };
  const watchOnClick = async (news: News) => {
    const newsId = news.id;
    navigate(`/news/${newsId}`);
  };
  return (
    <>
      <div className="flex flex-col sm:items-baseline sm:flex-row rounded-md bg-card gap-2 flex-1 px-2 py-2 mt-4">
        {add && (
          <NastranModel
            size="lg"
            isDismissable={false}
            button={
              <PrimaryButton className="rtl:text-lg-rtl font-semibold ltr:text-md-ltr">
                {t("add_news")}
              </PrimaryButton>
            }
            showDialog={async () => {
              if (add) return true;
              toast({
                toastType: "ERROR",
                title: t("error"),
                description: t("add_perm_desc"),
              });
              return false;
            }}
          >
            <AddNews onComplete={(news: News) => {}} />
          </NastranModel>
        )}

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
                  const newfilter = {
                    ...filters,
                    search: {
                      column: filters.search.column,
                      value: searchRef.current.value,
                    },
                  };

                  await initialize(newfilter);
                  setFilters(newfilter);
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
            <NewsFilterDialog
              filters={filters}
              sortOnComplete={async (filterName: NewsSort) => {
                if (filterName != filters.sort) {
                  setFilters({
                    ...filters,
                    sort: filterName,
                  });
                  const queryParams = new URLSearchParams();
                  queryParams.set("search", filters.search.column);
                  queryParams.set("sort", filterName);
                  queryParams.set("order", filters.order);
                  navigate(`/news?${queryParams.toString()}`);
                  // sortList
                  const item = {
                    data: newsList.filterList.data,
                    lastPage: newsList.unFilterList.lastPage,
                    totalItems: newsList.unFilterList.totalItems,
                    perPage: newsList.unFilterList.perPage,
                    currentPage: newsList.unFilterList.currentPage,
                  };
                  setNewsList({
                    ...newsList,
                    filterList: item,
                  });
                }
              }}
              searchOnComplete={async (filterName: NewsSearch) => {
                const search = filters.search;
                setFilters({
                  ...filters,
                  search: { ...search, column: filterName },
                });
              }}
              orderOnComplete={async (filterName: Order) => {
                if (filterName != filters.order) {
                  setFilters({
                    ...filters,
                    order: filterName,
                  });
                  const queryParams = new URLSearchParams();
                  queryParams.set("sort", filters.sort);
                  queryParams.set("order", filterName);
                  navigate(`/news?${queryParams.toString()}`, {
                    replace: true,
                  });
                }
              }}
              dateOnComplete={(selectedDates: DateObject[]) => {
                setFilters({
                  ...filters,
                  date: selectedDates,
                });
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
            loadList(parseInt(value), filters);
          }}
        />
      </div>
      <section className="">{/* Content */}</section>
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
