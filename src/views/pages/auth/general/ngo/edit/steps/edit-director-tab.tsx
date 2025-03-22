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
import { IDirector } from "@/lib/types";
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
import { UserPermission } from "@/database/tables";
import { PermissionEnum } from "@/lib/constants";
import BooleanStatusButton from "@/components/custom-ui/button/BooleanStatusButton";
interface EditDirectorTabProps {
  permissions: UserPermission;
  registerationExpired: boolean;
}
export default function EditDirectorTab(props: EditDirectorTabProps) {
  const { permissions, registerationExpired } = props;
  const { t } = useTranslation();
  let { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [selected, setSelected] = useState<{
    visible: boolean;
    director: IDirector | undefined;
  }>({
    visible: false,
    director: undefined,
  });
  const [directors, setDirectors] = useState<IDirector[]>([]);
  const initialize = async () => {
    try {
      if (loading) return;
      setLoading(true);

      // 2. Send data
      const response = await axiosClient.get(`ngo/directors/${id}`);
      if (response.status === 200) {
        const fetch = response.data.directors as IDirector[];
        setDirectors(fetch);
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

  const add = (director: IDirector) => {
    if (director.is_active == 1) {
      const updatedUnFiltered = directors.map((item) => {
        return { ...item, is_active: 0 };
      });
      setDirectors([director, ...updatedUnFiltered]);
    } else {
      setDirectors([director, ...directors]);
    }
  };
  const update = (director: IDirector) => {
    let updatedUnFiltered = [];
    if (director.is_active == 1) {
      updatedUnFiltered = directors.map((item) =>
        item.id === director.id ? director : { ...item, is_active: 0 }
      );
    } else {
      updatedUnFiltered = directors.map((item) =>
        item.id === director.id ? director : item
      );
    }
    setDirectors(updatedUnFiltered);
  };

  const information = permissions.sub.get(
    PermissionEnum.ngo.sub.ngo_director_information
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
            director: undefined,
          });
          return true;
        }}
      >
        <EditDirectorDialog
          hasEdit={!registerationExpired && hasEdit}
          director={selected.director}
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
            {!registerationExpired && hasAdd && (
              <NastranModel
                size="lg"
                isDismissable={false}
                className="py-8"
                button={
                  <PrimaryButton className="text-primary-foreground">
                    {t("change_dir")}
                  </PrimaryButton>
                }
                showDialog={async () => true}
              >
                <EditDirectorDialog hasEdit={hasEdit} onComplete={add} />
              </NastranModel>
            )}

            <Table className="w-full border">
              <TableHeader className="rtl:text-3xl-rtl ltr:text-xl-ltr">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-start">{t("id")}</TableHead>
                  <TableHead className="text-start">{t("name")}</TableHead>
                  <TableHead className="text-start">{t("status")}</TableHead>
                  <TableHead className="text-start">{t("email")}</TableHead>
                  <TableHead className="text-start">{t("contact")}</TableHead>
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
                  directors.map((director: IDirector) => (
                    <TableRowIcon
                      read={hasView}
                      remove={false}
                      edit={false}
                      onEdit={async () => {}}
                      key={director.id}
                      item={director}
                      onRemove={async () => {}}
                      onRead={async (director: IDirector) => {
                        setSelected({
                          visible: true,
                          director: director,
                        });
                      }}
                    >
                      <TableCell className="font-medium">
                        {director.id}
                      </TableCell>
                      <TableCell>{director.name}</TableCell>
                      <TableCell>
                        <BooleanStatusButton
                          id={director.is_active}
                          value1={t("currently")}
                          value2={t("formerly")}
                        />
                      </TableCell>
                      <TableCell className="text-[15px]">
                        {director.email}
                      </TableCell>
                      <TableCell
                        className=" rtl:text-end text-[15px]"
                        dir="ltr"
                      >
                        {director.contact}
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
