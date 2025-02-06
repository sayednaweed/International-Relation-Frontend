import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { useUserAuthState } from "@/context/AuthContextProvider";
import { UserPermission } from "@/database/tables";
import { SectionEnum } from "@/lib/constants";
import NastranModel from "@/components/custom-ui/model/NastranModel";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import AddDirectorDialog from "./parts/add-director-dialog";
import axiosClient from "@/lib/axois-client";
import { IDirector } from "@/lib/types";
import { toast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableRowIcon from "@/components/custom-ui/table/TableRowIcon";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Shimmer from "@/components/custom-ui/shimmer/Shimmer";

export default function EditNgoDirector() {
  const { user } = useUserAuthState();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  let { id } = useParams();

  const [directors, setDirectors] = useState<
    {
      id: string;
      is_active: string;
      name: string;
      surname: string;
      contact: string;
      email: string;
    }[]
  >([]);
  const editOnClick = async (item: any) => {
    // 1. Fetch director data
    const id = item.id;
  };

  const add = (director: IDirector) => {
    setDirectors((prev) => [director, ...prev]);
  };
  const update = (director: IDirector) => {
    const updated = directors.map((item) =>
      item.id === director.id ? director : item
    );
    setDirectors(updated);
  };

  const loadDirectors = async () => {
    try {
      const response = await axiosClient.get(`ngo/directors/${id}`);
      if (response.status == 200) {
        const directors = response.data.directors;
        setDirectors(directors);
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: error.response.data.message,
      });
      console.log(error);
    }
    setLoading(false);
  };
  useEffect(() => {
    loadDirectors();
  }, []);

  const per: UserPermission | undefined = user?.permissions.get(
    SectionEnum.ngo
  );
  const edit = per ? per?.edit : false;
  const view = per ? per?.view : false;
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
    <Card>
      <CardHeader className="space-y-0">
        <CardTitle className="rtl:text-3xl-rtl ltr:text-2xl-ltr">
          {t("director_information")}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-x-4 gap-y-6 w-full xl:w-1/2">
        <NastranModel
          size="lg"
          isDismissable={false}
          button={
            <PrimaryButton className="text-primary-foreground">
              {t("add")}
            </PrimaryButton>
          }
          showDialog={async () => true}
        >
          <AddDirectorDialog onComplete={add} />
        </NastranModel>
        <Table className="bg-card my-[2px] py-8">
          <TableHeader className="rtl:text-3xl-rtl ltr:text-xl-ltr">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-center px-1 w-[60px]">
                {t("id")}
              </TableHead>
              <TableHead className="text-start">{t("name")}</TableHead>
              <TableHead className="text-start">
                {t("director_sur_en")}
              </TableHead>
              <TableHead className="text-start">{t("status")}</TableHead>
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
            ) : directors.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center rtl:text-xl-rtl text-primary/80"
                >
                  <h1>{t("no_item")}</h1>
                </TableCell>
              </TableRow>
            ) : (
              directors.map((item) => (
                <TableRowIcon
                  read={view}
                  remove={false}
                  edit={edit}
                  onEdit={editOnClick}
                  key={item.id}
                  item={item}
                  onRemove={async () => {}}
                  onRead={async () => {}}
                >
                  <TableCell className="rtl:text-md-rtl truncate">
                    {item.id}
                  </TableCell>
                  <TableCell className="rtl:text-md-rtl truncate">
                    {item.name}
                  </TableCell>
                  <TableCell className="rtl:text-md-rtl truncate">
                    {item.surname}
                  </TableCell>
                  <TableCell className="rtl:text-md-rtl truncate">
                    {item.is_active ? (
                      <h1 className="truncate text-center rtl:text-md-rtl ltr:text-lg-ltr bg-green-500 px-1 py-[2px] shadow-md text-primary-foreground font-bold rounded-sm">
                        {t("active")}
                      </h1>
                    ) : (
                      <h1 className="truncate text-center rtl:text-md-rtl ltr:text-lg-ltr bg-red-500 px-1 py-[2px] shadow-md text-primary-foreground font-bold rounded-sm">
                        {t("in_active")}
                      </h1>
                    )}
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
      </CardContent>
    </Card>
  );
}
