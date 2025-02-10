import NastranModel from "@/components/custom-ui/model/NastranModel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import axiosClient from "@/lib/axois-client";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import { RefreshCcw } from "lucide-react";
import Shimmer from "@/components/custom-ui/shimmer/Shimmer";
import TableRowIcon from "@/components/custom-ui/table/TableRowIcon";
import { useParams } from "react-router";
import EditDirectorDialog from "./parts/edit-director-dialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ButtonSpinner from "@/components/custom-ui/spinner/ButtonSpinner";
import { NgoStatus } from "@/database/tables";
import EditNgoStatusDialog from "./parts/edit-ngo-status-dialog";
export default function EditStatusTab() {
  const { t } = useTranslation();
  let { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [selected, setSelected] = useState<{
    visible: boolean;
    ngoStatus: NgoStatus | undefined;
  }>({
    visible: false,
    ngoStatus: undefined,
  });
  const [ngoStatuses, setNgoStatuses] = useState<NgoStatus[]>([]);
  const initialize = async () => {
    try {
      if (loading) return;
      setLoading(true);

      // 2. Send data
      const response = await axiosClient.get(`ngo/statuses/${id}`);
      if (response.status === 200) {
        // const fetch = response.data.directors as IDirector[];
        // setDirectors(fetch);
        if (failed) setFailed(false);
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: "Error!",
        description: error.response.data.message,
      });
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    initialize();
  }, []);

  const add = (ngoStatus: NgoStatus) => {
    if (ngoStatus.is_active == "1") {
      const updatedUnFiltered = ngoStatuses.map((item) => {
        return { ...item, is_active: "0" };
      });
      setNgoStatuses([ngoStatus, ...updatedUnFiltered]);
    } else {
      setNgoStatuses([ngoStatus, ...ngoStatuses]);
    }
  };
  const update = (ngoStatus: NgoStatus) => {
    let updatedUnFiltered = [];
    if (ngoStatus.is_active == "1") {
      updatedUnFiltered = ngoStatuses.map((item) =>
        item.id === ngoStatus.id ? ngoStatus : { ...item, is_active: "0" }
      );
    } else {
      updatedUnFiltered = ngoStatuses.map((item) =>
        item.id === ngoStatus.id ? ngoStatus : item
      );
    }
    setNgoStatuses(updatedUnFiltered);
  };

  const dailog = useMemo(
    () => (
      <NastranModel
        size="lg"
        visible={selected.visible}
        className="py-8"
        isDismissable={false}
        button={<button></button>}
        showDialog={async () => {
          setSelected({
            visible: false,
            ngoStatus: undefined,
          });
          return true;
        }}
      >
        <EditNgoStatusDialog
          ngoStatus={selected.ngoStatus}
          onComplete={update}
        />
      </NastranModel>
    ),
    [selected.visible]
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle className="rtl:text-3xl-rtl ltr:text-2xl-ltr">
          {t("director_information")}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-x-4 gap-y-6 w-full xl:w-1/">
        {failed ? (
          <h1 className="rtl:text-2xl-rtl">{t("u_are_not_authzed!")}</h1>
        ) : (
          <>
            <NastranModel
              size="lg"
              isDismissable={false}
              className="py-8"
              button={
                <PrimaryButton className="text-primary-foreground">
                  {t("add")}
                </PrimaryButton>
              }
              showDialog={async () => true}
            >
              <EditNgoStatusDialog onComplete={add} />
            </NastranModel>
            <Table className="w-full border">
              <TableHeader className="rtl:text-3xl-rtl ltr:text-xl-ltr">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-start">{t("id")}</TableHead>
                  <TableHead className="text-start">{t("name")}</TableHead>
                  <TableHead className="text-start">{t("status")}</TableHead>
                  <TableHead className="text-start">{t("comment")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="rtl:text-xl-rtl ltr:text-lg-ltr">
                {loading ? (
                  <>
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
                  </>
                ) : (
                  ngoStatuses.map((ngoStatus: NgoStatus) => (
                    <TableRowIcon
                      read={false}
                      remove={false}
                      edit={true}
                      onEdit={async (ngoStatus: NgoStatus) => {
                        setSelected({
                          visible: true,
                          ngoStatus: ngoStatus,
                        });
                      }}
                      key={ngoStatus.id}
                      item={ngoStatus}
                      onRemove={async () => {}}
                      onRead={async () => {}}
                    >
                      <TableCell className="font-medium">
                        {ngoStatus.id}
                      </TableCell>
                      <TableCell>{ngoStatus.name}</TableCell>
                      <TableCell>
                        {ngoStatus.is_active == "1" ? (
                          <h1 className="truncate text-center rtl:text-md-rtl ltr:text-lg-ltr bg-green-500 px-1 py-[2px] shadow-md text-primary-foreground font-bold rounded-sm">
                            {t("currently")}
                          </h1>
                        ) : (
                          <h1 className="truncate text-center rtl:text-md-rtl ltr:text-lg-ltr bg-red-500 px-1 py-[2px] shadow-md text-primary-foreground font-bold rounded-sm">
                            {t("formerly")}
                          </h1>
                        )}
                      </TableCell>

                      <TableCell
                        className=" rtl:text-end text-[15px]"
                        dir="ltr"
                      >
                        {ngoStatus.comment}
                      </TableCell>
                    </TableRowIcon>
                  ))
                )}
              </TableBody>
            </Table>
            {dailog}
          </>
        )}
      </CardContent>

      {failed && (
        <CardFooter>
          <PrimaryButton
            disabled={loading}
            onClick={async () => await initialize()}
            className={`${
              loading && "opacity-90"
            } bg-red-500 hover:bg-red-500/70`}
            type="submit"
          >
            <ButtonSpinner loading={loading}>
              {t("failed_retry")}
              <RefreshCcw className="ltr:ml-2 rtl:mr-2" />
            </ButtonSpinner>
          </PrimaryButton>
        </CardFooter>
      )}
    </Card>
  );
}
