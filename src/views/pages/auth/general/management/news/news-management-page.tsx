import { toast } from "@/components/ui/use-toast";
import { useAuthState } from "@/context/AuthContextProvider";
import { User, UserPermission } from "@/database/tables";
import { CACHE, SectionEnum } from "@/lib/constants";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useSearchParams } from "react-router";
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
  Order,
  UserFilter,
  UserPaginationData,
  UserSearch,
  UserSort,
} from "@/lib/types";
import useCacheDB from "@/lib/indexeddb/useCacheDB";
import UserFilterDialog from "../../users/user-filter-dialog";
import AddContent from "./addContent";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import AnimHomeIcon from "@/components/custom-ui/icons/AnimHomeIcon";

interface Img {
  id: number;
  image: string;
  title: string;
  footer: string;
  date: string;
  date_title: string;
  moreInfoLink: string;
}
export default function NewsManagementPage() {
  const [images, setImages] = useState<Img[]>([]);
  const [loadings, setLoadings] = useState(true);

  const { user } = useAuthState();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);
  const { updateComponentCache, getComponentCache } = useCacheDB();

  const [searchParams] = useSearchParams();
  // Accessing individual search filters
  const search = searchParams.get("search");
  const sort = searchParams.get("sort");
  const order = searchParams.get("order");
  const [filters, setFilters] = useState<UserFilter>({
    sort: sort == null ? "created_at" : (sort as UserSort),
    order: order == null ? "asc" : (order as Order),
    search: {
      column: search == null ? "username" : (search as UserSearch),
      value: "",
    },
    date: [],
  });
  const loadList = async (count: number, dataFilters: UserFilter, page = 1) => {
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
      const response = await axiosClient.get(`users/${page}`, {
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
      const fetch = response.data.users.data as User[];
      const lastPage = response.data.users.last_page;
      const totalItems = response.data.users.total;
      const perPage = response.data.users.per_page;
      const currentPage = response.data.users.current_page;
      setUsers({
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
  const initialize = async (dataFilters: UserFilter) => {
    const count = await getComponentCache(CACHE.USER_TABLE_PAGINATION_COUNT);
    loadList(count ? count.value : 10, dataFilters);
  };
  useEffect(() => {
    initialize(filters);
  }, [filters.order, filters.sort]);
  const [users, setUsers] = useState<{
    filterList: UserPaginationData;
    unFilterList: UserPaginationData;
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

  const per: UserPermission | undefined = user?.permissions.get(
    SectionEnum.users
  );

  const add = per ? per?.add : false;

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
        setLoadings(false);
      }
    };

    fetchImages();
  }, []);

  if (loadings) {
    return <div className="text-center mt-20">Loading...</div>;
  }
  const viewNews = () => {
    navigate("/news/" + 1);
  };
  return (
    <>
      <div className="px-2 pt-2 flex flex-col gap-y-[2px] relative select-none rtl:text-2xl-rtl ltr:text-xl-ltr">
        <Breadcrumb className="bg-card w-fit py-1 ltr:ps-3 ltr:pe-8 rtl:pe-3 rtl:ps-8 rounded-md border">
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to="/dashboard">
                <AnimHomeIcon />
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="rtl:rotate-180" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-tertiary">
                {t("News")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex flex-col sm:items-baseline sm:flex-row rounded-md bg-card gap-2 flex-1 px-2 py-2 mt-4">
        {add && (
          <NastranModel
            size="lg"
            isDismissable={false}
            button={
              <PrimaryButton className="rtl:text-lg-rtl font-semibold ltr:text-md-ltr">
                {t("Add Content")}
              </PrimaryButton>
            }
            showDialog={async () => {
              if (user?.permissions.get(SectionEnum.users)?.add) return true;
              toast({
                toastType: "ERROR",
                title: t("error"),
                description: t("add_perm_desc"),
              });
              return false;
            }}
          >
            <AddContent />
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
            <UserFilterDialog
              filters={filters}
              sortOnComplete={async (filterName: UserSort) => {
                if (filterName != filters.sort) {
                  setFilters({
                    ...filters,
                    sort: filterName,
                  });
                  const queryParams = new URLSearchParams();
                  queryParams.set("search", filters.search.column);
                  queryParams.set("sort", filterName);
                  queryParams.set("order", filters.order);
                  navigate(`/users?${queryParams.toString()}`);
                  // sortList
                  const item = {
                    data: users.filterList.data,
                    lastPage: users.unFilterList.lastPage,
                    totalItems: users.unFilterList.totalItems,
                    perPage: users.unFilterList.perPage,
                    currentPage: users.unFilterList.currentPage,
                  };
                  setUsers({
                    ...users,
                    filterList: item,
                  });
                }
              }}
              searchOnComplete={async (filterName: UserSearch) => {
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
                  navigate(`/users?${queryParams.toString()}`, {
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
          paginationKey={CACHE.USER_TABLE_PAGINATION_COUNT}
          options={[
            { value: "10", label: "10" },
            { value: "20", label: "20" },
            { value: "50", label: "50" },
          ]}
          className="w-fit sm:self-baseline"
          updateCache={updateComponentCache}
          getCache={async () =>
            await getComponentCache(CACHE.USER_TABLE_PAGINATION_COUNT)
          }
          placeholder={`${t("select")}...`}
          emptyPlaceholder={t("no_options_found")}
          rangePlaceholder={t("count")}
          onChange={async (value: string) => {
            loadList(parseInt(value), filters);
          }}
        />
      </div>
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
            <a
              href={img.moreInfoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 text-white font-medium transition-opacity"
            >
              <div className="flex flex-row gap-4">
                <PrimaryButton
                  onClick={viewNews}
                  className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-700"
                >
                  Edite
                </PrimaryButton>
                <PrimaryButton
                  onClick={viewNews}
                  className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-700 "
                >
                  Delete
                </PrimaryButton>
              </div>
            </a>

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
      <div className="flex justify-between rounded-md bg-card flex-1 p-3 items-center">
        <h1 className="rtl:text-lg-rtl ltr:text-md-ltr font-medium">{`${t(
          "page"
        )} ${users.unFilterList.currentPage} ${t("of")} ${
          users.unFilterList.lastPage
        }`}</h1>
        <Pagination
          lastPage={users.unFilterList.lastPage}
          onPageChange={async (page) => {
            try {
              const count = await getComponentCache(
                CACHE.USER_TABLE_PAGINATION_COUNT
              );
              const response = await axiosClient.get(`users/${page}`, {
                params: {
                  per_page: count ? count.value : 10,
                },
              });
              const fetch = response.data.users.data as User[];

              const item = {
                currentPage: page,
                data: fetch,
                lastPage: users.unFilterList.lastPage,
                totalItems: users.unFilterList.totalItems,
                perPage: users.unFilterList.perPage,
              };
              setUsers({
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
