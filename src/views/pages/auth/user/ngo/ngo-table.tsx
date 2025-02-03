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
import { UserPermission } from "@/database/tables";
import { CACHE, SectionEnum, StatusEnum } from "@/lib/constants";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";
import axiosClient from "@/lib/axois-client";
import TableRowIcon from "@/components/custom-ui/table/TableRowIcon";
import Pagination from "@/components/custom-ui/table/Pagination";
import CachedImage from "@/components/custom-ui/image/CachedImage";
import { setDateToURL } from "@/lib/utils";
import NastranModel from "@/components/custom-ui/model/NastranModel";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import { ListFilter, Search } from "lucide-react";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import SecondaryButton from "@/components/custom-ui/button/SecondaryButton";
import CustomSelect from "@/components/custom-ui/select/CustomSelect";
import { DateObject } from "react-multi-date-picker";
import {
  NgoInformation,
  NgoPaginationData,
  NgoSearch,
  NgoSort,
  Order,
} from "@/lib/types";
import AddNgo from "./add/add-ngo";
import useCacheDB from "@/lib/indexeddb/useCacheDB";
import { useUserAuthState } from "@/context/AuthContextProvider";
import FilterDialog from "@/components/custom-ui/dialog/filter-dialog";
import StatusButton from "@/components/custom-ui/button/StatusButton";

export function NgoTable() {
  const { user } = useUserAuthState();
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
    sort: sort == null ? "date" : (sort as NgoSort),
    order: order == null ? "asc" : (order as Order),
    search: {
      column: searchColumn == null ? "title" : (searchColumn as NgoSearch),
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
      const response = await axiosClient.get(`ngos/${page}`, {
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
      const fetch = response.data.ngos.data as NgoInformation[];
      const lastPage = response.data.ngos.last_page;
      const totalItems = response.data.ngos.total;
      const perPage = response.data.ngos.per_page;
      const currentPage = response.data.ngos.current_page;
      setNgos({
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
    const count = await getComponentCache(CACHE.NGO_TABLE_PAGINATION_COUNT);
    loadList(count ? count.value : 10, searchInput);
  };
  useEffect(() => {
    initialize();
  }, [sort, startDate, endDate, order, searchColumn, searchValue]);
  const [ngos, setNgos] = useState<{
    filterList: NgoPaginationData;
    unFilterList: NgoPaginationData;
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
  const addItem = (ngo: NgoInformation) => {
    setNgos((prevState) => ({
      filterList: {
        ...prevState.filterList,
        data: [ngo, ...prevState.filterList.data],
      },
      unFilterList: {
        ...prevState.unFilterList,
        data: [ngo, ...prevState.unFilterList.data],
      },
    }));
  };

  const deleteOnClick = async (ngo: NgoInformation) => {
    try {
      const ngoId = ngo.id;
      const response = await axiosClient.delete("ngo/" + ngoId);
      if (response.status == 200) {
        const filtered = ngos.unFilterList.data.filter(
          (item: NgoInformation) => ngoId != item?.id
        );
        const item = {
          data: filtered,
          lastPage: ngos.unFilterList.lastPage,
          totalItems: ngos.unFilterList.totalItems,
          perPage: ngos.unFilterList.perPage,
          currentPage: ngos.unFilterList.currentPage,
        };
        setNgos({ ...ngos, filterList: item, unFilterList: item });
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
  const skeleton = (
    <TableRow>
      <TableCell>
        <Shimmer className="h-[24px] bg-primary/30 w-full rounded-sm" />
      </TableCell>
      <TableCell>
        <Shimmer className="h-[24px] w-full rounded-sm" />
      </TableCell>
      <TableCell>
        <Shimmer className="h-[24px] w-full rounded-sm" />
      </TableCell>
      <TableCell>
        <Shimmer className="h-[24px] w-full rounded-sm" />
      </TableCell>
      <TableCell>
        <Shimmer className="h-[24px] w-full rounded-sm" />
      </TableCell>
      <TableCell>
        <Shimmer className="h-[24px] w-full rounded-sm" />
      </TableCell>
      <TableCell>
        <Shimmer className="h-[24px] w-full rounded-sm" />
      </TableCell>
      <TableCell>
        <Shimmer className="h-[24px] w-full rounded-sm" />
      </TableCell>
    </TableRow>
  );
  const per: UserPermission | undefined = user?.permissions.get(
    SectionEnum.ngo
  );
  const view = per ? per?.view : false;
  const remove = per ? per?.delete : false;
  const edit = per ? per?.edit : false;
  const add = per ? per?.add : false;
  const editOnClick = async (ngo: NgoInformation) => {
    const ngoId = ngo.id;
    if (
      ngo.status_id == StatusEnum.not_logged_in ||
      ngo.status_id == StatusEnum.in_progress ||
      ngo.status_id == StatusEnum.unregistered
    ) {
      navigate(`/ngo/profile/edit/${ngoId}`, {
        state: {
          data: { edit: true },
        },
      });
    } else {
      navigate(`/ngo/${ngoId}`);
    }
  };
  const watchOnClick = async (ngo: NgoInformation) => {
    const ngoId = ngo.id;
    if (edit) {
      if (
        ngo.status_id == StatusEnum.not_logged_in ||
        ngo.status_id == StatusEnum.in_progress ||
        ngo.status_id == StatusEnum.unregistered
      ) {
        navigate(`/ngo/profile/edit/${ngoId}`, {
          state: {
            data: { edit: true },
          },
        });
      } else {
        navigate(`/ngo/${ngoId}`);
      }
    } else {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: t("no_perm_desc"),
      });
    }
  };
  return (
    <>
      <div className="flex flex-col sm:items-baseline sm:flex-row rounded-md bg-card dark:!bg-black/30 gap-2 flex-1 px-2 py-2 mt-4">
        {add && (
          <NastranModel
            size="lg"
            isDismissable={false}
            button={
              <PrimaryButton className="rtl:text-lg-rtl font-semibold ltr:text-md-ltr">
                {t("add")}
              </PrimaryButton>
            }
            showDialog={async () => true}
          >
            <AddNgo onComplete={addItem} />
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
              sortOnComplete={async (filterName: NgoSort) => {
                if (filterName != filters.sort) {
                  const queryParams = new URLSearchParams();
                  queryParams.set("sort", filterName);
                  queryParams.set("order", filters.order);
                  queryParams.set("sch_col", filters.search.column);
                  queryParams.set("sch_val", filters.search.value);
                  setDateToURL(queryParams, filters.date);
                  navigate(`/ngo?${queryParams.toString()}`, {
                    replace: true,
                  });
                }
              }}
              searchFilterChanged={async (filterName: NgoSearch) => {
                if (filterName != filters.search.column) {
                  const queryParams = new URLSearchParams();
                  queryParams.set("sort", filters.sort);
                  queryParams.set("order", filterName);
                  queryParams.set("sch_col", filterName);
                  queryParams.set("sch_val", filters.search.value);
                  setDateToURL(queryParams, filters.date);
                  navigate(`/ngo?${queryParams.toString()}`, {
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
                  navigate(`/ngo?${queryParams.toString()}`, {
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
                  navigate(`/ngo?${queryParams.toString()}`, {
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
                  { name: "name", translate: t("name"), onClick: () => {} },
                  {
                    name: "type",
                    translate: t("type"),
                    onClick: () => {},
                  },
                  {
                    name: "contact",
                    translate: t("contact"),
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
                    name: "id",
                    translate: t("id"),
                    onClick: () => {},
                  },
                  {
                    name: "registration_no",
                    translate: t("registration_no"),
                    onClick: () => {},
                  },
                  { name: "name", translate: t("name"), onClick: () => {} },
                  { name: "type", translate: t("type"), onClick: () => {} },
                  {
                    name: "contact",
                    translate: t("contact"),
                    onClick: () => {},
                  },
                  {
                    name: "email",
                    translate: t("email"),
                    onClick: () => {},
                  },
                ],
              }}
            />
          </NastranModel>
        </div>
        <CustomSelect
          paginationKey={CACHE.NGO_TABLE_PAGINATION_COUNT}
          options={[
            { value: "10", label: "10" },
            { value: "20", label: "20" },
            { value: "50", label: "50" },
          ]}
          className="w-fit sm:self-baseline"
          updateCache={(data: any) => updateComponentCache(data)}
          getCache={async () =>
            await getComponentCache(CACHE.NGO_TABLE_PAGINATION_COUNT)
          }
          placeholder={`${t("select")}...`}
          emptyPlaceholder={t("no_options_found")}
          rangePlaceholder={t("count")}
          onChange={async (value: string) => {
            loadList(parseInt(value));
          }}
        />
      </div>
      <Table className="bg-card dark:!bg-black/30 rounded-md my-[2px] py-8">
        <TableHeader className="rtl:text-3xl-rtl ltr:text-xl-ltr">
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-center w-[60px]">{t("pic")}</TableHead>
            <TableHead className="text-start">{t("id")}</TableHead>
            <TableHead className="text-start">{t("registration_no")}</TableHead>
            <TableHead className="text-start">{t("name")}</TableHead>
            <TableHead className="text-start">{t("type")}</TableHead>
            <TableHead className="text-start w-[60px]">{t("status")}</TableHead>
            <TableHead className="text-start">{t("contact")}</TableHead>
            <TableHead className="text-start">{t("email")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="rtl:text-xl-rtl ltr:text-2xl-ltr">
          {loading ? (
            <>
              {skeleton}
              {skeleton}
            </>
          ) : (
            ngos.filterList.data.map((item: NgoInformation) => (
              <TableRowIcon
                read={view}
                remove={remove}
                edit={edit}
                onEdit={editOnClick}
                key={item.name}
                item={item}
                onRemove={deleteOnClick}
                onRead={watchOnClick}
              >
                <TableCell className="px-1 py-0">
                  <CachedImage
                    src={item?.profile}
                    alt="Avatar"
                    ShimmerIconClassName="size-[18px]"
                    shimmerClassName="size-[36px] mx-auto shadow-lg border border-tertiary rounded-full"
                    className="size-[36px] object-center object-cover mx-auto shadow-lg border border-tertiary rounded-full"
                  />
                </TableCell>
                <TableCell className="truncate">{item.id}</TableCell>
                <TableCell className="truncate rtl:text-md-rtl">
                  {item.registration_no}
                </TableCell>
                <TableCell className="truncate">{item.name}</TableCell>
                <TableCell className="truncate">{item.type}</TableCell>
                <TableCell>
                  <StatusButton
                    status={item.status}
                    status_id={item.status_id}
                  />
                </TableCell>
                <TableCell className="rtl:text-md-rtl truncate">
                  {item.contact}
                </TableCell>
                <TableCell className="rtl:text-md-rtl truncate">
                  {item.email}
                </TableCell>
              </TableRowIcon>
            ))
          )}
        </TableBody>
      </Table>
      <div className="flex justify-between rounded-md bg-card dark:!bg-black/30 flex-1 p-3 items-center">
        <h1 className="rtl:text-lg-rtl ltr:text-md-ltr font-medium">{`${t(
          "page"
        )} ${ngos.unFilterList.currentPage} ${t("of")} ${
          ngos.unFilterList.lastPage
        }`}</h1>
        <Pagination
          lastPage={ngos.unFilterList.lastPage}
          onPageChange={async (page) => {
            try {
              const count = await getComponentCache(
                CACHE.NGO_TABLE_PAGINATION_COUNT
              );
              const response = await axiosClient.get(`ngos/${page}`, {
                params: {
                  per_page: count ? count.value : 10,
                },
              });
              const fetch = response.data.ngos.data as NgoInformation[];

              const item = {
                currentPage: page,
                data: fetch,
                lastPage: ngos.unFilterList.lastPage,
                totalItems: ngos.unFilterList.totalItems,
                perPage: ngos.unFilterList.perPage,
              };
              setNgos({
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
