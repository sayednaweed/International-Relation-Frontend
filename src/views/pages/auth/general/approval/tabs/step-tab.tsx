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
import { toast } from "@/components/ui/use-toast";
import { useGlobalState } from "@/context/GlobalStateContext";
import { Approval } from "@/database/tables";
import axiosClient from "@/lib/axois-client";
import { toLocaleDate } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
export interface ApprovedStepTabProps {
  url: string;
}

export default function StepTab(props: ApprovedStepTabProps) {
  const { url } = props;
  const [state] = useGlobalState();

  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);

  const initialize = async () => {
    try {
      const response = await axiosClient.get(url);
      if (response.status == 200) {
        // 1. Add data to list
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
    // initialize();
  }, []);
  return (
    <Table className="bg-card rounded-md mt-1 py-8 w-full">
      <TableHeader className="rtl:text-3xl-rtl ltr:text-xl-ltr">
        <TableRow className="hover:bg-transparent">
          <TableHead className="text-start">{t("id")}</TableHead>
          <TableHead className="text-start">{t("request_comment")}</TableHead>
          <TableHead className="text-start">{t("request_date")}</TableHead>
          <TableHead className="text-start">{t("event")}</TableHead>
          <TableHead className="text-start">{t("approved")}</TableHead>
          <TableHead className="text-start">{t("date")}</TableHead>
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
            <TableCell>
              <Shimmer className="h-[24px] bg-primary/30 w-full rounded-sm" />
            </TableCell>
          </TableRow>
        ) : (
          list.map((approval: Approval, index: number) => (
            <TableRowIcon
              read={false}
              remove={false}
              edit={false}
              onEdit={async (_approval: Approval) => {}}
              key={index}
              item={approval}
              onRemove={async () => {}}
              onRead={async () => {}}
            >
              <TableCell>{approval.id}</TableCell>
              <TableCell>{approval.request_comment}</TableCell>
              <TableCell>
                {toLocaleDate(new Date(approval.created_at), state)}
              </TableCell>
              <TableCell>{approval.notifier_type}</TableCell>
              <TableCell>{approval.approved}</TableCell>
              <TableCell>{approval.created_at}</TableCell>
            </TableRowIcon>
          ))
        )}
      </TableBody>
    </Table>
  );
}
