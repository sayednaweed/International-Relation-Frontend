import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useModelOnRequestHide } from "@/components/custom-ui/model/hook/useModelOnRequestHide";
import { useTranslation } from "react-i18next";
import {
  FilterItem,
  IShowData,
} from "@/components/custom-ui/filter/FilterItem";
import CustomMultiDatePicker from "@/components/custom-ui/DatePicker/CustomMultiDatePicker";
import { DateObject } from "react-multi-date-picker";
import { NewsFilter, NewsSearch, NewsSort, Order } from "@/lib/types";
export interface NewsFilterDialogProps {
  sortOnComplete: (itemName: NewsSort) => void;
  searchFilterChanged: (itemName: NewsSearch) => void;
  orderOnComplete: (itemName: Order) => void;
  dateOnComplete: (selectedDates: DateObject[]) => void;
  filters: NewsFilter;
  filtersShowData: {
    sort: IShowData[];
    order: IShowData[];
    search: IShowData[];
  };
}
export default function FilterDialog(props: NewsFilterDialogProps) {
  const {
    sortOnComplete,
    searchFilterChanged,
    orderOnComplete,
    dateOnComplete,
    filters,
    filtersShowData,
  } = props;
  const { modelOnRequestHide } = useModelOnRequestHide();
  const { t } = useTranslation();
  const handleSort = (itemName: string) => {
    sortOnComplete(itemName as NewsSort);
    modelOnRequestHide();
  };
  const handleSearch = (itemName: string) => {
    searchFilterChanged(itemName as NewsSearch);
    modelOnRequestHide();
  };
  const handleOrder = (itemName: string) => {
    orderOnComplete(itemName as Order);
    modelOnRequestHide();
  };
  const handleDate = (selectedDates: DateObject[]) => {
    dateOnComplete(selectedDates);
    if (selectedDates.length == 2) modelOnRequestHide();
  };

  const sorts = filtersShowData.sort.map((option: IShowData) => ({
    ...option,
    onClick: handleSort, // Adding new 'label' field
  }));
  const orders = filtersShowData.order.map((option: IShowData) => ({
    ...option,
    onClick: handleOrder, // Adding new 'label' field
  }));
  const searchs = filtersShowData.search.map((option: IShowData) => ({
    ...option,
    onClick: handleSearch, // Adding new 'label' field
  }));

  return (
    <Card className="w-fit self-center [backdrop-filter:blur(20px)] bg-white/70 dark:!bg-black/40">
      <CardHeader className="relative text-start">
        <CardTitle className="rtl:text-4xl-rtl ltr:text-lg-ltr text-tertiary">
          {t("search_filters")}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 sm:flex sm:flex-row gap-x-4 pb-12">
        <FilterItem
          selected={filters.sort}
          headerName={t("sort_by")}
          items={sorts}
        />
        <section className="min-w-[120px] space-y-2">
          <h1
            className={
              "uppercase text-start font-semibold border-b border-primary/20 pb-2 rtl:text-2xl-rtl ltr:text-lg-ltr text-primary"
            }
          >
            {t("date")}
          </h1>
          <CustomMultiDatePicker
            value={filters.date}
            dateOnComplete={handleDate}
          />
        </section>
        <FilterItem
          selected={filters.search.column}
          headerName={t("search")}
          items={searchs}
        />
        <FilterItem
          selected={filters.order}
          headerName={t("order")}
          items={orders}
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          className="rtl:text-2xl-rtl ltr:text-lg-ltr"
          onClick={modelOnRequestHide}
        >
          {t("cancel")}
        </Button>
      </CardFooter>
    </Card>
  );
}

// import { CardFooter } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useModelOnRequestHide } from "@/components/custom-ui/model/hook/useModelOnRequestHide";
// import { useTranslation } from "react-i18next";
// import { FilterItem } from "@/components/custom-ui/filter/FilterItem";
// import CustomMultiDatePicker from "@/components/custom-ui/DatePicker/CustomMultiDatePicker";
// import { DateObject } from "react-multi-date-picker";
// import { NewsFilter, NewsSearch, NewsSort, Order } from "@/lib/types";

// export interface NewsFilterDialogProps {
//   sortOnComplete: (itemName: NewsSort) => void;
//   searchOnComplete: (itemName: NewsSearch) => void;
//   orderOnComplete: (itemName: Order) => void;
//   dateOnComplete: (selectedDates: DateObject[]) => void;
//   filters: NewsFilter;
// }
// export default function NewsFilterDialog(props: NewsFilterDialogProps) {
//   const {
//     sortOnComplete,
//     searchOnComplete,
//     orderOnComplete,
//     dateOnComplete,
//     filters,
//   } = props;
//   const { modelOnRequestHide } = useModelOnRequestHide();
//   const { t } = useTranslation();
//   const handleSort = (itemName: string) => {
//     sortOnComplete(itemName as NewsSort);
//     modelOnRequestHide();
//   };
//   const handleSearch = (itemName: string) => {
//     searchOnComplete(itemName as NewsSearch);
//     modelOnRequestHide();
//   };
//   const handleOrder = (itemName: string) => {
//     orderOnComplete(itemName as Order);
//     modelOnRequestHide();
//   };
//   const handleDate = (selectedDates: DateObject[]) => {
//     dateOnComplete(selectedDates);
//     if (selectedDates.length == 2) modelOnRequestHide();
//   };
//   return (
//     <Card className="w-fit self-center [backdrop-filter:blur(20px)] bg-white/70 dark:!bg-black/40">
//       <CardHeader className="relative text-start">
//         <CardTitle className="rtl:text-4xl-rtl ltr:text-lg-ltr text-tertiary">
//           {t("search_filters")}
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="grid grid-cols-2 sm:flex sm:flex-row gap-x-4 pb-12">
//         <FilterItem
//           selected={filters.sort}
//           headerName={t("sort_by")}
//           items={[
//             {
//               name: "id",
//               translate: t("id"),
//               onClick: handleSort,
//             },
//             {
//               name: "type",
//               translate: t("type"),
//               onClick: handleSort,
//             },
//             { name: "priority", translate: t("priority"), onClick: handleSort },
//             { name: "visible", translate: t("visible"), onClick: handleSort },
//             {
//               name: "visibility_date",
//               translate: t("visibility_date"),
//               onClick: handleSort,
//             },
//             { name: "date", translate: t("date"), onClick: handleSort },
//           ]}
//         />
//         <section className="min-w-[120px] space-y-2">
//           <h1
//             className={
//               "uppercase text-start font-semibold border-b border-primary/20 pb-2 rtl:text-2xl-rtl ltr:text-lg-ltr text-primary"
//             }
//           >
//             {t("date")}
//           </h1>
//           <CustomMultiDatePicker
//             value={filters.date}
//             dateOnComplete={handleDate}
//           />
//         </section>
//         <FilterItem
//           selected={filters.search.column}
//           headerName={t("search")}
//           items={[
//             {
//               name: "title",
//               translate: t("title"),
//               onClick: handleSearch,
//             },
//           ]}
//         />
//         <FilterItem
//           selected={filters.order}
//           headerName={t("order")}
//           items={[
//             {
//               name: "asc",
//               translate: t("asc"),
//               onClick: handleOrder,
//             },
//             {
//               name: "desc",
//               translate: t("desc"),
//               onClick: handleOrder,
//             },
//           ]}
//         />
//       </CardContent>
//       <CardFooter className="flex justify-between">
//         <Button
//           variant="outline"
//           className="rtl:text-2xl-rtl ltr:text-lg-ltr"
//           onClick={modelOnRequestHide}
//         >
//           {t("cancel")}
//         </Button>
//       </CardFooter>
//     </Card>
//   );
// }
