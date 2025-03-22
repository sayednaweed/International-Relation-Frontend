import Shimmer from "@/components/custom-ui/shimmer/Shimmer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { useGlobalState } from "@/context/GlobalStateContext";
import { Audit } from "@/database/tables";
import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";
import axiosClient from "@/lib/axois-client";

import Pagination from "@/components/custom-ui/table/Pagination";
import { toLocaleDate } from "@/lib/utils";
import { Eye, Search } from "lucide-react";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import SecondaryButton from "@/components/custom-ui/button/SecondaryButton";
import CustomSelect from "@/components/custom-ui/select/CustomSelect";
import {
  AuditFilter,
  AuditFilterBy,
  AuditPaginationData,
  AuditSearch,
  AuditSort,
  Order,
} from "@/lib/types";
import useCacheDB from "@/lib/indexeddb/useCacheDB";
import { CACHE } from "@/lib/constants";
import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import CustomMultiDatePicker from "@/components/custom-ui/DatePicker/CustomMultiDatePicker";

import { StepperContext } from "@/components/custom-ui/stepper/StepperContext";
import { DateObject } from "react-multi-date-picker";
import { Button } from "@/components/ui/button";

import UserDetails from "./user-details";
import NastranModel from "@/components/custom-ui/model/NastranModel";

type AuditProps = {
  users: string;
  event: string;
  colum: string;
  table: string;
  type: string;
};
export function AuditTable() {
  const searchRef = useRef<HTMLInputElement>(null);
  const { getComponentCache } = useCacheDB();
  const { userData, setUserData, error } = useContext(StepperContext);
  const [isactive, setIsActive] = useState(false);
  const [auditData, setAuditData] = useState<AuditProps>({
    users: "",
    event: "",
    colum: "",
    table: "",
    type: "",
  });

  const [searchParams] = useSearchParams();
  // Accessing individual search filters
  const search = searchParams.get("search");
  const sort = searchParams.get("sort");
  const order = searchParams.get("order");
  const filterBy = searchParams.get("filterBy");
  const [filters, setFilters] = useState<AuditFilter>({
    sort: sort ? (sort as AuditSort) : "id",
    order: order ? (order as Order) : "asc",
    filterBy: {
      column: filterBy ? (filterBy as AuditFilterBy) : "none",
      value: "",
    },
    search: {
      column: search ? (search as AuditSearch) : "user",
      value: "",
    },
    date: [],
  });
  const loadList = async (
    count: number,
    dataFilters: AuditFilter,
    page = 1
  ) => {
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
      const response = await axiosClient.get(`audits/${page}`, {
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
      const fetch = response.data.audits.data as Audit[];
      const lastPage = response.data.audits.last_page;
      const totalItems = response.data.audits.total;
      const perPage = response.data.audits.per_page;
      const currentPage = response.data.audits.current_page;
      setAudits({
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
        title: t("Error"),
        description: error.response.data.message,
      });
    } finally {
      setLoading(false);
    }
  };
  const initialize = async (dataFilters: AuditFilter) => {
    const count = await getComponentCache(CACHE.AUDIT_TABLE_PAGINATION_COUNT);
    loadList(count ? count.value : 10, dataFilters);
  };
  useEffect(() => {
    initialize(filters);
  }, [filters.order, filters.sort]);
  const [audits, setAudits] = useState<{
    filterList: AuditPaginationData;
    unFilterList: AuditPaginationData;
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

  const skeleton = (
    <TableRow>
      <TableCell>
        <Shimmer className="h-[24px] bg-primary/30 w-full rounded-sm" />
      </TableCell>
      <TableCell>
        <Shimmer className="h-[24px] bg-primary/30 w-full rounded-sm" />
      </TableCell>
      <TableCell>
        <Shimmer className="h-[24px] bg-primary/30 w-full rounded-sm" />
      </TableCell>
      <TableCell>
        <Shimmer className="h-[24px] bg-primary/30 w-full rounded-sm" />
      </TableCell>
      <TableCell>
        <Shimmer className="h-[24px] bg-primary/30 w-full rounded-sm" />
      </TableCell>
      <TableCell>
        <Shimmer className="h-[24px] bg-primary/30 w-full rounded-sm" />
      </TableCell>
      <TableCell>
        <Shimmer className="h-[24px] bg-primary/30 w-full rounded-sm" />
      </TableCell>
    </TableRow>
  );

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2x:grid-cols-6 gap-2 gap-y-0 items-center  ">
        <APICombobox
          className="w-full py-2 mb-5"
          placeholderText={t("search_item")}
          errorText={t("no_item")}
          onSelect={(selection: any) => {}}
          required={true}
          selectedItem={auditData["type"]}
          placeHolder={t("select_type")}
          errorMessage={error.get("type")}
          apiUrl={"type"}
          mode="single"
        />
        <APICombobox
          className="w-full py-2 mb-5"
          placeholderText={t("search_item")}
          errorText={t("no_item")}
          onSelect={(selection: any) => {}}
          required={true}
          selectedItem={auditData["users"]}
          placeHolder={t("select_user")}
          errorMessage={error.get("users")}
          apiUrl={"users"}
          mode="single"
        />

        <APICombobox
          className="w-full py-2 mb-5"
          placeholderText={t("search_item")}
          errorText={t("no_item")}
          onSelect={(selection: any) => {}}
          required={true}
          selectedItem={auditData["event"]}
          placeHolder={t("select_event")}
          errorMessage={error.get("event")}
          apiUrl={"event"}
          mode="single"
        />

        <APICombobox
          className="w-full py-2 mb-5"
          placeholderText={t("search_item")}
          errorText={t("no_item")}
          onSelect={(selection: any) => {}}
          required={true}
          selectedItem={auditData["table"]}
          placeHolder={t("select_table")}
          errorMessage={error.get("table")}
          apiUrl={"table"}
          mode="single"
        />
        <APICombobox
          className="w-full py-2 mb-5"
          placeholderText={t("search_item")}
          errorText={t("no_item")}
          onSelect={(selection: any) => {}}
          required={true}
          selectedItem={auditData["colum"]}
          placeHolder={t("select_colum")}
          errorMessage={error.get("colum")}
          apiUrl={"users"}
          mode="single"
        />
        <CustomMultiDatePicker
          dateOnComplete={(selectedDates: DateObject[]) => {
            console.log("Selected Dates:", selectedDates);
          }}
          value={[]}
          className="w-full py-2  bg-transparent "
        />
      </div>

      <div className="flex flex-col sm:items-baseline sm:flex-row rounded-md bg-card dark:!bg-black/30 gap-2 flex-1 px-2 py-2 mt-4 ">
        <div className="w-[650px]">
          {" "}
          <CustomInput
            className=""
            size_="lg"
            placeholder={`${t(filters.search.column)}...`}
            parentClassName="sm:flex-1"
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
        </div>

        <div className="flex justify-center mb-2">
          <Button className=" mt-4 bg-tertiary w-24 ">{t("apply")}</Button>
        </div>
      </div>
      <Table className="bg-card rounded-md my-[2px] py-8">
        <TableHeader>
          <TableRow>
            <TableHead className="text-start">User</TableHead>
            <TableHead className="text-start">Table</TableHead>
            <TableHead className="text-start">Event</TableHead>
            <TableHead className="text-start">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Ahmad</TableCell>
            <TableCell>Permission</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>2025/2/1</TableCell>
            <TableCell className="text-right">
              <NastranModel
                size="lg"
                isDismissable={false}
                button={
                  <SecondaryButton
                    className=" px-8 bg-primary/50 hover:bg-primary/80 rounded-full"
                    type="button"
                  >
                    <Eye className="text-primary-foreground size-[18px] transition" />
                  </SecondaryButton>
                }
                showDialog={async () => true}
              >
                <UserDetails />
              </NastranModel>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Naweed</TableCell>
            <TableCell>Ngo</TableCell>
            <TableCell>Deleted</TableCell>
            <TableCell>2025/2/2</TableCell>
          </TableRow>

          {/* {loading ? (
            <>
              {skeleton}
              {skeleton}
              {skeleton}
            </>
          ) : (
            audits.filterList.data.map((item: Audit) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.user_id}</TableCell>
                <TableCell className="rtl:text-md-rtl truncate px-1 py-0">
                  {item.user}
                </TableCell>
                <TableCell>
                  <h1 className="truncate">{item.action}</h1>
                </TableCell>
                <TableCell
                  dir="ltr"
                  className="rtl:text-md-rtl truncate rtl:text-end px-0 py-0"
                >
                  {item.table}
                </TableCell>
                <TableCell dir="ltr" className="rtl:text-end">
                  {item.ip_address}
                </TableCell>
                <TableCell>{item.user_agent}</TableCell>
                <TableCell>
                  {toLocaleDate(new Date(item.created_at), state)}
                </TableCell>
              </TableRow>
            ))
          )} */}
        </TableBody>
      </Table>

      <div className="flex justify-between rounded-md bg-card flex-1 p-3 items-center">
        <h1 className="rtl:text-lg-rtl ltr:text-md-ltr font-medium">{`${t(
          "page"
        )} ${audits.unFilterList.currentPage} ${t("of")} ${
          audits.unFilterList.lastPage
        }`}</h1>
        <Pagination
          lastPage={audits.unFilterList.lastPage}
          onPageChange={async (page) => {
            try {
              const count = await getComponentCache(
                CACHE.AUDIT_TABLE_PAGINATION_COUNT
              );
              const response = await axiosClient.get(`audits/${page}`, {
                params: {
                  per_page: count ? count.value : 10,
                },
              });
              const fetch = response.data.audits.data as Audit[];

              const item = {
                currentPage: page,
                data: fetch,
                lastPage: audits.unFilterList.lastPage,
                totalItems: audits.unFilterList.totalItems,
                perPage: audits.unFilterList.perPage,
              };
              setAudits({
                filterList: item,
                unFilterList: item,
              });
            } catch (error: any) {
              toast({
                toastType: "ERROR",
                title: t("Error"),
                description: error.response.data.message,
              });
            }
          }}
        />
      </div>
    </>
  );
}
