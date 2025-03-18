import Shimmer from "@/components/custom-ui/shimmer/Shimmer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { useTranslation } from "react-i18next";
export default function Activity() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
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
      <Table className="bg-card rounded-md my-[2px] py-8">
        <TableHeader className="rtl:text-3xl-rtl ltr:text-xl-ltr">
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-start">{t("id")}</TableHead>
            <TableHead className="text-start">{t("user")}</TableHead>
            <TableHead className="text-start">{t("type")}</TableHead>
            <TableHead className="text-start">{t("action")}</TableHead>
            <TableHead className="text-start">
              {t("local_ip_address")}
            </TableHead>
            <TableHead className="text-start">
              {t("public_ip_address")}
            </TableHead>
            <TableHead className="text-start">{t("agent")}</TableHead>
            <TableHead className="text-start">{t("attempt")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="rtl:text-xl-rtl ltr:text-2xl-ltr">
          {loading ? (
            <>
              {skeleton}
              {skeleton}
              {skeleton}
            </>
          ) : (
            <TableRow>
              <TableCell className="rtl:text-md-rtl truncate px-1 py-0">
                23
              </TableCell>
              <TableCell>Naweed</TableCell>
              <TableCell>SuperAdmin</TableCell>
              <TableCell
                dir="ltr"
                className="truncate rtl:text-sm-rtl rtl:text-end"
              >
                delete
              </TableCell>
              <TableCell dir="ltr" className="rtl:text-end rtl:text-sm-rtl">
                172.23.45.56
              </TableCell>
              <TableCell>175.45.44.66</TableCell>
              <TableCell>Grome_browser</TableCell>
              <TableCell>success</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
