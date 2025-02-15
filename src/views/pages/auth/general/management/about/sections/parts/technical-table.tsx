import CachedImage from "@/components/custom-ui/image/CachedImage";
import Shimmer from "@/components/custom-ui/shimmer/Shimmer";
import TableRowIcon from "@/components/custom-ui/table/TableRowIcon";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IStaff } from "@/lib/types";
import { useTranslation } from "react-i18next";

export interface TechnicalTableProps {
  deleteOnClick: (staff: IStaff) => Promise<void>;
  editOnClick: (staff: IStaff) => Promise<void>;
  staffs: IStaff[];
  loading: boolean;
  hasEdit: boolean;
  hasRemove: boolean;
  hasView: boolean;
}

export default function TechnicalTable(props: TechnicalTableProps) {
  const {
    deleteOnClick,
    editOnClick,
    staffs,
    loading,
    hasEdit,
    hasRemove,
    hasView,
  } = props;
  const { t } = useTranslation();
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
    </TableRow>
  );
  return (
    <Table className="bg-card my-[2px] py-8">
      <TableHeader className="rtl:text-3xl-rtl ltr:text-xl-ltr">
        <TableRow className="hover:bg-transparent">
          <TableHead className="text-center px-1 w-[60px]">
            {t("pic")}
          </TableHead>
          <TableHead className="text-start">{t("name_english")}</TableHead>
          <TableHead className="text-start">{t("name_farsi")}</TableHead>
          <TableHead className="text-start">{t("name_pashto")}</TableHead>
          <TableHead className="text-start">{t("contact")}</TableHead>
          <TableHead className="text-start">{t("email")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="rtl:text-xl-rtl ltr:text-2xl-ltr">
        {loading ? (
          <>
            {skeleton}
            {skeleton}
            {skeleton}
          </>
        ) : staffs.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={8}
              className="text-center rtl:text-xl-rtl text-primary/80"
            >
              <h1>{t("no_item")}</h1>
            </TableCell>
          </TableRow>
        ) : (
          staffs.map((item: IStaff) => (
            <TableRowIcon
              read={hasView}
              remove={hasRemove}
              edit={hasEdit}
              onEdit={editOnClick}
              key={item.id}
              item={item}
              onRemove={deleteOnClick}
              onRead={async () => {}}
            >
              <TableCell className="px-1 py-0">
                <CachedImage
                  src={item.picture}
                  alt="Avatar"
                  ShimmerIconClassName="size-[18px]"
                  shimmerClassName="size-[36px] mx-auto shadow-lg border border-tertiary rounded-full"
                  className="size-[36px] object-center object-cover mx-auto shadow-lg border border-tertiary rounded-full"
                />
              </TableCell>
              <TableCell className="rtl:text-md-rtl truncate">
                {item.name_english}
              </TableCell>
              <TableCell className="rtl:text-md-rtl truncate">
                {item.name_farsi}
              </TableCell>
              <TableCell className="rtl:text-md-rtl truncate">
                {item.name_pashto}
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
  );
}
