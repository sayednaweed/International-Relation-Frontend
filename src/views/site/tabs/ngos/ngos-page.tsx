import { useState, useEffect, useRef } from "react";
import SecondaryButton from "@/components/custom-ui/button/SecondaryButton";
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
  NgoSearch,
  NgoSort,
  Order,
  PublicNgo,
} from "@/lib/types";
import { CACHE } from "@/lib/constants";
import { toast } from "@/components/ui/use-toast";
import { useNavigate, useSearchParams } from "react-router";
import useCacheDB from "@/lib/indexeddb/useCacheDB";
import CustomSelect from "@/components/custom-ui/select/CustomSelect";
import Pagination from "@/components/custom-ui/table/Pagination";
import { DateObject } from "react-multi-date-picker";
import { ListFilter, Search } from "lucide-react";
import NastranModel from "@/components/custom-ui/model/NastranModel";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import StatusButton from "@/components/custom-ui/button/StatusButton";
import FilterDialog from "@/components/custom-ui/dialog/filter-dialog";
import {
  Breadcrumb,
  BreadcrumbHome,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/custom-ui/Breadcrumb/Breadcrumb";

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
  const filters = {
    sort: sort == null ? "id" : (sort as NgoSort),
    order: order == null ? "asc" : (order as Order),
    search: {
      column: searchColumn == null ? "name" : (searchColumn as NgoSearch),
      value: searchValue == null ? "" : searchValue,
    },
  };

  const loadList = async (
    searchInput: string | undefined = undefined,
    count: number | undefined,
    page: number | undefined
  ) => {
    try {
      if (loading) return;
      setLoading(true);
      // 1. Organize date
      // 2. Send data
      const response = await axiosClient.get(`public/ngos`, {
        params: {
          page: page,
          per_page: count,
          filters: {
            sort: sort,
            order: order,
            search: {
              column: searchColumn,
              value: searchInput,
            },
          },
        },
      });
      const fetch = response.data.ngos.data as PublicNgo[];
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
  const initialize = async (
    searchInput: string | undefined = undefined,
    count: number | undefined,
    page: number | undefined
  ) => {
    if (!count) {
      const countSore = await getComponentCache(
        CACHE.NGO_LIST_TABLE_PAGINATION_COUNT
      );
      count = countSore?.value ? countSore.value : 10;
    }
    if (!searchInput) {
      searchInput = filters.search.value;
    }
    if (!page) {
      page = 1;
    }
    loadList(searchInput, count, page);
  };
  useEffect(() => {
    initialize(undefined, undefined, 1);
  }, [sort, order]);
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
  const handleGoBack = () => navigate(-1);
  const handleGoHome = () => navigate("/home", { replace: true });
  return (
    <>
      <div className="px-3 pt-3 flex flex-col gap-y-[2px] relative select-none rtl:text-2xl-rtl ltr:text-xl-ltr">
        <Breadcrumb>
          <BreadcrumbHome onClick={handleGoHome} />
          <BreadcrumbSeparator />
          <BreadcrumbItem onClick={handleGoBack}>{t("ngos")}</BreadcrumbItem>
        </Breadcrumb>

        <div className="flex flex-col sm:items-baseline sm:flex-row rounded-md bg-card dark:bg-card-secondary gap-2 flex-1 px-2 py-2 mt-4">
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
                  if (searchRef.current != undefined)
                    await initialize(
                      searchRef.current.value,
                      undefined,
                      undefined
                    );
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
                sortOnComplete={async (_filterName: any) => {}}
                showColumns={{
                  sort: false,
                  order: true,
                  search: true,
                  date: false,
                }}
                searchFilterChanged={async (filterName: NgoSearch) => {
                  if (filterName != filters.search.column) {
                    const queryParams = new URLSearchParams();
                    queryParams.set("order", filterName);
                    queryParams.set("sch_col", filterName);
                    queryParams.set("sch_val", filters.search.value);
                    navigate(`/ngos?${queryParams.toString()}`, {
                      replace: true,
                    });
                  }
                }}
                orderOnComplete={async (filterName: Order) => {
                  if (filterName != filters.order) {
                    const queryParams = new URLSearchParams();
                    queryParams.set("order", filterName);
                    queryParams.set("sch_col", filters.search.column);
                    queryParams.set("sch_val", filters.search.value);
                    navigate(`/ngos?${queryParams.toString()}`, {
                      replace: true,
                    });
                  }
                }}
                dateOnComplete={(_selectedDates: DateObject[]) => {}}
                filtersShowData={{
                  sort: [],
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
                      name: "name",
                      translate: t("name"),
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
            onChange={async (value: string) =>
              await initialize(undefined, parseInt(value), undefined)
            }
          />
        </div>
        <div className="flex flex-col gap-y-4">
          {/* Table */}
          <Table className="bg-card dark:bg-card-secondary rounded-md my-[2px] py-8">
            <TableHeader className="rtl:text-3xl-rtl ltr:text-xl-ltr">
              <TableRow className="hover:bg-transparent">
                <TableHead className="p-3 border-b rtl:text-right ltr:text-left rtl:font-bold">
                  {t("id")}
                </TableHead>
                <TableHead className="p-3 border-b rtl:text-right ltr:text-left rtl:font-bold">
                  {t("name")}
                </TableHead>
                <TableHead className="p-3 border-b rtl:text-right ltr:text-left rtl:font-bold">
                  {t("type")}
                </TableHead>
                <TableHead className="p-3 border-b rtl:text-right ltr:text-left rtl:font-bold">
                  {t("status")}
                </TableHead>
                <TableHead className="p-3 border-b rtl:text-right ltr:text-left rtl:font-bold">
                  {t("abbr")}
                </TableHead>
                <TableHead className="p-3 border-b rtl:text-right ltr:text-left rtl:font-bold">
                  {t("director")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="rtl:text-xl-rtl ltr:text-2xl-ltr">
              {loading ? (
                <TableRow>
                  <TableCell colSpan={12}>
                    <NastranSpinner />
                  </TableCell>
                </TableRow>
              ) : ngoList.filterList.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12}>
                    <h1 className="rtl:text-xl-rtl text-center text-primary/80">
                      {t("no_content")}
                    </h1>
                  </TableCell>
                </TableRow>
              ) : (
                ngoList.filterList.data.map((ngo: PublicNgo) => (
                  <TableRow key={ngo.id} className="">
                    <TableCell className="p-3 border-b rtl:text-right ltr:text-left ">
                      {ngo.id}
                    </TableCell>
                    <TableCell className="p-3 border-b rtl:text-right ltr:text-left">
                      {ngo.name}
                    </TableCell>
                    <TableCell className="p-3 border-b rtl:text-right ltr:text-left">
                      {ngo.type}
                    </TableCell>
                    <TableCell className="p-3 border-b rtl:text-right ltr:text-left">
                      <StatusButton status_id={0} status={ngo.status} />
                    </TableCell>
                    <TableCell className="p-3 border-b rtl:text-right ltr:text-left">
                      {ngo.abbr}
                    </TableCell>
                    <TableCell className="p-3 border-b rtl:text-right ltr:text-left">
                      {ngo.director}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-between rounded-md bg-transparent flex-1 p-3 items-center">
          <h1 className="rtl:text-lg-rtl ltr:text-md-ltr font-medium">{`${t(
            "page"
          )} ${ngoList.unFilterList.currentPage} ${t("of")} ${
            ngoList.unFilterList.lastPage
          }`}</h1>
          <Pagination
            lastPage={ngoList.unFilterList.lastPage}
            onPageChange={async (page) => {
              await initialize(undefined, undefined, page);
            }}
          />
        </div>
      </div>
    </>
  );
}

export default NgosPage;
