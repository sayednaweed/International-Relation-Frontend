import { useState, ChangeEvent, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import SecondaryButton from "@/components/custom-ui/button/SecondaryButton";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axiosClient from "@/lib/axois-client";
import { useTranslation } from "react-i18next";
import {
  NgoListPaginationData,
  NgoListSearch,
  NgoListSort,
  Order,
} from "@/lib/types";
import { CACHE } from "@/lib/constants";
import { toast } from "@/components/ui/use-toast";
import { useNavigate, useSearchParams } from "react-router";
import useCacheDB from "@/lib/indexeddb/useCacheDB";

import { NgoList } from "@/database/tables";
import { Link } from "react-router";
import CustomSelect from "@/components/custom-ui/select/CustomSelect";
import Pagination from "@/components/custom-ui/table/Pagination";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import AnimHomeIcon from "@/components/custom-ui/icons/AnimHomeIcon";
import { DateObject } from "react-multi-date-picker";
import { useGlobalState } from "@/context/GlobalStateContext";
import { ListFilter, Search } from "lucide-react";
import NastranModel from "@/components/custom-ui/model/NastranModel";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import FiltersDialog from "@/components/custom-ui/dialog/filters-dialog";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";

function NgosPage() {
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
    sort: sort == null ? "establishment_date" : (sort as NgoListSort),
    order: order == null ? "asc" : (order as Order),
    search: {
      column:
        searchColumn == null ? "ngo_name" : (searchColumn as NgoListSearch),
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
      const response = await axiosClient.get(`public/ngos/${page}`, {
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
      const fetch = response.data.ngos.data as NgoList[];
      const lastPage = response.data.ngos.last_page;
      const totalItems = response.data.ngos.total;
      const perPage = response.data.ngos.per_page;
      const currentPage = response.data.ngos.current_page;
      setNgoList({
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
    const count = await getComponentCache(
      CACHE.NGO_LIST_TABLE_PAGINATION_COUNT
    );
    loadList(count ? count.value : 10, searchInput);
  };
  useEffect(() => {
    initialize();
  }, [sort, startDate, endDate, order, searchColumn, searchValue]);
  const [ngoList, setNgoList] = useState<{
    filterList: NgoListPaginationData;
    unFilterList: NgoListPaginationData;
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
                {t("ngos")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
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
            <FiltersDialog
              filters={filters}
              sortOnComplete={async (filterName: NgoListSort) => {
                const queryParams = new URLSearchParams();
                queryParams.set("search", filters.search.column);
                queryParams.set("sort", filterName);
                queryParams.set("order", filters.order);
                navigate(`ngos?${queryParams.toString()}`, {
                  replace: true,
                });
              }}
              searchFilterChanged={async (filterName: NgoListSearch) => {
                if (filterName != filters.search.column) {
                  const queryParams = new URLSearchParams();
                  queryParams.set("sort", filters.sort);
                  queryParams.set("order", filterName);
                  queryParams.set("sch_col", filterName);
                  queryParams.set("sch_val", filters.search.value);
                  setDateToURL(queryParams, filters.date);
                  navigate(`ngos?${queryParams.toString()}`, {
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
                  navigate(`ngos?${queryParams.toString()}`, {
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
                  navigate(`ngos?${queryParams.toString()}`, {
                    replace: true,
                  });
                }
              }}
              filtersShowData={{
                sort: [
                  {
                    name: "establishment_date",
                    translate: t("establishment_date"),
                    onClick: () => {},
                  },
                  {
                    name: "status",
                    translate: t("status"),
                    onClick: () => {},
                  },
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
                    name: "ngo_name",
                    translate: t("ngo_name"),
                    onClick: () => {},
                  },
                  {
                    name: "abbr",
                    translate: t("abbr"),
                    onClick: () => {},
                  },
                ],
              }}
            />
          </NastranModel>
        </div>

        <CustomSelect
          paginationKey={CACHE.NGO_LIST_TABLE_PAGINATION_COUNT}
          options={[
            { value: "10", label: "10" },
            { value: "20", label: "20" },
            { value: "50", label: "50" },
          ]}
          className="w-fit sm:self-baseline"
          updateCache={updateComponentCache}
          getCache={async () =>
            await getComponentCache(CACHE.NGO_LIST_TABLE_PAGINATION_COUNT)
          }
          placeholder={`${t("select")}...`}
          emptyPlaceholder={t("no_options_found")}
          rangePlaceholder={t("count")}
          onChange={async (value: string) => {
            loadList(parseInt(value));
          }}
        />
      </div>

      <div className="flex flex-col gap-y-4">
        {/* Table */}
        <Card className="p-0">
          <Table className="min-w-full bg-white border rounded-lg shadow-xl">
            <TableHeader>
              <TableRow className="text-left text-gray-600 rtl:text-2xl-rtl">
                <TableHead className="p-3 border-b rtl:text-right ltr:text-left rtl:font-bold">
                  {t("reg_no")}
                </TableHead>
                <TableHead className="p-3 border-b rtl:text-right ltr:text-left rtl:font-bold">
                  {t("ngo_name")}
                </TableHead>
                <TableHead className="p-3 border-b rtl:text-right ltr:text-left rtl:font-bold">
                  {t("ngo_type")}
                </TableHead>
                <TableHead className="p-3 border-b rtl:text-right ltr:text-left rtl:font-bold">
                  {t("status")}
                </TableHead>
                <TableHead className="p-3 border-b rtl:text-right ltr:text-left rtl:font-bold">
                  {t("abbrebviation")}
                </TableHead>
                <TableHead className="p-3 border-b rtl:text-right ltr:text-left rtl:font-bold">
                  {t("date_of_est")}
                </TableHead>
                <TableHead className="p-3 border-b rtl:text-right ltr:text-left rtl:font-bold">
                  {t("direc_name")}
                </TableHead>
                <TableHead className="p-3 border-b rtl:text-right ltr:text-left rtl:font-bold">
                  {t("province")}
                </TableHead>
                <TableHead className="p-3 border-b rtl:text-right ltr:text-left rtl:font-bold">
                  {t("activi_area")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <NastranSpinner />
              ) : ngoList.filterList.data.length === 0 ? (
                <h1>{t("no_content")}</h1>
              ) : (
                ngoList.filterList.data.map((ngo: NgoList) => (
                  <TableRow key={ngo.id}>
                    <TableCell className="p-3 border-b rtl:text-right ltr:text-left">
                      {ngo.reg_no}
                    </TableCell>
                    <TableCell className="p-3 border-b rtl:text-right ltr:text-left">
                      {ngo.ngo_name}
                    </TableCell>
                    <TableCell className="p-3 border-b rtl:text-right ltr:text-left">
                      {ngo.ngo_type}
                    </TableCell>
                    <TableCell className="p-3 border-b rtl:text-right ltr:text-left">
                      {ngo.status}
                    </TableCell>
                    <TableCell className="p-3 border-b rtl:text-right ltr:text-left">
                      {ngo.abbr}
                    </TableCell>
                    <TableCell className="p-3 border-b rtl:text-right ltr:text-left">
                      {ngo.date_of_est}
                    </TableCell>
                    <TableCell className="p-3 border-b rtl:text-right ltr:text-left">
                      {ngo.direc_name}
                    </TableCell>
                    <TableCell className="p-3 border-b rtl:text-right ltr:text-left">
                      {ngo.provience}
                    </TableCell>
                    <TableCell className="p-3 border-b rtl:text-right ltr:text-left">
                      {ngo.activity_area}
                    </TableCell>
                  </TableRow>
                ))
              )}

              <div className="flex justify-between rounded-md bg-card flex-1 p-3 items-center">
                <h1 className="rtl:text-lg-rtl ltr:text-md-ltr font-medium">{`${t(
                  "page"
                )} ${ngoList.unFilterList.currentPage} ${t("of")} ${
                  ngoList.unFilterList.lastPage
                }`}</h1>
                <Pagination
                  lastPage={ngoList.unFilterList.lastPage}
                  onPageChange={async (page) => {
                    try {
                      const count = await getComponentCache(
                        CACHE.NGO_LIST_TABLE_PAGINATION_COUNT
                      );
                      const response = await axiosClient.get(`ngos/${page}`, {
                        params: {
                          per_page: count ? count.value : 10,
                        },
                      });
                      const fetch = response.data.news.data as NgoList[];

                      const item = {
                        currentPage: page,
                        data: fetch,
                        lastPage: ngoList.unFilterList.lastPage,
                        totalItems: ngoList.unFilterList.totalItems,
                        perPage: ngoList.unFilterList.perPage,
                      };
                      setNgoList({
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
            </TableBody>
          </Table>
        </Card>
      </div>
    </>
  );
}

export default NgosPage;
