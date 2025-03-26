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
import { Audit } from "@/database/tables";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";
import axiosClient from "@/lib/axois-client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Pagination from "@/components/custom-ui/table/Pagination";
import { Eye, Search } from "lucide-react";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import SecondaryButton from "@/components/custom-ui/button/SecondaryButton";
import { AuditPaginationData } from "@/lib/types";
import useCacheDB from "@/lib/indexeddb/useCacheDB";
import { CACHE } from "@/lib/constants";
import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import CustomMultiDatePicker from "@/components/custom-ui/DatePicker/CustomMultiDatePicker";
import { DateObject } from "react-multi-date-picker";
import NastranModel from "@/components/custom-ui/model/NastranModel";
import AuditDetailsDialog from "./parts/audit-details-dialog";
import { setDateToURL } from "@/lib/utils";

type AuditProps = {
  userType: { name: string; selected: boolean };
  user: { id: string; name: string; selected: boolean } | undefined;
  event: "created" | "deleted" | "updated" | "viewed" | "all";
  table: { name: string };
  column: { name: string };
  lockTable: boolean;
  lockColumn: boolean;
};
export function AuditTable() {
  const searchRef = useRef<HTMLInputElement>(null);
  const { getComponentCache } = useCacheDB();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  // Accessing individual search filters
  const searchValue = searchParams.get("sch_val");
  const searchColumn = searchParams.get("sch_col");
  const userType = searchParams.get("usr_t");
  const userId = searchParams.get("usr_id");
  const user = searchParams.get("usr");
  const userSelected = searchParams.get("usr_s");
  const event = searchParams.get("evt");
  const column = searchParams.get("col");
  const table = searchParams.get("tabl");
  const lockTable = searchParams.get("l_tabl");
  const lockColumn = searchParams.get("l_col");
  const startDate = searchParams.get("st_dt");
  const endDate = searchParams.get("en_dt");
  const filters = {
    filterBy: {
      userType: {
        name: userType ? userType : "User",
        selected: true,
      },
      user: {
        id: userId ? userId : "",
        name: user ? user : "",
        selected: userSelected ? userSelected : false,
      },
      event: event ? event : "all",
      column: {
        name: column ? column : "all",
      },
      table: {
        name: table ? table : "all",
      },
      lockTable: lockTable ? lockTable : true, // In here logic is reverse
      lockColumn: lockColumn ? lockColumn : true,
    },
    search: {
      column: searchColumn == null ? "user" : searchColumn,
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
    searchInput: string | undefined = undefined,
    count: number | undefined,
    page: number | undefined
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
      const response = await axiosClient.get(`audits`, {
        params: {
          page: page,
          per_page: count,
          filters: {
            filterBy: {
              userType: {
                name: filters.filterBy.userType.name,
              },
              user: {
                id: filters.filterBy.user.id,
              },
              event: filters.filterBy.event,
              column: {
                name: filters.filterBy.column.name,
              },
              table: {
                name: filters.filterBy.table.name,
              },
            },
            search: {
              column: filters.search.column,
              value: searchInput,
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
        CACHE.AUDIT_TABLE_PAGINATION_COUNT
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
  }, [startDate, endDate]);

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
      <div className="grid place-content-center gap-y-4 sm:grid-cols-2 shadow-sm md:grid-cols-3 bg-card mt-2 rounded-md p-4 items-center">
        <APICombobox
          lable={t("Type")}
          className="w-fit"
          placeholderText={t("search_item")}
          errorText={t("no_item")}
          onSelect={(selection: any) => {
            const queryParams = new URLSearchParams();
            queryParams.set("sch_col", filters.search.column);
            queryParams.set("sch_val", filters.search.value);
            queryParams.set("usr_t", selection?.name);
            queryParams.set("usr_id", filters.filterBy.user.id);
            queryParams.set("usr", filters.filterBy.user.name);
            queryParams.set("usr_s", filters.filterBy.user.selected.toString());
            queryParams.set("evt", filters.filterBy.event);
            queryParams.set("col", filters.filterBy.column.name);
            queryParams.set("tabl", filters.filterBy.table.name);
            queryParams.set("l_tabl", filters.filterBy.lockTable.toString());
            queryParams.set("l_col", filters.filterBy.lockColumn.toString());
            setDateToURL(queryParams, filters.date);
            navigate(`/audit?${queryParams.toString()}`, {
              replace: true,
            });
          }}
          selectedItem={filters.filterBy.userType.name}
          placeHolder={t("select")}
          apiUrl={"audits/user/type"}
          mode="single"
        />

        <APICombobox
          lable={t("user")}
          key={filters.filterBy.userType.name}
          className="w-fit"
          placeholderText={t("search_item")}
          errorText={t("no_item")}
          onSelect={(selection: any) => {
            const queryParams = new URLSearchParams();
            queryParams.set("sch_col", filters.search.column);
            queryParams.set("sch_val", filters.search.value);
            queryParams.set("usr_t", filters.filterBy.userType.name);
            queryParams.set("usr_id", selection.id);
            queryParams.set("usr", selection.name);
            queryParams.set("usr_s", selection.selected.toString());
            queryParams.set("evt", filters.filterBy.event);
            queryParams.set("col", filters.filterBy.column.name);
            queryParams.set("tabl", filters.filterBy.table.name);
            queryParams.set("l_tabl", "false");
            queryParams.set("l_col", filters.filterBy.lockColumn.toString());
            setDateToURL(queryParams, filters.date);
            navigate(`/audit?${queryParams.toString()}`, {
              replace: true,
            });
          }}
          selectedItem={filters.filterBy.user?.name}
          placeHolder={t("select")}
          apiUrl={"audits/type/users"}
          mode="single"
          params={{
            user_type: filters.filterBy.userType.name,
          }}
          cacheData={false}
        />

        <div className="flex flex-col">
          <h1 className=" ltr:text-lg-ltr font-semibold rtl:text-lg-rtl px-1 py-[6px]">
            {t("event")}
          </h1>
          <Select>
            <SelectTrigger className="max-w-[260px]  py-[22px] rtl:text-lg-rtl shadow-none hover:shadow-sm bg-card">
              <SelectValue placeholder={filters.filterBy.event} />
            </SelectTrigger>
            <SelectContent className="ltr:text-lg-ltr">
              <SelectItem value="all">{t("all")}</SelectItem>
              <SelectItem value="created">{t("created")}</SelectItem>
              <SelectItem value="deleted">{t("deleted")}</SelectItem>
              <SelectItem value="updated">{t("updated")}</SelectItem>
              <SelectItem value="viewed">{t("viewed")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <APICombobox
          key={filters.filterBy.user?.id}
          readonly={filters.filterBy.lockTable == "true"}
          lable={t("table")}
          className="w-fit"
          placeholderText={t("search_item")}
          errorText={t("no_item")}
          onSelect={(selection: any) => {
            const queryParams = new URLSearchParams();
            queryParams.set("sch_col", filters.search.column);
            queryParams.set("sch_val", filters.search.value);
            queryParams.set("usr_t", filters.filterBy.userType.name);
            queryParams.set("usr_id", filters.filterBy.user.id);
            queryParams.set("usr", filters.filterBy.user.name);
            queryParams.set("usr_s", filters.filterBy.user.selected.toString());
            queryParams.set("evt", filters.filterBy.event);
            queryParams.set("col", filters.filterBy.column.name);
            queryParams.set("tabl", selection?.name);
            queryParams.set("l_tabl", filters.filterBy.lockTable.toString());
            queryParams.set("l_col", "false");
            setDateToURL(queryParams, filters.date);
            navigate(`/audit?${queryParams.toString()}`, {
              replace: true,
            });
          }}
          selectedItem={filters.filterBy.table.name}
          placeHolder={t("select")}
          apiUrl={"audits/table/list"}
          mode="single"
          cacheData={false}
          params={{
            user_id: filters.filterBy.user?.id,
            user_type: filters.filterBy.userType?.name,
          }}
        />
        <APICombobox
          key={filters.filterBy.table?.name}
          readonly={filters.filterBy.lockColumn == "true"}
          className="w-fit"
          placeholderText={t("search_item")}
          errorText={t("no_item")}
          onSelect={(selection: any) => {
            const queryParams = new URLSearchParams();
            queryParams.set("sch_col", filters.search.column);
            queryParams.set("sch_val", filters.search.value);
            queryParams.set("usr_t", filters.filterBy.userType.name);
            queryParams.set("usr_id", filters.filterBy.user.id);
            queryParams.set("usr", filters.filterBy.user.name);
            queryParams.set("usr_s", filters.filterBy.user.selected.toString());
            queryParams.set("evt", filters.filterBy.event);
            queryParams.set("col", selection?.name);
            queryParams.set("tabl", filters.filterBy.table.name);
            queryParams.set("l_tabl", filters.filterBy.lockTable.toString());
            queryParams.set("l_col", filters.filterBy.lockColumn.toString());
            setDateToURL(queryParams, filters.date);
            navigate(`/audit?${queryParams.toString()}`, {
              replace: true,
            });
          }}
          required={true}
          selectedItem={filters.filterBy.column.name}
          placeHolder={t("select_colum")}
          apiUrl={"audits/column/list"}
          mode="single"
          cacheData={false}
          params={{
            table_name: filters.filterBy?.table?.name,
          }}
          lable={t("column")}
        />

        <div className="flex flex-col">
          <h1 className=" ltr:text-lg-ltr font-semibold rtl:text-lg-rtl px-1 py-[7px]">
            {t("date")}
          </h1>
          <CustomMultiDatePicker
            dateOnComplete={(selectedDates: DateObject[]) => {
              console.log("Selected Dates:", selectedDates);
            }}
            value={[]}
            className="w-fit min-w-[260px] py-3 bg-card hover:shadow-sm cursor-pointer"
          />
        </div>
      </div>
      <div className="flex flex-col sm:items-baseline sm:flex-row rounded-md bg-card dark:!bg-black/30 gap-2 flex-1 px-2 py-2">
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
                <AuditDetailsDialog />
              </NastranModel>
            </TableCell>
          </TableRow>
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
