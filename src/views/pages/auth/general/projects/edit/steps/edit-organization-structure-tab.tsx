import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import axiosClient from "@/lib/axois-client";
import { useParams } from "react-router";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import ButtonSpinner from "@/components/custom-ui/spinner/ButtonSpinner";
import { RefreshCcw } from "lucide-react";
import { useGlobalState } from "@/context/GlobalStateContext";
import { ProjectManager, UserPermission } from "@/database/tables";
import { PermissionEnum } from "@/lib/constants";
import NastranModel from "@/components/custom-ui/model/NastranModel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Shimmer from "@/components/custom-ui/shimmer/Shimmer";
import BooleanStatusButton from "@/components/custom-ui/button/BooleanStatusButton";
import { toLocaleDate } from "@/lib/utils";
import EdirOrgStructureDialog from "@/views/pages/auth/general/projects/edit/steps/parts/edit-org-structure-dialog";

interface EditOrganizationStructureTabProps {
  permissions: UserPermission;
}
export default function EditOrganizationStructureTab(
  props: EditOrganizationStructureTabProps
) {
  const { permissions } = props;
  const { t } = useTranslation();
  const { id } = useParams();
  const [state] = useGlobalState();
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [projectManagers, setProjectManagers] = useState<ProjectManager[]>([]);
  const initialize = async () => {
    try {
      if (loading) return;
      setLoading(true);
      // 2. Send data
      const response = await axiosClient.get(`statuses/ngo/${id}`);
      if (response.status === 200) {
        const fetch = response.data.statuses as ProjectManager[];
        setProjectManagers(fetch);
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

  const add = (projectManager: ProjectManager) => {
    if (projectManager.is_active) {
      const updatedUnFiltered = projectManagers.map((item) => {
        return { ...item, is_active: false };
      });
      setProjectManagers([projectManager, ...updatedUnFiltered]);
    } else {
      setProjectManagers([projectManager, ...projectManagers]);
    }
  };

  const per = permissions.sub.get(PermissionEnum.projects.sub.organ_structure);
  const hasEdit = per?.edit;
  console.log(projectManagers);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="rtl:text-3xl-rtl ltr:text-2xl-ltr">
          {t("status")}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-x-4 gap-y-6 w-full xl:w-1/">
        {failed ? (
          <h1 className="rtl:text-2xl-rtl">{t("u_are_not_authzed!")}</h1>
        ) : (
          <>
            {hasEdit && (
              <NastranModel
                size="lg"
                isDismissable={false}
                className="py-8"
                button={
                  <PrimaryButton className="text-primary-foreground">
                    {t("change_status")}
                  </PrimaryButton>
                }
                showDialog={async () => true}
              >
                <EdirOrgStructureDialog onComplete={add} />
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
                  <TableHead className="text-start">{t("date")}</TableHead>
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
                  projectManagers.map((item: ProjectManager, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.full_name}</TableCell>
                      <TableCell>
                        <BooleanStatusButton
                          getColor={function (): {
                            style: string;
                            value?: string;
                          } {
                            return item.is_active
                              ? {
                                  style: "border-green-500/90",
                                  value: t(""),
                                }
                              : {
                                  style: "border-red-500",
                                  value: t(""),
                                };
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <BooleanStatusButton
                          getColor={function (): {
                            style: string;
                            value?: string;
                          } {
                            return item.is_active
                              ? {
                                  style: "border-green-500/90",
                                  value: t("currently"),
                                }
                              : {
                                  style: "border-red-500",
                                  value: t("formerly"),
                                };
                          }}
                        />
                      </TableCell>
                      <TableCell className="truncate max-w-44">
                        {item.email}
                      </TableCell>
                      <TableCell className="truncate max-w-44">
                        {item.contact}
                      </TableCell>
                      <TableCell className="truncate">
                        {toLocaleDate(new Date(item.created_at), state)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
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
