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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ButtonSpinner from "@/components/custom-ui/spinner/ButtonSpinner";
import { Representor, UserPermission } from "@/database/tables";
import { PermissionEnum } from "@/lib/constants";
import EditRepresentorDialog from "./parts/edit-representor-dialog";
import BooleanStatusButton from "@/components/custom-ui/button/BooleanStatusButton";
import { useGlobalState } from "@/context/GlobalStateContext";
import { toLocaleDate } from "@/lib/utils";
interface EditRepresentativeTabProps {
  permissions: UserPermission;
}
export default function EditRepresentativeTab(
  props: EditRepresentativeTabProps
) {
  const { permissions } = props;
  const [state] = useGlobalState();
  const { t } = useTranslation();
  let { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [selected, setSelected] = useState<{
    visible: boolean;
    representor: Representor | undefined;
  }>({
    visible: false,
    representor: undefined,
  });
  const [representors, setRepresentors] = useState<Representor[]>([]);
  const initialize = async () => {
    try {
      if (loading) return;
      setLoading(true);

      // 2. Send data
      const response = await axiosClient.get(`ngo/representors/${id}`);
      if (response.status === 200) {
        const fetch = response.data as Representor[];
        setRepresentors(fetch);
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

  const add = (representor: Representor) => {
    if (representor.is_active == 1) {
      const updatedUnFiltered = representors.map((item) => {
        return { ...item, is_active: 0 };
      });
      setRepresentors([representor, ...updatedUnFiltered]);
    } else {
      setRepresentors([representor, ...representors]);
    }
  };
  const update = (representor: Representor) => {
    let updatedUnFiltered = [];
    if (representor.is_active == 1) {
      updatedUnFiltered = representors.map((item) =>
        item.id === representor.id ? representor : { ...item, is_active: 0 }
      );
    } else {
      updatedUnFiltered = representors.map((item) =>
        item.id === representor.id ? representor : item
      );
    }
    setRepresentors(updatedUnFiltered);
  };

  const information = permissions.sub.get(
    PermissionEnum.ngo.sub.ngo_representative
  );
  const hasAdd = information?.add;
  const hasEdit = information?.edit;
  const hasView = information?.view;
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
            representor: undefined,
          });
          return true;
        }}
      >
        <EditRepresentorDialog
          hasEdit={hasEdit}
          representor={selected.representor}
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
          {t("representative")}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-x-4 gap-y-6 w-full xl:w-1/">
        {failed ? (
          <h1 className="rtl:text-2xl-rtl">{t("u_are_not_authzed!")}</h1>
        ) : (
          <>
            {hasAdd && (
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
                <EditRepresentorDialog hasEdit={hasEdit} onComplete={add} />
              </NastranModel>
            )}

            <Table className="w-full border">
              <TableHeader className="rtl:text-3xl-rtl ltr:text-xl-ltr">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-start">{t("full_name")}</TableHead>
                  <TableHead className="text-start">{t("status")}</TableHead>
                  <TableHead className="text-start">{t("saved_by")}</TableHead>
                  <TableHead className="text-start">
                    {t("agreement_nu")}
                  </TableHead>
                  <TableHead className="text-start">
                    {t("start_date")}
                  </TableHead>
                  <TableHead className="text-start">{t("end_date")}</TableHead>
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
                      <TableCell>
                        <Shimmer className="h-[24px] bg-primary/30 w-full rounded-sm" />
                      </TableCell>
                    </TableRow>
                  </>
                ) : (
                  representors.map((representor: Representor) => (
                    <TableRowIcon
                      read={hasView}
                      remove={false}
                      edit={false}
                      onEdit={async () => {}}
                      key={representor.id}
                      item={representor}
                      onRemove={async () => {}}
                      onRead={async (representor: Representor) => {
                        setSelected({
                          visible: true,
                          representor: representor,
                        });
                      }}
                    >
                      <TableCell className="font-medium">
                        {representor.full_name}
                      </TableCell>
                      <TableCell>
                        <BooleanStatusButton
                          id={representor.is_active}
                          value1={t("currently")}
                          value2={t("formerly")}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {representor.saved_by}
                      </TableCell>
                      <TableCell className="font-semibold text-[14px]">
                        {representor.agreement_no}
                      </TableCell>
                      <TableCell>
                        {representor.start_date
                          ? toLocaleDate(
                              new Date(representor.start_date),
                              state
                            )
                          : ""}
                      </TableCell>
                      <TableCell>
                        {representor.end_date
                          ? toLocaleDate(new Date(representor.end_date), state)
                          : ""}
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
