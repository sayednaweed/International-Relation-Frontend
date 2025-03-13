import SecondaryButton from "@/components/custom-ui/button/SecondaryButton";
import FilterDialog from "@/components/custom-ui/dialog/filter-dialog";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import NastranModel from "@/components/custom-ui/model/NastranModel";
import Shimmer from "@/components/custom-ui/shimmer/Shimmer";
import Pagination from "@/components/custom-ui/table/Pagination";
import TableRowIcon from "@/components/custom-ui/table/TableRowIcon";
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
import { Approval } from "@/database/tables";
import axiosClient from "@/lib/axois-client";
import { CACHE } from "@/lib/constants";
import useCacheDB from "@/lib/indexeddb/useCacheDB";
import { ApprovalPaginationData, ApprovalSearch } from "@/lib/types";
import { toLocaleDate } from "@/lib/utils";
import { ListFilter, Repeat2, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ViewApprovalDailog from "./view-approval-Dailog";
import StatusButton from "@/components/custom-ui/button/StatusButton";
export interface ApprovedStepTabProps {
  url: string;
}

export default function StepTab(props: ApprovedStepTabProps) {
  const { url } = props;
  const [state] = useGlobalState();
  const searchRef = useRef<HTMLInputElement>(null);
  const { getComponentCache } = useCacheDB();
  const [filters, setFilters] = useState<{
    search: {
      column: ApprovalSearch;
      value: string;
    };
  }>({
    search: {
      column: "id",
      value: "",
    },
  });
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [viewDetails, setViewDetails] = useState<{
    approval_id: string;
    view: boolean;
  }>({
    approval_id: "",
    view: false,
  });
  const [list, setList] = useState<ApprovalPaginationData>({
    data: [],
    last_page: 1,
    total_items: 0,
    per_page: 0,
    current_page: 0,
  });

  const initialize = async (
    searchInput: string | undefined = undefined,
    page: number | undefined
  ) => {
    try {
      if (loading) return;
      setLoading(true);
      const countSore = await getComponentCache(
        CACHE.APPROVAL_TABLE_PAGINATION_COUNT
      );
      const count = countSore?.value ? countSore.value : 10;
      if (!page) {
        page = 1;
      }
      const response = await axiosClient.get(url, {
        params: {
          page: page,
          per_page: count,
          filters: {
            search: {
              column: filters.search.column,
              value: searchInput && searchInput,
            },
          },
        },
      });
      if (response.status == 200) {
        setList(response.data);
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: error.response.data.message,
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    initialize(undefined, undefined);
  }, []);
  const viewApprovalDialog = viewDetails.view && (
    <ViewApprovalDailog
      approval_id={viewDetails.approval_id}
      onComplete={(id: string) => {
        const updatedList = list.data.filter((item: Approval) => item.id != id);
        setList({ ...list, data: updatedList });
      }}
      onClose={() => setViewDetails({ ...viewDetails, view: false })}
    />
  );

  return (
    <>
      {viewApprovalDialog}
      <div className="flex flex-col mb-1 sm:items-baseline items-start justify-start sm:flex-row rounded-md gap-2 flex-1">
        <CustomInput
          size_="lg"
          placeholder={`${t(filters.search.column)}...`}
          parentClassName="w-full sm:w-[300px] md:w-[540px]"
          type="text"
          ref={searchRef}
          className="dark:bg-card"
          startContent={
            <Search className="size-[18px] mx-auto rtl:mr-[4px] text-primary pointer-events-none" />
          }
          endContent={
            <SecondaryButton
              onClick={async () => {
                if (searchRef.current != undefined)
                  await initialize(searchRef.current.value, undefined);
              }}
              className="w-[72px] absolute rtl:left-[6px] ltr:right-[6px] -top-[7px] h-[32px] rtl:text-sm-rtl ltr:text-md-ltr hover:shadow-sm shadow-lg"
            >
              {t("search")}
            </SecondaryButton>
          }
        />
        <div className="flex items-center gap-x-4">
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
              showColumns={{
                sort: false,
                order: false,
                search: true,
                date: false,
              }}
              sortOnComplete={async () => {}}
              searchFilterChanged={async (filterName: ApprovalSearch) => {
                const search = filters.search;
                search.column = filterName;
                setFilters({ ...filters, search: search });
              }}
              orderOnComplete={async () => {}}
              dateOnComplete={() => {}}
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
                    name: "id",
                    translate: t("id"),
                    onClick: () => {},
                  },
                  {
                    name: "requester",
                    translate: t("requester"),
                    onClick: () => {},
                  },
                ],
              }}
            />
          </NastranModel>
          <Repeat2
            className="size-[22px] cursor-pointer text-primary/85 hover:scale-[1.1] transition-transform duration-300 ease-in-out"
            onClick={async () => await initialize(undefined, undefined)}
          />
        </div>
      </div>
      <Table className="bg-card rounded-md mt-1 py-8 w-full">
        <TableHeader className="rtl:text-3xl-rtl ltr:text-xl-ltr">
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-start">{t("id")}</TableHead>
            <TableHead className="text-start">{t("requester")}</TableHead>
            <TableHead className="text-start">{t("request_date")}</TableHead>
            <TableHead className="text-start">{t("event")}</TableHead>
            <TableHead className="text-start">{t("documents")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="rtl:text-xl-rtl ltr:text-lg-ltr">
          {loading ? (
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
            </TableRow>
          ) : list.data.length == 0 ? (
            <TableRow>
              <TableCell
                colSpan={10}
                className="text-center text-primary/90 p-4"
              >
                {t("no_item")}
              </TableCell>
            </TableRow>
          ) : (
            list.data.map((approval: Approval, index: number) => (
              <TableRowIcon
                read={true}
                remove={false}
                edit={false}
                onEdit={async (_approval: Approval) => {}}
                key={index}
                item={approval}
                onRemove={async () => {}}
                onRead={async () =>
                  setViewDetails({
                    approval_id: approval.id,
                    view: !viewDetails.view,
                  })
                }
              >
                <TableCell>{approval.id}</TableCell>
                <TableCell>{approval.requester}</TableCell>
                <TableCell className="text-[15px] font-semibold">
                  {toLocaleDate(new Date(approval.request_date), state)}
                </TableCell>
                <TableCell className=" text-nowrap">
                  <StatusButton
                    status_id={approval.notifier_type_id}
                    status={approval.notifier_type}
                  />
                </TableCell>
                <TableCell>{approval.document_count}</TableCell>
              </TableRowIcon>
            ))
          )}
        </TableBody>
      </Table>
      <div className="flex justify-between rounded-md bg-card flex-1 p-3 mt-1 items-center">
        <h1 className="rtl:text-lg-rtl ltr:text-md-ltr font-medium">{`${t(
          "page"
        )} ${list.current_page} ${t("of")} ${list.last_page}`}</h1>
        <Pagination
          lastPage={list.last_page}
          onPageChange={async (page) => await initialize(undefined, page)}
        />
      </div>
    </>
  );
}
